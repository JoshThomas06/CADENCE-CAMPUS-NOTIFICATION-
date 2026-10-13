const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'classes_db.json');
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let classes = [];

function initDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      classes = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return;
    } catch (e) {}
  }

  // Pre-seeded Classes
  classes = [
    {
      id: 'cls_101',
      course_code: 'CS401',
      title: 'Distributed Systems',
      instructor_id: 'usr_faculty_002',
      instructor_name: 'Dr. Sarah Lin',
      room: 'Auditorium 3B',
      schedule: 'Mon / Wed 10:00 AM - 11:30 AM',
      status: 'SCHEDULED', // SCHEDULED, CANCELLED, VENUE_CHANGED
      notes: 'Bring laptops with Docker environment prepared.',
      updated_at: new Date().toISOString()
    },
    {
      id: 'cls_102',
      course_code: 'ARCH310',
      title: 'Classical Architecture Studio',
      instructor_id: 'usr_faculty_004',
      instructor_name: 'Prof. Victor Sterling',
      room: 'Quad North Lawn',
      schedule: 'Tue / Thu 01:00 PM - 03:00 PM',
      status: 'SCHEDULED',
      notes: 'Outdoor watercolor and sketching supplies required.',
      updated_at: new Date().toISOString()
    },
    {
      id: 'cls_103',
      course_code: 'BIO201',
      title: 'Cellular & Molecular Biology',
      instructor_id: 'usr_faculty_005',
      instructor_name: 'Dr. Helena Gomez',
      room: 'Science Complex Rm 104',
      schedule: 'Fri 09:00 AM - 12:00 PM',
      status: 'SCHEDULED',
      notes: 'Lab safety goggles mandatory.',
      updated_at: new Date().toISOString()
    }
  ];

  persistDB();
}

function persistDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(classes, null, 2), 'utf8');
}

initDB();

async function getAllClasses() {
  return classes;
}

async function getClassById(id) {
  return classes.find(c => c.id === id || c.course_code.toUpperCase() === id.toUpperCase()) || null;
}

async function cancelClass(id, reason = 'Class session cancelled by instructor') {
  const cls = await getClassById(id);
  if (!cls) throw new Error(`Class ${id} not found`);

  cls.status = 'CANCELLED';
  cls.notes = reason;
  cls.updated_at = new Date().toISOString();
  persistDB();
  return cls;
}

async function changeClassVenue(id, newRoom, reason = 'Relocated for facility maintenance') {
  const cls = await getClassById(id);
  if (!cls) throw new Error(`Class ${id} not found`);

  const previousRoom = cls.room;
  cls.room = newRoom;
  cls.status = 'VENUE_CHANGED';
  cls.notes = `Relocated from ${previousRoom} to ${newRoom}. ${reason}`;
  cls.updated_at = new Date().toISOString();
  persistDB();
  return { cls, previousRoom };
}

module.exports = {
  getAllClasses,
  getClassById,
  cancelClass,
  changeClassVenue
};
