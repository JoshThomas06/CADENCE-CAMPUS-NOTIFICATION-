const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '..', 'data', 'users_db.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = {
  users: [],
  preferences: [],
  subscriptions: [],
  enrollments: []
};

// Load or Seed DB
function initDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      return;
    } catch (e) {
      console.warn('[UserDB] Error parsing existing db file. Reinitializing fresh seed.');
    }
  }

  // Initial Seed Data
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('admin123', salt);
  const facultyHash = bcrypt.hashSync('faculty123', salt);
  const studentHash = bcrypt.hashSync('student123', salt);

  const adminId = 'usr_admin_001';
  const facultyId = 'usr_faculty_002';
  const studentId = 'usr_student_003';

  db.users = [
    {
      id: adminId,
      email: 'admin@campus.edu',
      password_hash: adminHash,
      full_name: 'Dr. Dean Vance',
      role: 'ADMIN',
      department: 'Campus Administration',
      created_at: new Date().toISOString()
    },
    {
      id: facultyId,
      email: 'faculty@campus.edu',
      password_hash: facultyHash,
      full_name: 'Dr. Sarah Lin',
      role: 'FACULTY',
      department: 'Computer Science',
      created_at: new Date().toISOString()
    },
    {
      id: studentId,
      email: 'student@campus.edu',
      password_hash: studentHash,
      full_name: 'Alex Rivera',
      role: 'STUDENT',
      department: 'Computer Science',
      created_at: new Date().toISOString()
    }
  ];

  db.preferences = [
    {
      user_id: adminId,
      in_app_enabled: true,
      push_enabled: true,
      email_enabled: true,
      class_alerts: true,
      exam_alerts: true,
      emergency_alerts: true
    },
    {
      user_id: facultyId,
      in_app_enabled: true,
      push_enabled: true,
      email_enabled: true,
      class_alerts: true,
      exam_alerts: true,
      emergency_alerts: true
    },
    {
      user_id: studentId,
      in_app_enabled: true,
      push_enabled: true,
      email_enabled: true,
      class_alerts: true,
      exam_alerts: true,
      emergency_alerts: true
    }
  ];

  db.enrollments = [
    { user_id: studentId, course_code: 'CS401' },
    { user_id: studentId, course_code: 'ARCH310' },
    { user_id: facultyId, course_code: 'CS401' }
  ];

  db.subscriptions = [
    {
      id: 'sub_mock_001',
      user_id: studentId,
      endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABmockTokenAlex',
      p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QT9t0P68428IRR',
      auth: 'A1B2C3D4E5F6G7H8',
      created_at: new Date().toISOString()
    }
  ];

  persistDB();
}

function persistDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

initDB();

// Database Interface Methods
async function findUserByEmail(email) {
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

async function findUserById(id) {
  return db.users.find(u => u.id === id) || null;
}

async function createUser({ email, password, full_name, role = 'STUDENT', department = 'General Studies' }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('User already exists with this email address');
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);
  const id = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);

  const newUser = {
    id,
    email,
    password_hash,
    full_name,
    role,
    department,
    created_at: new Date().toISOString()
  };

  db.users.push(newUser);

  // Default Preferences
  db.preferences.push({
    user_id: id,
    in_app_enabled: true,
    push_enabled: true,
    email_enabled: true,
    class_alerts: true,
    exam_alerts: true,
    emergency_alerts: true
  });

  persistDB();
  return newUser;
}

async function getPreferences(userId) {
  let pref = db.preferences.find(p => p.user_id === userId);
  if (!pref) {
    pref = {
      user_id: userId,
      in_app_enabled: true,
      push_enabled: true,
      email_enabled: true,
      class_alerts: true,
      exam_alerts: true,
      emergency_alerts: true
    };
    db.preferences.push(pref);
    persistDB();
  }
  return pref;
}

async function updatePreferences(userId, newPrefs) {
  const pref = await getPreferences(userId);
  Object.assign(pref, newPrefs);
  // Emergency alerts always remain mandatory true
  pref.emergency_alerts = true;
  persistDB();
  return pref;
}

async function savePushSubscription(userId, subscription) {
  const { endpoint, keys } = subscription;
  if (!endpoint) throw new Error('Subscription endpoint is required');

  // Remove duplicate if same endpoint exists
  db.subscriptions = db.subscriptions.filter(s => s.endpoint !== endpoint);

  const subRecord = {
    id: 'sub_' + Date.now().toString(36),
    user_id: userId,
    endpoint,
    p256dh: keys ? keys.p256dh : null,
    auth: keys ? keys.auth : null,
    created_at: new Date().toISOString()
  };

  db.subscriptions.push(subRecord);
  persistDB();
  return subRecord;
}

async function removePushSubscription(userId, endpoint) {
  db.subscriptions = db.subscriptions.filter(s => !(s.user_id === userId && s.endpoint === endpoint));
  persistDB();
  return { success: true };
}

async function getUserSubscriptions(userId) {
  return db.subscriptions.filter(s => s.user_id === userId);
}

async function getAllSubscriptions() {
  return db.subscriptions;
}

async function getRecipientsForTopic(topic, courseCode = null) {
  // If emergency, all users are recipients
  if (topic === 'general-events') {
    return db.users.map(u => {
      const pref = db.preferences.find(p => p.user_id === u.id);
      const subs = db.subscriptions.filter(s => s.user_id === u.id);
      return {
        id: u.id,
        email: u.email,
        name: u.full_name,
        role: u.role,
        preferences: pref,
        pushSubscriptions: subs
      };
    });
  }

  // If class or exam topic, match enrolled students and instructor
  let targetUserIds = [];
  if (courseCode) {
    targetUserIds = db.enrollments
      .filter(e => e.course_code.toUpperCase() === courseCode.toUpperCase())
      .map(e => e.user_id);
  } else {
    targetUserIds = db.users.map(u => u.id);
  }

  return db.users
    .filter(u => targetUserIds.includes(u.id))
    .map(u => {
      const pref = db.preferences.find(p => p.user_id === u.id);
      const subs = db.subscriptions.filter(s => s.user_id === u.id);
      return {
        id: u.id,
        email: u.email,
        name: u.full_name,
        role: u.role,
        preferences: pref,
        pushSubscriptions: subs
      };
    });
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getPreferences,
  updatePreferences,
  savePushSubscription,
  removePushSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getRecipientsForTopic
};
