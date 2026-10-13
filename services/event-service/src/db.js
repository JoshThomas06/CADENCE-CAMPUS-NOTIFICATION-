const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'events_db.json');
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let events = [];

function initDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      events = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return;
    } catch (e) {}
  }

  // Pre-seeded Events
  events = [
    {
      id: 'evt_301',
      title: 'Distinguished Guest Lecture: Distributed Systems at Scale',
      description: 'Keynote by Turing Award Laureate Dr. Leslie Lamport on consensus and event-driven ordering.',
      category: 'ACADEMIC',
      severity: 'NORMAL',
      venue: 'Dean Hall Auditorium',
      event_date: '2026-10-20T17:00:00.000Z',
      created_by: 'usr_admin_001',
      created_at: new Date().toISOString()
    },
    {
      id: 'evt_302',
      title: 'Annual Campus Quad Autumn Arts Showcase',
      description: 'Student gallery installations, musical performances, and ceramic craft exhibitions.',
      category: 'GENERAL',
      severity: 'NORMAL',
      venue: 'Central Quadrangle Lawn',
      event_date: '2026-10-22T12:00:00.000Z',
      created_by: 'usr_admin_001',
      created_at: new Date().toISOString()
    }
  ];

  persistDB();
}

function persistDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(events, null, 2), 'utf8');
}

initDB();

async function getAllEvents() {
  return events;
}

async function createEvent({ title, description, category = 'GENERAL', severity = 'NORMAL', venue, event_date, created_by }) {
  const newEvt = {
    id: 'evt_' + Date.now().toString(36),
    title,
    description,
    category,
    severity,
    venue,
    event_date: event_date || new Date().toISOString(),
    created_by: created_by || 'system',
    created_at: new Date().toISOString()
  };

  events.unshift(newEvt);
  persistDB();
  return newEvt;
}

async function createEmergencyAlert({ title, description, venue = 'Campus-Wide', created_by }) {
  const emergencyEvt = {
    id: 'emg_' + Date.now().toString(36),
    title,
    description,
    category: 'EMERGENCY',
    severity: 'CRITICAL',
    venue,
    event_date: new Date().toISOString(),
    created_by: created_by || 'admin',
    created_at: new Date().toISOString()
  };

  events.unshift(emergencyEvt);
  persistDB();
  return emergencyEvt;
}

module.exports = {
  getAllEvents,
  createEvent,
  createEmergencyAlert
};
