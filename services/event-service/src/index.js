const express = require('express');
const cors = require('cors');
const db = require('./db');
const { ResilientKafkaClient } = require('../../shared/kafka-client');
const { createCloudEvent } = require('../../shared/event-envelope');

const app = express();
const PORT = process.env.EVENT_SERVICE_PORT || 4004;

app.use(cors());
app.use(express.json());

const kafkaClient = new ResilientKafkaClient({ clientId: 'event-service' });

app.get('/health', (req, res) => {
  res.json({
    service: 'Event Microservice',
    status: 'HEALTHY',
    port: PORT,
    topic: 'general-events',
    timestamp: new Date().toISOString()
  });
});

// GET all events
app.get('/api/events', async (req, res) => {
  const events = await db.getAllEvents();
  res.json(events);
});

// POST /api/events (Create standard campus event)
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, category, severity, venue, event_date } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });

    // 1. UPDATE DATABASE FIRST
    const createdEvent = await db.createEvent({
      title,
      description,
      category,
      severity,
      venue,
      event_date,
      created_by: req.headers['x-user-id'] || 'admin'
    });

    // 2. CONSTRUCT EVENT
    const event = createCloudEvent({
      topic: 'general-events',
      eventType: 'NEW_EVENT',
      producer: 'event-service',
      priority: createdEvent.severity || 'NORMAL',
      data: {
        eventId: createdEvent.id,
        title: createdEvent.title,
        description: createdEvent.description,
        category: createdEvent.category,
        venue: createdEvent.venue,
        eventDate: createdEvent.event_date
      },
      metadata: {
        triggeredBy: req.headers['x-user-id'] || 'admin'
      }
    });

    // 3. PUBLISH TO KAFKA
    await kafkaClient.publish('general-events', event, createdEvent.id);
    console.log(`[Event Service] Event published to 'general-events': NEW_EVENT ${createdEvent.id}`);

    res.status(201).json({
      message: 'Event created and published to Kafka',
      event: createdEvent
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/events/emergency (Broadcast life-safety emergency alert)
app.post('/api/events/emergency', async (req, res) => {
  try {
    const { title, description, venue } = req.body;
    if (!title) return res.status(400).json({ error: 'Emergency title is required' });

    // 1. UPDATE DATABASE FIRST
    const alert = await db.createEmergencyAlert({
      title,
      description,
      venue: venue || 'Campus-Wide',
      created_by: req.headers['x-user-id'] || 'admin'
    });

    // 2. CONSTRUCT CRITICAL EVENT
    const event = createCloudEvent({
      topic: 'general-events',
      eventType: 'CAMPUS_EMERGENCY',
      producer: 'event-service',
      priority: 'CRITICAL',
      data: {
        eventId: alert.id,
        title: alert.title,
        description: alert.description,
        venue: alert.venue,
        alertTime: alert.event_date,
        mandatory: true
      },
      metadata: {
        triggeredBy: req.headers['x-user-id'] || 'admin',
        overrideOptOuts: true
      }
    });

    // 3. PUBLISH TO KAFKA BROKER WITH HIGHEST PRIORITY
    await kafkaClient.publish('general-events', event, 'EMERGENCY_BROADCAST');
    console.log(`[Event Service] CRITICAL EMERGENCY broadcast to 'general-events'`);

    res.status(201).json({
      message: 'CAMPUS EMERGENCY BROADCAST published to Kafka',
      alert
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

let server;
function startEventService() {
  server = app.listen(PORT, () => {
    console.log(`[Event Service] Running on port ${PORT}`);
  });
  return server;
}

if (require.main === module) {
  startEventService();
}

module.exports = { app, startEventService, kafkaClient };
