// Full-Stack Orchestrator: Boots all backend services, API gateway, and frontend Vite dev server
const { spawn } = require('child_process');
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

async function startEverything() {
  console.log('================================================================');
  console.log('🏛️  CADENCE CAMPUS PULSE - FULL STACK SYSTEM ORCHESTRATOR');
  console.log('================================================================\n');

  try {
    // 1. Boot backend microservices
    console.log('📦 Starting Microservices...');
    startUserService();
    startClassService();
    startExamService();
    startEventService();
    await startNotificationService();
    startGateway();

    console.log('\n✅ Backend Services Active:');
    console.log('   • API Gateway:         http://localhost:4000');
    console.log('   • User & Auth Service: http://localhost:4001');
    console.log('   • Class Service:       http://localhost:4002');
    console.log('   • Exam Service:        http://localhost:4003');
    console.log('   • Event Service:       http://localhost:4004');
    console.log('   • Notification Hub:    http://localhost:4005 (Socket.IO + VAPID Web Push)\n');

    // 2. Spawn frontend dev server
    console.log('⚡ Launching Vite React PWA Frontend on http://localhost:3000...\n');
    const frontendDir = path.resolve(__dirname, '../frontend');
    const isWindows = process.platform === 'win32';
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';

    const frontendProc = spawn(npmCmd, ['run', 'dev'], {
      cwd: frontendDir,
      stdio: 'inherit',
      shell: true
    });

    frontendProc.on('error', (err) => {
      console.error('Failed to spawn frontend dev server:', err);
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down Cadence services...');
      frontendProc.kill();
      process.exit(0);
    });
  } catch (err) {
    console.error('❌ Orchestrator encountered an error:', err);
  }
}

if (require.main === module) {
  startEverything();
}

module.exports = { startEverything };
