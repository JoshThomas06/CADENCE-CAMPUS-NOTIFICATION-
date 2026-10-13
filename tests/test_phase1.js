const axios = require('axios');
const { startUserService } = require('../services/user-service/src/index');
const { startGateway } = require('../gateway/src/index');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPhase1Tests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING PHASE 1 AUTOMATED ACCEPTANCE TESTS');
  console.log('   Gateway (:4000) & User Service (:4001)');
  console.log('======================================================\n');

  let userServer;
  let gatewayServer;
  let alreadyRunning = false;

  try {
    const GATEWAY_URL = 'http://localhost:4000';

    try {
      await axios.get(`${GATEWAY_URL}/health`, { timeout: 800 });
      alreadyRunning = true;
      console.log('ℹ  Gateway already running on :4000, reusing active cluster...');
    } catch {
      // Not running, boot them
    }

    if (!alreadyRunning) {
      try {
        userServer = startUserService();
        gatewayServer = startGateway();
        await sleep(800);
      } catch (err) {
        console.log('ℹ  Attached to listening services:', err.message);
      }
    }

    // TEST 1: AC-2 - Verify Gateway rejects unauthenticated request with 401
    console.log('▶ TEST 1 [AC-2]: Rejection of unauthenticated request without token...');
    try {
      await axios.get(`${GATEWAY_URL}/api/users/me`);
      throw new Error('FAIL: Gateway allowed request without Bearer token!');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        console.log('  ✔ PASS [AC-2]: Gateway returned 401 Unauthorized as expected.');
      } else {
        throw new Error(`FAIL: Unexpected response: ${err.message}`);
      }
    }

    // TEST 2: AC-3 - Login pre-seeded student user & get JWT token
    console.log('\n▶ TEST 2 [AC-3]: Login pre-seeded student user via Gateway...');
    const loginRes = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'student@campus.edu',
      password: 'student123'
    });

    if (loginRes.status === 200 && loginRes.data.token) {
      console.log('  ✔ PASS [AC-3]: Login succeeded. JWT token issued.');
      console.log(`    User: ${loginRes.data.user.full_name} (${loginRes.data.user.role})`);
    } else {
      throw new Error('FAIL: Login response did not contain JWT token.');
    }

    const studentToken = loginRes.data.token;

    // TEST 3: AC-1 - Verify Gateway successfully proxies /api/users/me with Bearer token
    console.log('\n▶ TEST 3 [AC-1]: Proxying /api/users/me through Gateway to User Service...');
    const meRes = await axios.get(`${GATEWAY_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${studentToken}`
      }
    });

    if (meRes.status === 200 && meRes.data.user.email === 'student@campus.edu') {
      console.log('  ✔ PASS [AC-1]: Gateway successfully proxied request to User Service.');
      console.log(`    Preferences loaded: in_app=${meRes.data.preferences.in_app_enabled}, push=${meRes.data.preferences.push_enabled}`);
    } else {
      throw new Error('FAIL: Gateway failed to proxy /api/users/me properly.');
    }

    // TEST 4: AC-3 - Save Web Push Subscription object
    console.log('\n▶ TEST 4 [AC-3]: Storing Web Push Subscription object...');
    const subPayload = {
      endpoint: 'https://fcm.googleapis.com/fcm/send/test_device_token_xyz',
      keys: {
        p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9t0P68428IRR',
        auth: 'A1B2C3D4E5F6G7H8'
      }
    };

    const subRes = await axios.post(`${GATEWAY_URL}/api/users/push-subscription`, subPayload, {
      headers: {
        Authorization: `Bearer ${studentToken}`
      }
    });

    if (subRes.status === 201 && subRes.data.subscription.endpoint === subPayload.endpoint) {
      console.log('  ✔ PASS [AC-3]: Web Push Subscription registered successfully.');
    } else {
      throw new Error('FAIL: Web Push Subscription storage failed.');
    }

    // TEST 5: User Registration
    console.log('\n▶ TEST 5: Registering a new Faculty user...');
    const regPayload = {
      email: `prof_${Date.now()}@campus.edu`,
      password: 'password123',
      full_name: 'Prof. Diana Prince',
      role: 'FACULTY',
      department: 'Mathematics'
    };

    const regRes = await axios.post(`${GATEWAY_URL}/api/auth/register`, regPayload);
    if (regRes.status === 201 && regRes.data.token) {
      console.log('  ✔ PASS: New user registered and authenticated.');
    } else {
      throw new Error('FAIL: User registration failed.');
    }

    console.log('\n======================================================');
    console.log('🎉 ALL PHASE 1 ACCEPTANCE CRITERIA VERIFIED (AC-1, AC-2, AC-3)');
    console.log('======================================================\n');

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exitCode = 1;
  } finally {
    if (!alreadyRunning) {
      if (userServer && typeof userServer.close === 'function') userServer.close();
      if (gatewayServer && typeof gatewayServer.close === 'function') gatewayServer.close();
    }
    process.exit(process.exitCode || 0);
  }
}

runPhase1Tests();
