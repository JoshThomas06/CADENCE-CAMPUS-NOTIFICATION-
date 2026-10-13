const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'exams_db.json');
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let exams = [];

function initDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      exams = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return;
    } catch (e) {}
  }

  // Pre-seeded Exams
  exams = [
    {
      id: 'exm_201',
      course_code: 'CS401',
      title: 'Distributed Systems Comprehensive Final',
      venue: 'Main Auditorium Hall 3B',
      exam_date: '2026-10-15T09:00:00.000Z',
      duration_minutes: 180,
      status: 'SCHEDULED', // SCHEDULED, VENUE_CHANGED, POSTPONED
      notes: 'Covers consensus, Kafka topologies, and microservice resilience.',
      updated_at: new Date().toISOString()
    },
    {
      id: 'exm_202',
      course_code: 'ARCH310',
      title: 'Architectural History Midterm Critique',
      venue: 'Exhibition Hall A',
      exam_date: '2026-10-18T14:00:00.000Z',
      duration_minutes: 120,
      status: 'SCHEDULED',
      notes: 'Portfolio review with external jury.',
      updated_at: new Date().toISOString()
    }
  ];

  persistDB();
}

function persistDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(exams, null, 2), 'utf8');
}

initDB();

async function getAllExams() {
  return exams;
}

async function getExamById(id) {
  return exams.find(e => e.id === id || e.course_code.toUpperCase() === id.toUpperCase()) || null;
}

async function changeExamVenue(id, newVenue, reason = 'Reassigned by Registrar to accommodate seating capacity') {
  const exam = await getExamById(id);
  if (!exam) throw new Error(`Exam ${id} not found`);

  const previousVenue = exam.venue;
  exam.venue = newVenue;
  exam.status = 'VENUE_CHANGED';
  exam.notes = `Venue moved from ${previousVenue} to ${newVenue}. ${reason}`;
  exam.updated_at = new Date().toISOString();
  persistDB();
  return { exam, previousVenue };
}

async function postponeExam(id, newDate, reason = 'Exam rescheduled due to academic calendar adjustment') {
  const exam = await getExamById(id);
  if (!exam) throw new Error(`Exam ${id} not found`);

  const previousDate = exam.exam_date;
  exam.exam_date = newDate;
  exam.status = 'POSTPONED';
  exam.notes = `Postponed from ${previousDate} to ${newDate}. ${reason}`;
  exam.updated_at = new Date().toISOString();
  persistDB();
  return { exam, previousDate };
}

module.exports = {
  getAllExams,
  getExamById,
  changeExamVenue,
  postponeExam
};
