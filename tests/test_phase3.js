const axios = require('axios');
const ioClient = require('socket.io-client');
const { startUserService } = require('../services/user-service/src/index');
const { startClassService } = require('../services/class-service/src/index');
const { startNotificationService } = require('../services/notification-service/src/index');
const { startGateway } = require('../gateway/src/index');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPhase3Tests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING PHASE 3 AUTOMATED ACCEPTANCE TESTS');
  console.log('   Notification Engine Consumer & Multi-Channel Fanout');
  console.log('======================================================\n');

  let servers = [];
  let socket;
  let alreadyRunning = false;

  try {
    const GATEWAY_URL = 'http://localhost:4000';
    const NOTIF_URL = 'http://localhost:4005';

    try {
      await axios.get(`${GATEWAY_URL}/health`, { timeout: 800 });
      alreadyRunning = true;
      console.log('ℹ  Services already running on :4000..:4005, reusing active cluster...');
    } catch {
      // Not running, boot them
    }

    if (!alreadyRunning) {
      try {
        servers.push(startUserService());
        servers.push(startClassService());
        const notifServer = await startNotificationService();
        servers.push(notifServer);
        servers.push(startGateway());
        await sleep(1000);
      } catch (err) {
        console.log('ℹ  Attached to listening services:', err.message);
      }
    }

    // TEST 1: AC-4 - Verify VAPID Public Key Endpoint
    console.log('▶ TEST 1 [AC-4]: Checking VAPID Public Key endpoint (/api/notifications/vapid-public-key)...');
    const vapidRes = await axios.get(`${NOTIF_URL}/api/notifications/vapid-public-key`);
    if (vapidRes.status === 200 && vapidRes.data.publicKey) {
      console.log('  ✔ PASS [AC-4]: VAPID public key returned successfully.');
      console.log(`    Key: ${vapidRes.data.publicKey.substring(0, 32)}...`);
    } else {
      throw new Error('FAIL: VAPID public key missing.');
    }

    // TEST 2: AC-1 & AC-3 - Connect Socket.IO client to Notification Service
    console.log('\n▶ TEST 2 [AC-3]: Connecting client to Socket.IO Server (:4005)...');
    socket = ioClient(NOTIF_URL, {
      query: { userId: 'usr_student_003', role: 'STUDENT' },
      transports: ['websocket', 'polling']
    });

    await new Promise((resolve, reject) => {
      socket.on('connect', () => {
        console.log(`  ✔ PASS [AC-3]: Socket.IO connected with id ${socket.id}`);
        resolve();
      });
      socket.on('connect_error', reject);
      setTimeout(() => reject(new Error('Socket.IO connection timeout')), 3000);
    });

    // TEST 3: AC-1, AC-2, AC-3, AC-5 - Trigger Class cancellation and verify real-time Socket.IO receipt
    console.log('\n▶ TEST 3 [AC-1, AC-2, AC-3, AC-5]: Triggering Class Cancellation and awaiting consumer fanout...');
    
    // Set up real-time listener for incoming alert
    const alertReceivedPromise = new Promise((resolve, reject) => {
      socket.on('campus_alert', (payload) => {
        console.log('  ✔ PASS [AC-3]: Received real-time "campus_alert" event via Socket.IO!');
        console.log(`    Title: "${payload.title}"`);
        console.log(`    Priority: ${payload.priority} | Topic: ${payload.topic}`);
        resolve(payload);
      });
      setTimeout(() => reject(new Error('Timeout waiting for Socket.IO campus_alert')), 4000);
    });

    // Login as Faculty to get token
    const loginRes = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'faculty@campus.edu',
      password: 'faculty123'
    });
    const facultyToken = loginRes.data.token;

    // Trigger Class Cancellation
    await axios.put(
      `${GATEWAY_URL}/api/classes/cls_101/status`,
      { status: 'CANCELLED', reason: 'Class rescheduled due to campus symposium' },
      { headers: { Authorization: `Bearer ${facultyToken}` } }
    );

    // Wait for Socket.IO event to be consumed & delivered
    const alertData = await alertReceivedPromise;
    if (!alertData || alertData.topic !== 'class-updates') {
      throw new Error('FAIL: Received incorrect alert data.');
    }

    // TEST 4: AC-2 - Verify Notification History Audit
    console.log('\n▶ TEST 4 [AC-2]: Inspecting Notification History & Fanout Metrics...');
    await sleep(300);
    const historyRes = await axios.get(`${NOTIF_URL}/api/notifications/history`);
    if (historyRes.status === 200 && historyRes.data.length > 0) {
      const latest = historyRes.data[0];
      console.log('  ✔ PASS [AC-2]: Audit record verified in Notification Engine.');
      console.log(`    Recipients evaluated: ${latest.recipientsEvaluated}`);
      console.log(`    Fanout: Sockets=${latest.fanoutMetrics.sockets}, Push=${latest.fanoutMetrics.webPush}, Email=${latest.fanoutMetrics.email}`);
    } else {
      throw new Error('FAIL: Notification history is empty.');
    }

    console.log('\n======================================================');
    console.log('🎉 ALL PHASE 3 ACCEPTANCE CRITERIA VERIFIED (AC-1 to AC-5)');
    console.log('======================================================\n');

  } catch (error) {
    console.error('\n❌ PHASE 3 TEST FAILED:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exitCode = 1;
  } finally {
    if (socket && socket.connected) socket.disconnect();
    if (!alreadyRunning) {
      servers.forEach(s => s && typeof s.close === 'function' && s.close());
    }
    process.exit(process.exitCode || 0);
  }
}

runPhase3Tests();
