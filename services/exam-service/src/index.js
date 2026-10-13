const express = require('express');
const cors = require('cors');
const db = require('./db');
const { ResilientKafkaClient } = require('../../shared/kafka-client');
const { createCloudEvent } = require('../../shared/event-envelope');

const app = express();
const PORT = process.env.EXAM_SERVICE_PORT || 4003;

app.use(cors());
app.use(express.json());

const kafkaClient = new ResilientKafkaClient({ clientId: 'exam-service' });

app.get('/health', (req, res) => {
  res.json({
    service: 'Exam Microservice',
    status: 'HEALTHY',
    port: PORT,
    topic: 'exam-updates',
    timestamp: new Date().toISOString()
  });
});

// GET all exams
app.get('/api/exams', async (req, res) => {
  const exams = await db.getAllExams();
  res.json(exams);
});

// GET single exam
app.get('/api/exams/:id', async (req, res) => {
  const exam = await db.getExamById(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  res.json(exam);
});

// PUT /api/exams/:id/venue (AC-2: Change an exam venue)
app.put('/api/exams/:id/venue', async (req, res) => {
  try {
    const { newVenue, reason } = req.body;
    if (!newVenue) return res.status(400).json({ error: 'newVenue is required' });

    // 1. UPDATE DATABASE FIRST
    const { exam, previousVenue } = await db.changeExamVenue(req.params.id, newVenue, reason);

    // 2. CONSTRUCT STRONGLY-TYPED CLOUDEVENT
    const event = createCloudEvent({
      topic: 'exam-updates',
      eventType: 'VENUE_CHANGED',
      producer: 'exam-service',
      priority: 'HIGH',
      data: {
        examId: exam.id,
        courseCode: exam.course_code,
        examTitle: exam.title,
        previousVenue,
        newVenue: exam.venue,
        examDate: exam.exam_date,
        durationMinutes: exam.duration_minutes,
        reason: exam.notes
      },
      metadata: {
        triggeredBy: req.headers['x-user-id'] || 'system'
      }
    });

    // 3. PUBLISH TO KAFKA BROKER (AC-3)
    await kafkaClient.publish('exam-updates', event, exam.course_code);
    console.log(`[Exam Service] Event published to 'exam-updates': VENUE_CHANGED for ${exam.course_code}`);

    res.json({
      message: 'Exam venue updated successfully and event published to Kafka',
      exam
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/exams/:id/postpone (Postpone an exam)
app.put('/api/exams/:id/postpone', async (req, res) => {
  try {
    const { newDate, reason } = req.body;
    if (!newDate) return res.status(400).json({ error: 'newDate is required' });

    // 1. UPDATE DATABASE FIRST
    const { exam, previousDate } = await db.postponeExam(req.params.id, newDate, reason);

    // 2. CONSTRUCT EVENT
    const event = createCloudEvent({
      topic: 'exam-updates',
      eventType: 'EXAM_POSTPONED',
      producer: 'exam-service',
      priority: 'URGENT',
      data: {
        examId: exam.id,
        courseCode: exam.course_code,
        examTitle: exam.title,
        previousDate,
        newDate: exam.exam_date,
        venue: exam.venue,
        durationMinutes: exam.duration_minutes,
        reason: exam.notes
      },
      metadata: {
        triggeredBy: req.headers['x-user-id'] || 'system'
      }
    });

    // 3. PUBLISH TO KAFKA BROKER
    await kafkaClient.publish('exam-updates', event, exam.course_code);
    console.log(`[Exam Service] Event published to 'exam-updates': EXAM_POSTPONED for ${exam.course_code}`);

    res.json({
      message: 'Exam postponed successfully and event published to Kafka',
      exam
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

let server;
function startExamService() {
  server = app.listen(PORT, () => {
    console.log(`[Exam Service] Running on port ${PORT}`);
  });
  return server;
}

if (require.main === module) {
  startExamService();
}

module.exports = { app, startExamService, kafkaClient };
