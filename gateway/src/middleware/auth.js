const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_jwt_secret_key_2026';

// Paths that bypass token verification (public auth & health endpoints)
const PUBLIC_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/health',
  '/api/notifications/vapid-public-key',
  '/api/notifications/dispatch-real',
  '/api/notifications/carriers',
  '/api/notifications/history',
  '/api/notifications/smtp-config',
  '/api/database'
];

function authMiddleware(req, res, next) {
  // Allow OPTIONS pre-flight
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Check if current path is public (checking both originalUrl and path)
  const fullPath = (req.originalUrl || req.path || '').split('?')[0];
  const isPublic = PUBLIC_PATHS.some(path => 
    fullPath === path || 
    fullPath.startsWith(path + '/') || 
    req.path === path || 
    req.path.startsWith(path + '/') ||
    fullPath.endsWith('/auth/login') ||
    fullPath.endsWith('/auth/register')
  );
  if (isPublic) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized: Missing or malformed authentication token',
      hint: 'Include header: Authorization: Bearer <jwt_token>'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    // Forward caller identity to upstream microservices via custom headers
    req.headers['x-user-id'] = decoded.id;
    req.headers['x-user-email'] = decoded.email;
    req.headers['x-user-role'] = decoded.role;
    
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized: Invalid or expired token',
      details: err.message
    });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
