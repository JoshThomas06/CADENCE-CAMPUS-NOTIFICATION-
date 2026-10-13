const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET || 'campus_jwt_secret_key_2026';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'User & Auth Service',
    status: 'HEALTHY',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Helper to generate signed JWT token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Extract authenticated user ID from Gateway header or direct Bearer token
function getAuthUserId(req) {
  if (req.headers['x-user-id']) {
    return req.headers['x-user-id'];
  }
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
      return decoded.id;
    } catch (e) {
      return null;
    }
  }
  return null;
}

// 1. User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, role = 'STUDENT', department } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full_name are required' });
    }

    const newUser = await db.createUser({ email, password, full_name, role, department });
    const token = generateToken(newUser);
    const preferences = await db.getPreferences(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        department: newUser.department
      },
      preferences,
      token
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2. User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const preferences = await db.getPreferences(user.id);
    const subscriptions = await db.getUserSubscriptions(user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department
      },
      preferences,
      subscriptionsCount: subscriptions.length,
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Current User Profile
app.get('/api/users/me', async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Missing user authentication' });
  }

  const user = await db.findUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const preferences = await db.getPreferences(userId);
  const subscriptions = await db.getUserSubscriptions(userId);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      department: user.department,
      created_at: user.created_at
    },
    preferences,
    subscriptions
  });
});

// 4. Update Delivery Preferences
app.put('/api/users/preferences', async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const updated = await db.updatePreferences(userId, req.body);
    res.json({
      message: 'Preferences updated successfully',
      preferences: updated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Save Web Push Subscription Object
app.post('/api/users/push-subscription', async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { endpoint, keys } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Subscription endpoint is required' });
    }

    const sub = await db.savePushSubscription(userId, { endpoint, keys });
    res.status(201).json({
      message: 'Push subscription stored successfully',
      subscription: sub
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. Delete Push Subscription
app.delete('/api/users/push-subscription', async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { endpoint } = req.body;
  await db.removePushSubscription(userId, endpoint);
  res.json({ message: 'Push subscription removed successfully' });
});

// 7. Internal: Query Recipients (used by Notification Engine)
app.get('/api/users/recipients', async (req, res) => {
  const { topic, courseCode } = req.query;
  const recipients = await db.getRecipientsForTopic(topic, courseCode);
  res.json({
    topic,
    courseCode,
    count: recipients.length,
    recipients
  });
});

let server;
function startUserService() {
  server = app.listen(PORT, () => {
    console.log(`[User Service] Running on port ${PORT}`);
  });
  return server;
}

if (require.main === module) {
  startUserService();
}

module.exports = { app, startUserService };
