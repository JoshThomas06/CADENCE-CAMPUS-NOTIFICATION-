const path = require('path');
const fs = require('fs');

// Load environment variables from root .env
const rootEnvPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
} else {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.GATEWAY_PORT || 4000;

// Enable CORS for frontend clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Role']
}));

// Express JSON parser for gateway-local endpoints
app.use(express.json());

// Gateway Health Endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'API Gateway',
    status: 'HEALTHY',
    port: PORT,
    timestamp: new Date().toISOString(),
    routes: {
      '/api/auth': 'User Service (:4001)',
      '/api/users': 'User Service (:4001)',
      '/api/classes': 'Class Service (:4002)',
      '/api/exams': 'Exam Service (:4003)',
      '/api/events': 'Event Service (:4004)',
      '/api/notifications': 'Notification Service (:4005)',
      '/api/database': 'Embedded & PostgreSQL Database Manager'
    }
  });
});

const dbManager = require('../../services/shared/database-manager');

// Database CRUD Endpoints
app.get('/api/database/tables', (req, res) => {
  res.json({ tables: dbManager.getTables() });
});

app.get('/api/database/tables/:table', (req, res) => {
  try {
    const records = dbManager.getRecords(req.params.table, req.query);
    res.json({ table: req.params.table, count: records.length, records });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/database/tables/:table', (req, res) => {
  try {
    const created = dbManager.createRecord(req.params.table, req.body);
    res.status(201).json({ message: 'Record created successfully', record: created });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/database/tables/:table/:id', (req, res) => {
  try {
    const updated = dbManager.updateRecord(req.params.table, req.params.id, req.body);
    res.json({ message: 'Record updated successfully', record: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/database/tables/:table/:id', (req, res) => {
  try {
    const deleted = dbManager.deleteRecord(req.params.table, req.params.id);
    res.json({ message: 'Record deleted successfully', record: deleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/database/query', (req, res) => {
  try {
    const result = dbManager.executePresetQuery(req.body.query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Apply JWT Authentication Middleware to all /api routes
app.use('/api', authMiddleware);

// Proxy helper with fixRequestBody and pathRewrite so full /api/* path is preserved
function createServiceProxy(targetUrl) {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => req.originalUrl.split('?')[0],
    on: {
      proxyReq: fixRequestBody,
      error: (err, req, res) => {
        console.error(`[Gateway Proxy Error] Target ${targetUrl} unreachable:`, err.message);
        res.status(503).json({
          error: 'Service Unavailable',
          message: `Upstream microservice at ${targetUrl} is offline or unreachable`,
          target: targetUrl
        });
      }
    }
  });
}

// Microservice Route Proxies
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4001';
const CLASS_SERVICE_URL = process.env.CLASS_SERVICE_URL || 'http://localhost:4002';
const EXAM_SERVICE_URL = process.env.EXAM_SERVICE_URL || 'http://localhost:4003';
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://localhost:4004';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4005';

app.use('/api/auth', createServiceProxy(USER_SERVICE_URL));
app.use('/api/users', createServiceProxy(USER_SERVICE_URL));
app.use('/api/classes', createServiceProxy(CLASS_SERVICE_URL));
app.use('/api/exams', createServiceProxy(EXAM_SERVICE_URL));
app.use('/api/events', createServiceProxy(EVENT_SERVICE_URL));
app.use('/api/notifications', createServiceProxy(NOTIFICATION_SERVICE_URL));

let server;
function startGateway() {
  server = app.listen(PORT, () => {
    console.log(`[API Gateway] Running on port ${PORT}`);
    console.log(`[API Gateway] Routing /api/users -> ${USER_SERVICE_URL}`);
  });
  return server;
}

if (require.main === module) {
  startGateway();
}

module.exports = { app, startGateway };
