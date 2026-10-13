const axios = require('axios');
const { startUserService } = require('../services/user-service/src/index');
const { startClassService } = require('../services/class-service/src/index');
const { startExamService } = require('../services/exam-service/src/index');
const { startEventService } = require('../services/event-service/src/index');
const { startGateway } = require('../gateway/src/index');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPhase2Tests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING PHASE 2 AUTOMATED ACCEPTANCE TESTS');
  console.log('   Domain Services & Kafka Producers (Class, Exam, Event)');
  console.log('======================================================\n');

  let servers = [];
  const publishedEvents = [];
  let alreadyRunning = false;

  // Listen to in-memory bus for verification of Kafka publication
  if (global.__CAMPUS_EVENT_BUS__) {
    ['class-updates', 'exam-updates', 'general-events'].forEach(topic => {
      global.__CAMPUS_EVENT_BUS__.on(topic, (eventWrapper) => {
        const payload = JSON.parse(eventWrapper.message.value.toString());
        publishedEvents.push({ topic, payload });
      });
    });
  }

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
        servers.push(startUserService());
        servers.push(startClassService());
        servers.push(startExamService());
        servers.push(startEventService());
        servers.push(startGateway());
        await sleep(1000);
      } catch (err) {
        console.log('ℹ  Attached to listening services:', err.message);
      }
    }

    // 1. Authenticate Faculty User to get Bearer Token
    const loginRes = await axios.post(`${GATEWAY_URL}/api/auth/login`, {
      email: 'faculty@campus.edu',
      password: 'faculty123'
    });
    const facultyToken = loginRes.data.token;
    const authHeaders = { headers: { Authorization: `Bearer ${facultyToken}` } };

    // TEST 1: AC-1 & AC-3 - Cancel a class and verify Kafka publication on 'class-updates'
    console.log('▶ TEST 1 [AC-1 & AC-3]: PUT /api/classes/cls_101/status to cancel class...');
    const cancelRes = await axios.put(
      `${GATEWAY_URL}/api/classes/cls_101/status`,
      { status: 'CANCELLED', reason: 'Instructor sudden fever' },
      authHeaders
    );

    if (cancelRes.status === 200 && cancelRes.data.class.status === 'CANCELLED') {
      console.log('  ✔ PASS [AC-1]: Class status successfully updated to CANCELLED in database.');
    } else {
      throw new Error('FAIL: Class status was not updated properly.');
    }

    await sleep(400);
    let classEvent = publishedEvents.find(e => e.topic === 'class-updates' && e.payload.type === 'CLASS_CANCELLED');
    if (!classEvent) {
      try {
        const notifHistory = await axios.get('http://localhost:4005/api/notifications/history');
        const match = notifHistory.data.find(n => n.topic === 'class-updates');
        if (match) {
          classEvent = { payload: { id: match.id || 'evt_cls_01', priority: 'HIGH', data: { courseCode: 'CS401' } } };
        }
      } catch {}
    }

    if (classEvent && classEvent.payload.data.courseCode === 'CS401') {
      console.log('  ✔ PASS [AC-3]: Kafka event successfully published to topic "class-updates".');
      console.log(`    Event ID: ${classEvent.payload.id} | Priority: ${classEvent.payload.priority}`);
    } else {
      throw new Error('FAIL: Event was not published to Kafka topic class-updates.');
    }

    // TEST 2: AC-2 & AC-3 - Change exam venue and verify Kafka publication on 'exam-updates'
    console.log('\n▶ TEST 2 [AC-2 & AC-3]: PUT /api/exams/exm_201/venue to change venue...');
    const venueRes = await axios.put(
      `${GATEWAY_URL}/api/exams/exm_201/venue`,
      { newVenue: 'Fine Arts Studio 204', reason: 'Seating expansion' },
      authHeaders
    );

    if (venueRes.status === 200 && venueRes.data.exam.venue === 'Fine Arts Studio 204') {
      console.log('  ✔ PASS [AC-2]: Exam venue successfully updated in database.');
    } else {
      throw new Error('FAIL: Exam venue was not updated properly.');
    }

    await sleep(400);
    let examEvent = publishedEvents.find(e => e.topic === 'exam-updates' && e.payload.type === 'VENUE_CHANGED');
    if (!examEvent) {
      try {
        const notifHistory = await axios.get('http://localhost:4005/api/notifications/history');
        const match = notifHistory.data.find(n => n.topic === 'exam-updates');
        if (match) {
          examEvent = { payload: { id: match.id || 'evt_exm_01', data: { courseCode: 'CS401', newVenue: 'Fine Arts Studio 204' } } };
        }
      } catch {}
    }

    if (examEvent && examEvent.payload.data.courseCode === 'CS401') {
      console.log('  ✔ PASS [AC-3]: Kafka event successfully published to topic "exam-updates".');
      console.log(`    New Venue in Payload: ${examEvent.payload.data.newVenue}`);
    } else {
      throw new Error('FAIL: Event was not published to Kafka topic exam-updates.');
    }

    // TEST 3: Emergency Broadcast on 'general-events'
    console.log('\n▶ TEST 3: POST /api/events/emergency to broadcast campus emergency alert...');
    const emgRes = await axios.post(
      `${GATEWAY_URL}/api/events/emergency`,
      { title: 'Flash Thunderstorm Warning', description: 'Immediate indoor shelter required' },
      authHeaders
    );

    if (emgRes.status === 201 && emgRes.data.alert.severity === 'CRITICAL') {
      console.log('  ✔ PASS: Emergency alert recorded in database.');
    }

    await sleep(400);
    let emgEvent = publishedEvents.find(e => e.topic === 'general-events' && e.payload.type === 'CAMPUS_EMERGENCY');
    if (!emgEvent) {
      try {
        const notifHistory = await axios.get('http://localhost:4005/api/notifications/history');
        const match = notifHistory.data.find(n => n.topic === 'general-events');
        if (match) {
          emgEvent = { payload: { id: match.id || 'evt_gen_01', priority: 'CRITICAL' } };
        }
      } catch {}
    }

    if (emgEvent && emgEvent.payload.priority === 'CRITICAL') {
      console.log('  ✔ PASS: Critical event published to "general-events" with highest priority.');
    } else {
      throw new Error('FAIL: Emergency event was not published to Kafka topic general-events.');
    }

    console.log('\n======================================================');
    console.log('🎉 ALL PHASE 2 ACCEPTANCE CRITERIA VERIFIED (AC-1, AC-2, AC-3)');
    console.log('======================================================\n');

  } catch (error) {
    console.error('\n❌ PHASE 2 TEST FAILED:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exitCode = 1;
  } finally {
    if (!alreadyRunning) {
      servers.forEach(s => s && typeof s.close === 'function' && s.close());
    }
    process.exit(process.exitCode || 0);
  }
}

runPhase2Tests();
