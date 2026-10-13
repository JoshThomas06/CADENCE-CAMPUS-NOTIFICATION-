// Orchestrator script to start all microservices, API Gateway, and Notification Engine
const path = require('path');
const fs = require('fs');

// Load environment variables from root .env
const rootEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
} else {
  require('dotenv').config();
}

const { startUserService } = require('../services/user-service/src/index');
const { startClassService } = require('../services/class-service/src/index');
const { startExamService } = require('../services/exam-service/src/index');
const { startEventService } = require('../services/event-service/src/index');
const { startNotificationService } = require('../services/notification-service/src/index');
const { startGateway } = require('../gateway/src/index');

async function startAll() {
  console.log('====================================================');
  console.log('🚀 STARTING CADENCE CAMPUS PULSE PLATFORM');
  console.log('====================================================\n');

  try {
    startUserService();
    startClassService();
    startExamService();
    startEventService();
    await startNotificationService();
    startGateway();

    console.log('\n✅ All Microservices & Gateway running successfully:');
    console.log('   - API Gateway:          http://localhost:4000');
    console.log('   - User & Auth Service:  http://localhost:4001');
    console.log('   - Class Service:        http://localhost:4002');
    console.log('   - Exam Service:         http://localhost:4003');
    console.log('   - Event Service:        http://localhost:4004');
    console.log('   - Notification Engine:  http://localhost:4005 (Socket.IO + VAPID)');
    console.log('   - React PWA Frontend:   http://localhost:3000 (run `npm run dev` in /frontend)');
    console.log('\nReady to process live campus alerts.\n');
  } catch (err) {
    console.error('Failed to start all services:', err);
  }
}

if (require.main === module) {
  startAll();
}

module.exports = { startAll };
