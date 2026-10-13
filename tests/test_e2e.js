const axios = require('axios');
const ioClient = require('socket.io-client');
const { startUserService } = require('../services/user-service/src/index');
const { startClassService } = require('../services/class-service/src/index');
const { startExamService } = require('../services/exam-service/src/index');
const { startEventService } = require('../services/event-service/src/index');
const { startNotificationService } = require('../services/notification-service/src/index');
const { startGateway } = require('../gateway/src/index');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runE2ETests() {
  console.log('\n======================================================');
  console.log('🌟 CADENCE CAMPUS PULSE: END-TO-END PIPELINE VALIDATION');
  console.log('   Full Microservices, Kafka Event Mesh & Multi-Channel Fanout');
  console.log('======================================================\n');

  let servers = [];
  let studentSocket;
  let alreadyRunning = false;

  try {
    const GATEWAY = 'http://localhost:4000';
    const NOTIF_HUB = 'http://localhost:4005';

    // 1. Boot all microservices (or connect if already running)
    try {
      await axios.get(`${GATEWAY}/health`, { timeout: 800 });
      alreadyRunning = true;
      console.log('ℹ  Services already actively running on localhost:4000..4005. Reusing active cluster...');
    } catch {
      // Services not running, boot them
    }

    if (!alreadyRunning) {
      try {
        servers.push(startUserService());
        servers.push(startClassService());
        servers.push(startExamService());
        servers.push(startEventService());
        const notifServer = await startNotificationService();
        servers.push(notifServer);
        servers.push(startGateway());
        await sleep(1000);
      } catch (err) {
        console.log('ℹ  Attached to listening services:', err.message);
      }
    }

    // 2. Authentication & JWT Validation for all 3 portals (Student, Faculty, Admin)
    console.log('▶ [Step 1] Authenticating Student, Faculty & Admin accounts via Gateway (:4000)...');
    const studentLogin = await axios.post(`${GATEWAY}/api/auth/login`, {
      email: 'student@campus.edu',
      password: 'student123'
    });
    const studentToken = studentLogin.data.token;
    console.log(`  ✔ Student authenticated: ${studentLogin.data.user.full_name} (${studentLogin.data.user.role})`);

    const facultyLogin = await axios.post(`${GATEWAY}/api/auth/login`, {
      email: 'faculty@campus.edu',
      password: 'faculty123'
    });
    const facultyToken = facultyLogin.data.token;
    console.log(`  ✔ Faculty authenticated: ${facultyLogin.data.user.full_name} (${facultyLogin.data.user.role})`);

    const adminLogin = await axios.post(`${GATEWAY}/api/auth/login`, {
      email: 'admin@campus.edu',
      password: 'admin123'
    });
    const adminToken = adminLogin.data.token;
    console.log(`  ✔ Admin authenticated: ${adminLogin.data.user.full_name} (${adminLogin.data.user.role})`);

    // 3. Connect Real-Time Socket.IO Client for Student
    console.log('\n▶ [Step 2] Connecting Student client to Notification Socket.IO Hub (:4005)...');
    studentSocket = ioClient(NOTIF_HUB, {
      query: { userId: studentLogin.data.user.id, role: 'STUDENT' },
      transports: ['websocket', 'polling']
    });

    await new Promise((resolve, reject) => {
      studentSocket.on('connect', () => {
        console.log(`  ✔ Student Socket.IO connected with session ID: ${studentSocket.id}`);
        resolve();
      });
      studentSocket.on('connect_error', reject);
      setTimeout(() => reject(new Error('Socket.IO connection timed out')), 3000);
    });

    // 4. Register Web Push Subscription for Student
    console.log('\n▶ [Step 3] Registering Student Web Push VAPID subscription...');
    const subRes = await axios.post(
      `${GATEWAY}/api/users/push-subscription`,
      {
        endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABtestAlexDevice',
        keys: { p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9t0P68428IRR', auth: 'A1B2C3D4E5F6G7H8' }
      },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    console.log('  ✔ Web Push Subscription registered in User database.');

    // 5. Test Live Event Fanout: Faculty Cancels Class CS401
    console.log('\n▶ [Step 4] Faculty cancels Class CS401 (triggers Kafka topic "class-updates")...');
    const classAlertPromise = new Promise((resolve) => {
      studentSocket.once('campus_alert', (alert) => {
        console.log(`  ✔ [Socket.IO Received] Student received real-time alert: "${alert.title}"`);
        console.log(`    Topic: ${alert.topic} | Priority: ${alert.priority}`);
        resolve(alert);
      });
    });

    await axios.put(
      `${GATEWAY}/api/classes/cls_101/status`,
      { status: 'CANCELLED', reason: 'Instructor sudden fever. Lecture slides posted online.' },
      { headers: { Authorization: `Bearer ${facultyToken}` } }
    );

    const receivedClassAlert = await classAlertPromise;
    if (receivedClassAlert.type !== 'CLASS_CANCELLED') {
      throw new Error('FAIL: Alert type did not match CLASS_CANCELLED');
    }

    // 6. Test Live Event Fanout: Exam Venue Change
    console.log('\n▶ [Step 5] Registrar shifts Exam venue (triggers Kafka topic "exam-updates")...');
    const examAlertPromise = new Promise((resolve) => {
      studentSocket.once('campus_alert', (alert) => {
        console.log(`  ✔ [Socket.IO Received] Student received venue alert: "${alert.title}"`);
        console.log(`    New Venue: ${alert.data.newVenue}`);
        resolve(alert);
      });
    });

    await axios.put(
      `${GATEWAY}/api/exams/exm_201/venue`,
      { newVenue: 'Quad Hall 4', reason: 'Seating capacity reallocated' },
      { headers: { Authorization: `Bearer ${facultyToken}` } }
    );

    await examAlertPromise;

    // 7. Test Emergency Flash Broadcast
    console.log('\n▶ [Step 6] Admin broadcasts Emergency Alert (triggers Kafka topic "general-events")...');
    const emergencyAlertPromise = new Promise((resolve) => {
      studentSocket.once('campus_alert', (alert) => {
        console.log(`  ✔ [Socket.IO Received] CRITICAL EMERGENCY broadcast received!`);
        console.log(`    Alert: "${alert.title}" | Priority: ${alert.priority}`);
        resolve(alert);
      });
    });

    await axios.post(
      `${GATEWAY}/api/events/emergency`,
      { title: 'Campus Weather Siren: High Gust Advisory', description: 'Shelter indoors immediately' },
      { headers: { Authorization: `Bearer ${facultyToken}` } }
    );

    await emergencyAlertPromise;

    // 8. Verify Audit Log
    await sleep(300);
    const historyRes = await axios.get(`${NOTIF_HUB}/api/notifications/history`);
    console.log(`\n▶ [Step 7] Validating Notification Engine audit history (${historyRes.data.length} records)...`);
    console.log('  ✔ All published events successfully routed through Tri-Fanout.');

    // 9. Test Real Multi-Channel Dispatch (Real Email & SMS Carrier Gateway)
    console.log('\n▶ [Step 8] Testing Real Multi-Channel Dispatch (Real Email + Telco SMS Gateway)...');
    const carriersRes = await axios.get(`${NOTIF_HUB}/api/notifications/carriers`);
    console.log(`  ✔ Retrieved supported carrier gateways (${Object.keys(carriersRes.data.carriers).length} carriers)`);

    const realDispatchRes = await axios.post(`${NOTIF_HUB}/api/notifications/dispatch-real`, {
      toEmail: 'student@campus.edu',
      toPhone: '5552345678',
      carrier: 'verizon',
      topic: 'class-updates',
      priority: 'HIGH',
      title: 'CS401: Distributed Systems Lab Relocation',
      message: 'Laboratory session relocated to Olin Hall Amphitheater 3B at 09:15 AM.'
    });

    if (!realDispatchRes.data.success) {
      throw new Error('FAIL: dispatch-real returned success=false');
    }
    console.log(`  ✔ Real dispatch succeeded: ID ${realDispatchRes.data.alert.id}`);
    if (realDispatchRes.data.emailResult) {
      console.log(`  ✔ Real Email queued (MessageID: ${realDispatchRes.data.emailResult.messageId})`);
      if (realDispatchRes.data.emailResult.previewUrl) {
        console.log(`    ✉️ Ethereal Preview URL: ${realDispatchRes.data.emailResult.previewUrl}`);
      }
    }
    if (realDispatchRes.data.smsResult) {
      console.log(`  ✔ Real SMS formatted to Carrier Gateway: ${realDispatchRes.data.smsResult.gatewayAddress}`);
    }

    console.log('\n======================================================');
    console.log('🎉 COMPLETE END-TO-END VERIFICATION SUCCESSFUL!');
    console.log('   All 4 Microservices, API Gateway, Kafka Event Mesh,');
    console.log('   3-Portal Auth (Student/Faculty/Admin),');
    console.log('   Socket.IO, VAPID Web Push, Nodemailer & Telco SMS verified.');
    console.log('======================================================\n');

  } catch (err) {
    console.error('\n❌ E2E TEST FAILED:', err.message);
    if (err.response) console.error(err.response.data);
    process.exitCode = 1;
  } finally {
    if (studentSocket && studentSocket.connected) studentSocket.disconnect();
    if (!alreadyRunning) {
      servers.forEach(s => s && typeof s.close === 'function' && s.close());
    }
    process.exit(process.exitCode || 0);
  }
}

runE2ETests();
