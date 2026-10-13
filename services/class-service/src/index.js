const express = require('express');
const cors = require('cors');
const db = require('./db');
const { ResilientKafkaClient } = require('../../shared/kafka-client');
const { createCloudEvent } = require('../../shared/event-envelope');

const app = express();
const PORT = process.env.CLASS_SERVICE_PORT || 4002;

app.use(cors());
app.use(express.json());

const kafkaClient = new ResilientKafkaClient({ clientId: 'class-service' });

app.get('/health', (req, res) => {
  res.json({
    service: 'Class Microservice',
    status: 'HEALTHY',
    port: PORT,
    topic: 'class-updates',
    timestamp: new Date().toISOString()
  });
});

// GET all classes
app.get('/api/classes', async (req, res) => {
  const classes = await db.getAllClasses();
  res.json(classes);
});

// GET single class
app.get('/api/classes/:id', async (req, res) => {
  const cls = await db.getClassById(req.params.id);
  if (!cls) return res.status(404).json({ error: 'Class not found' });
  res.json(cls);
});

// PUT /api/classes/:id/status (AC-1: Cancel a class)
app.put('/api/classes/:id/status', async (req, res) => {
  try {
    const { status, reason } = req.body;
    const classId = req.params.id;

    let updatedClass;
    if (status === 'CANCELLED') {
      // 1. UPDATE DATABASE FIRST
      updatedClass = await db.cancelClass(classId, reason || 'Class cancelled by instructor');

      // 2. CONSTRUCT STRONGLY-TYPED CLOUDEVENT
      const event = createCloudEvent({
        topic: 'class-updates',
        eventType: 'CLASS_CANCELLED',
        producer: 'class-service',
        priority: 'HIGH',
        data: {
          classId: updatedClass.id,
          courseCode: updatedClass.course_code,
          courseTitle: updatedClass.title,
          instructorName: updatedClass.instructor_name,
          room: updatedClass.room,
          scheduleTime: updatedClass.schedule,
          reason: updatedClass.notes,
          status: updatedClass.status
        },
        metadata: {
          triggeredBy: req.headers['x-user-id'] || 'system',
          updatedAt: updatedClass.updated_at
        }
      });

      // 3. PUBLISH TO KAFKA BROKER (AC-3)
      await kafkaClient.publish('class-updates', event, updatedClass.course_code);

      console.log(`[Class Service] Event published to 'class-updates': CLASS_CANCELLED for ${updatedClass.course_code}`);
    } else {
      updatedClass = await db.getClassById(classId);
    }

    res.json({
      message: 'Class status updated successfully',
      class: updatedClass
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/classes/:id/venue (Relocate classroom)
app.put('/api/classes/:id/venue', async (req, res) => {
  try {
    const { newRoom, reason } = req.body;
    if (!newRoom) return res.status(400).json({ error: 'newRoom is required' });

    // 1. UPDATE DATABASE FIRST
    const { cls, previousRoom } = await db.changeClassVenue(req.params.id, newRoom, reason);

    // 2. CONSTRUCT EVENT
    const event = createCloudEvent({
      topic: 'class-updates',
      eventType: 'VENUE_CHANGED',
      producer: 'class-service',
      priority: 'HIGH',
      data: {
        classId: cls.id,
        courseCode: cls.course_code,
        courseTitle: cls.title,
        instructorName: cls.instructor_name,
        previousRoom,
        newRoom: cls.room,
        scheduleTime: cls.schedule,
        reason: cls.notes
      },
      metadata: {
        triggeredBy: req.headers['x-user-id'] || 'system'
      }
    });

    // 3. PUBLISH TO KAFKA
    await kafkaClient.publish('class-updates', event, cls.course_code);
    console.log(`[Class Service] Event published to 'class-updates': VENUE_CHANGED for ${cls.course_code}`);

    res.json({
      message: 'Class venue updated and event published to Kafka',
      class: cls
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

let server;
function startClassService() {
  server = app.listen(PORT, () => {
    console.log(`[Class Service] Running on port ${PORT}`);
  });
  return server;
}

if (require.main === module) {
  startClassService();
}

module.exports = { app, startClassService, kafkaClient };
