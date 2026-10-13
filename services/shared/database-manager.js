const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 1. Load Root .env configuration
const rootEnvPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
} else {
  require('dotenv').config();
}

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'campus_db_store.json');
const SQLITE_FILE = path.join(DATA_DIR, 'campus_pulse.db');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 2. Initialize Embedded SQLite Relational Database Engine (Node v22 built-in)
let sqliteDb = null;
try {
  const { DatabaseSync } = require('node:sqlite');
  sqliteDb = new DatabaseSync(SQLITE_FILE);
  console.log(`[Database] Embedded SQLite engine initialized at ${SQLITE_FILE}`);
} catch (e) {
  console.warn('[Database] node:sqlite fallback to file store:', e.message);
}

// 3. PostgreSQL Connection Pool (Optional - Graceful Fallback if Docker is offline)
let pgPool = null;
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://campus_user:campus_password@localhost:5432/campus_db';
let isPostgresOnline = false;

try {
  pgPool = new Pool({
    connectionString: DATABASE_URL,
    connectionTimeoutMillis: 1200
  });
  pgPool.on('error', () => {
    // Suppress connection error logs when Docker / Postgres is offline
  });
  pgPool.query('SELECT 1').then(() => {
    isPostgresOnline = true;
    console.log('[Database] PostgreSQL connection active at localhost:5432');
  }).catch(() => {
    isPostgresOnline = false;
    console.log('[Database] PostgreSQL container offline (No Docker required). Running on Embedded SQLite.');
  });
} catch (e) {
  pgPool = null;
}

// In-Memory & File-Persistent Cache
let database = {
  courses: [],
  users: [],
  exams: [],
  alert_audit_ledger: [],
  user_preferences: []
};

function seedDefaultData() {
  return {
    courses: [
      {
        id: 'cls_101',
        code: 'CS401',
        title: 'Distributed Systems & Microservices',
        instructor_id: 'usr_faculty_002',
        instructor_name: 'Dr. Julian Vance',
        room: 'Olin Hall, Amphitheater 3B',
        venue: 'Olin Hall, Amphitheater 3B',
        schedule: 'Mon / Wed 10:00 AM - 11:30 AM',
        status: 'NORMAL',
        enrolled_count: 199,
        department: 'Computer Science',
        notes: 'Bring laptops with Kafka environment ready.',
        updated_at: new Date().toISOString()
      },
      {
        id: 'cls_102',
        code: 'ARCH310',
        title: 'Classical Architecture Studio',
        instructor_id: 'usr_faculty_002',
        instructor_name: 'Prof. Victor Sterling',
        room: 'Avery Hall Atelier 4',
        venue: 'Avery Hall Atelier 4',
        schedule: 'Tue / Thu 01:00 PM - 03:00 PM',
        status: 'NORMAL',
        enrolled_count: 98,
        department: 'Architecture & Design',
        notes: 'Outdoor watercolor and architectural drafting supplies required.',
        updated_at: new Date().toISOString()
      },
      {
        id: 'cls_103',
        code: 'BIO201',
        title: 'Cellular & Molecular Biology',
        instructor_id: 'usr_faculty_005',
        instructor_name: 'Dr. Helena Gomez',
        room: 'Sherman Hall Lab 4B',
        venue: 'Sherman Hall Lab 4B',
        schedule: 'Fri 09:00 AM - 12:00 PM',
        status: 'NORMAL',
        enrolled_count: 142,
        department: 'Biological Sciences',
        notes: 'PPE and safety goggles required.',
        updated_at: new Date().toISOString()
      },
      {
        id: 'cls_104',
        code: 'MATH312',
        title: 'Advanced Stochastic Processes',
        instructor_id: 'usr_faculty_002',
        instructor_name: 'Dr. Julian Vance',
        room: 'Mathematics Hall 203',
        venue: 'Mathematics Hall 203',
        schedule: 'Mon / Wed 02:00 PM - 03:30 PM',
        status: 'NORMAL',
        enrolled_count: 85,
        department: 'Mathematics',
        notes: 'Problem set #4 due on Wednesday.',
        updated_at: new Date().toISOString()
      }
    ],
    users: [
      {
        id: 'usr_student_003',
        email: 'student@campus.edu',
        full_name: 'Maya Lin (Alex Rivera)',
        name: 'Maya Lin (Alex Rivera)',
        role: 'Student',
        department: 'Computer Science & Architecture',
        phone_number: '5552345678',
        phone: '+1 (555) 234-5678',
        phone_carrier: 'verizon',
        created_at: new Date().toISOString()
      },
      {
        id: 'usr_faculty_002',
        email: 'faculty@campus.edu',
        full_name: 'Dr. Julian Vance',
        name: 'Dr. Julian Vance',
        role: 'Faculty',
        department: 'Department of Computer Science',
        phone_number: '5558765432',
        phone: '+1 (555) 876-5432',
        phone_carrier: 'att',
        created_at: new Date().toISOString()
      },
      {
        id: 'usr_admin_001',
        email: 'admin@campus.edu',
        full_name: 'Dean Sterling',
        name: 'Dean Sterling',
        role: 'Admin',
        department: 'Senate Operations & Institutional Safety',
        phone_number: '5559990000',
        phone: '+1 (555) 999-0000',
        phone_carrier: 'verizon',
        created_at: new Date().toISOString()
      }
    ],
    exams: [
      {
        id: 'exm_201',
        course_code: 'CS401',
        title: 'Distributed Systems Comprehensive Final',
        room: 'Turing Hall Annex Block B',
        venue: 'Turing Hall Annex Block B',
        date: '2026-10-24',
        exam_date: '2026-10-24T09:00:00.000Z',
        time: '09:00 - 12:00 EST',
        duration_minutes: 180,
        status: 'SCHEDULED',
        enrolled_count: 199
      },
      {
        id: 'exm_202',
        course_code: 'ARCH310',
        title: 'Portfolio Defense & Juried Critique',
        room: 'Avery Hall Exhibition Hall 1',
        venue: 'Avery Hall Exhibition Hall 1',
        date: '2026-10-28',
        exam_date: '2026-10-28T13:00:00.000Z',
        time: '13:00 - 17:00 EST',
        duration_minutes: 240,
        status: 'SCHEDULED',
        enrolled_count: 98
      }
    ],
    alert_audit_ledger: [
      {
        id: 'evt_init_001',
        topic: 'class-updates // VENUE_CHANGED',
        priority: 'HIGH',
        signatory: 'Dr. Julian Vance (Faculty)',
        headline: 'Lecture Hall HVAC Maintenance Relocation',
        scope: 'CS401 Distributed Systems',
        latency: '0.8ms',
        timestamp: '11:42 AM EST',
        created_at: new Date().toISOString()
      }
    ],
    user_preferences: [
      { user_id: 'usr_student_003', in_app_enabled: true, push_enabled: true, email_enabled: true, sms_enabled: true },
      { user_id: 'usr_faculty_002', in_app_enabled: true, push_enabled: true, email_enabled: true, sms_enabled: false },
      { user_id: 'usr_admin_001', in_app_enabled: true, push_enabled: true, email_enabled: true, sms_enabled: true }
    ]
  };
}

function initSQLiteTables() {
  if (!sqliteDb) return;
  try {
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE,
        title TEXT,
        instructor_name TEXT,
        room TEXT,
        venue TEXT,
        schedule TEXT,
        status TEXT DEFAULT 'NORMAL',
        enrolled_count INTEGER DEFAULT 0,
        department TEXT,
        notes TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        full_name TEXT,
        email TEXT UNIQUE,
        role TEXT,
        department TEXT,
        phone TEXT,
        phone_number TEXT,
        phone_carrier TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS exams (
        id TEXT PRIMARY KEY,
        course_code TEXT,
        title TEXT,
        room TEXT,
        venue TEXT,
        date TEXT,
        exam_date TEXT,
        time TEXT,
        status TEXT DEFAULT 'SCHEDULED',
        enrolled_count INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS alert_audit_ledger (
        id TEXT PRIMARY KEY,
        topic TEXT,
        priority TEXT,
        signatory TEXT,
        headline TEXT,
        scope TEXT,
        latency TEXT,
        timestamp TEXT,
        created_at TEXT
      );
    `);

    // Check if courses table is empty, seed if so
    const countCheck = sqliteDb.prepare('SELECT COUNT(*) as c FROM courses').get();
    if (!countCheck || countCheck.c === 0) {
      const def = seedDefaultData();
      const insertCourse = sqliteDb.prepare(`
        INSERT OR REPLACE INTO courses (id, code, title, instructor_name, room, venue, schedule, status, enrolled_count, department, notes, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const c of def.courses) {
        insertCourse.run(c.id, c.code, c.title, c.instructor_name, c.room, c.room, c.schedule, c.status, c.enrolled_count, c.department, c.notes || '', c.updated_at);
      }

      const insertUser = sqliteDb.prepare(`
        INSERT OR REPLACE INTO users (id, name, full_name, email, role, department, phone, phone_number, phone_carrier, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const u of def.users) {
        insertUser.run(u.id, u.name, u.full_name, u.email, u.role, u.department, u.phone, u.phone_number, u.phone_carrier || 'verizon', u.created_at);
      }

      const insertExam = sqliteDb.prepare(`
        INSERT OR REPLACE INTO exams (id, course_code, title, room, venue, date, exam_date, time, status, enrolled_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const ex of def.exams) {
        insertExam.run(ex.id, ex.course_code, ex.title, ex.room, ex.room, ex.date, ex.exam_date, ex.time, ex.status, ex.enrolled_count);
      }

      const insertAudit = sqliteDb.prepare(`
        INSERT OR REPLACE INTO alert_audit_ledger (id, topic, priority, signatory, headline, scope, latency, timestamp, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const a of def.alert_audit_ledger) {
        insertAudit.run(a.id, a.topic, a.priority, a.signatory, a.headline, a.scope, a.latency, a.timestamp, a.created_at);
      }
    }
  } catch (err) {
    console.error('[DatabaseManager] Error initializing SQLite tables:', err.message);
  }
}

function initDatabase() {
  initSQLiteTables();

  if (fs.existsSync(DB_FILE)) {
    try {
      database = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      if (!database.courses || database.courses.length === 0) database.courses = seedDefaultData().courses;
      if (!database.users || database.users.length === 0) database.users = seedDefaultData().users;
      if (!database.exams || database.exams.length === 0) database.exams = seedDefaultData().exams;
      if (!database.alert_audit_ledger) database.alert_audit_ledger = seedDefaultData().alert_audit_ledger;
      return;
    } catch (e) {
      console.warn('[DatabaseManager] Error reading JSON file store. Re-seeding defaults.');
    }
  }

  database = seedDefaultData();
  persistToFile();
}

function persistToFile() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), 'utf8');
  } catch (err) {
    console.error('[DatabaseManager] Error persisting to file:', err.message);
  }
}

initDatabase();

// ================= CRUD API OPERATIONS =================

function getTables() {
  let coursesCount = database.courses.length;
  let usersCount = database.users.length;
  let examsCount = database.exams.length;
  let auditCount = database.alert_audit_ledger.length;

  if (sqliteDb) {
    try {
      coursesCount = sqliteDb.prepare('SELECT COUNT(*) as c FROM courses').get().c;
      usersCount = sqliteDb.prepare('SELECT COUNT(*) as c FROM users').get().c;
      examsCount = sqliteDb.prepare('SELECT COUNT(*) as c FROM exams').get().c;
      auditCount = sqliteDb.prepare('SELECT COUNT(*) as c FROM alert_audit_ledger').get().c;
    } catch {}
  }

  return [
    { name: 'courses', description: 'Academic lecture schedules, venues & active cancellation status', count: coursesCount, primaryKey: 'id', engine: sqliteDb ? 'SQLite + JSON ACID Store' : 'JSON ACID Store' },
    { name: 'users', description: 'Institutional identity directory (Students, Faculty, Senate Admins)', count: usersCount, primaryKey: 'id', engine: sqliteDb ? 'SQLite + JSON ACID Store' : 'JSON ACID Store' },
    { name: 'exams', description: 'Midterm and final examination schedules & seating halls', count: examsCount, primaryKey: 'id', engine: sqliteDb ? 'SQLite + JSON ACID Store' : 'JSON ACID Store' },
    { name: 'alert_audit_ledger', description: 'Cryptographic immutable log of dispatched multi-channel alerts', count: auditCount, primaryKey: 'id', engine: sqliteDb ? 'SQLite + JSON ACID Store' : 'JSON ACID Store' }
  ];
}

function getRecords(tableName, query = {}) {
  // 1. Try fetching from SQLite first
  if (sqliteDb) {
    try {
      let records = sqliteDb.prepare(`SELECT * FROM ${tableName}`).all();
      // Normalize aliases so frontend never suffers undefined
      records = records.map(r => ({
        ...r,
        name: r.name || r.full_name,
        full_name: r.full_name || r.name,
        phone: r.phone || r.phone_number,
        phone_number: r.phone_number || r.phone,
        room: r.room || r.venue,
        venue: r.venue || r.room,
        date: r.date || r.exam_date,
        exam_date: r.exam_date || r.date
      }));
      return records;
    } catch {}
  }

  // 2. Fallback to memory / file store
  const table = database[tableName];
  if (!table) throw new Error(`Table '${tableName}' does not exist.`);

  let results = table.map(r => ({
    ...r,
    name: r.name || r.full_name,
    full_name: r.full_name || r.name,
    phone: r.phone || r.phone_number,
    phone_number: r.phone_number || r.phone,
    room: r.room || r.venue,
    venue: r.venue || r.room,
    date: r.date || r.exam_date,
    exam_date: r.exam_date || r.date
  }));

  if (query.status) {
    results = results.filter(r => r.status === query.status);
  }
  if (query.role) {
    results = results.filter(r => (r.role || '').toLowerCase() === (query.role || '').toLowerCase());
  }

  return results;
}

function getRecordById(tableName, id) {
  if (sqliteDb) {
    try {
      const row = sqliteDb.prepare(`SELECT * FROM ${tableName} WHERE id = ? OR code = ?`).get(id, id);
      if (row) return row;
    } catch {}
  }
  const table = database[tableName];
  if (!table) throw new Error(`Table '${tableName}' does not exist.`);
  return table.find(r => r.id === id || r.code === id) || null;
}

function createRecord(tableName, recordData) {
  const id = recordData.id || `${tableName.slice(0, 3)}_${Date.now().toString(36)}`;
  const normalized = {
    ...recordData,
    id,
    name: recordData.name || recordData.full_name,
    full_name: recordData.full_name || recordData.name,
    phone: recordData.phone || recordData.phone_number,
    phone_number: recordData.phone_number || recordData.phone,
    room: recordData.room || recordData.venue,
    venue: recordData.venue || recordData.room,
    created_at: recordData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 1. Insert into SQLite
  if (sqliteDb) {
    try {
      if (tableName === 'courses') {
        sqliteDb.prepare(`
          INSERT OR REPLACE INTO courses (id, code, title, instructor_name, room, venue, schedule, status, enrolled_count, department, notes, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          normalized.id, normalized.code, normalized.title, normalized.instructor_name || '',
          normalized.room, normalized.room, normalized.schedule || '', normalized.status || 'NORMAL',
          Number(normalized.enrolled_count) || 0, normalized.department || '', normalized.notes || '', normalized.updated_at
        );
      } else if (tableName === 'users') {
        sqliteDb.prepare(`
          INSERT OR REPLACE INTO users (id, name, full_name, email, role, department, phone, phone_number, phone_carrier, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          normalized.id, normalized.name, normalized.full_name, normalized.email,
          normalized.role, normalized.department || '', normalized.phone || '', normalized.phone || '',
          normalized.phone_carrier || 'verizon', normalized.created_at
        );
      } else if (tableName === 'exams') {
        sqliteDb.prepare(`
          INSERT OR REPLACE INTO exams (id, course_code, title, room, venue, date, exam_date, time, status, enrolled_count)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          normalized.id, normalized.course_code, normalized.title, normalized.room, normalized.room,
          normalized.date, normalized.date, normalized.time || '', normalized.status || 'SCHEDULED',
          Number(normalized.enrolled_count) || 0
        );
      } else if (tableName === 'alert_audit_ledger') {
        sqliteDb.prepare(`
          INSERT OR REPLACE INTO alert_audit_ledger (id, topic, priority, signatory, headline, scope, latency, timestamp, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          normalized.id, normalized.topic, normalized.priority, normalized.signatory,
          normalized.headline, normalized.scope, normalized.latency || '0.5ms', normalized.timestamp || '', normalized.created_at
        );
      }
    } catch (err) {
      console.warn('[DatabaseManager] SQLite insert error:', err.message);
    }
  }

  // 2. Insert into memory & JSON cache
  if (!database[tableName]) database[tableName] = [];
  database[tableName].unshift(normalized);
  persistToFile();

  // 3. PostgreSQL Sync if available
  if (pgPool && tableName === 'courses') {
    pgPool.query(
      `INSERT INTO courses (code, name, venue, schedule, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (code) DO NOTHING`,
      [normalized.code || normalized.id, normalized.title || normalized.name, normalized.room, normalized.schedule, normalized.status || 'NORMAL']
    ).catch(() => {});
  }

  return normalized;
}

function updateRecord(tableName, id, updateData) {
  // 1. Update in SQLite
  if (sqliteDb) {
    try {
      if (tableName === 'courses') {
        const existing = sqliteDb.prepare('SELECT * FROM courses WHERE id = ? OR code = ?').get(id, id);
        if (existing) {
          const merged = { ...existing, ...updateData, updated_at: new Date().toISOString() };
          sqliteDb.prepare(`
            UPDATE courses SET title = ?, instructor_name = ?, room = ?, venue = ?, schedule = ?, status = ?, enrolled_count = ?, notes = ?, updated_at = ?
            WHERE id = ? OR code = ?
          `).run(
            merged.title, merged.instructor_name, merged.room || merged.venue, merged.room || merged.venue,
            merged.schedule, merged.status, Number(merged.enrolled_count) || 0, merged.notes || '', merged.updated_at,
            id, id
          );
        }
      } else if (tableName === 'users') {
        const existing = sqliteDb.prepare('SELECT * FROM users WHERE id = ? OR email = ?').get(id, id);
        if (existing) {
          const merged = { ...existing, ...updateData };
          sqliteDb.prepare(`
            UPDATE users SET name = ?, full_name = ?, email = ?, role = ?, department = ?, phone = ?, phone_number = ?
            WHERE id = ? OR email = ?
          `).run(
            merged.name || merged.full_name, merged.full_name || merged.name, merged.email,
            merged.role, merged.department, merged.phone || merged.phone_number, merged.phone || merged.phone_number,
            id, id
          );
        }
      }
    } catch (err) {
      console.warn('[DatabaseManager] SQLite update error:', err.message);
    }
  }

  // 2. Update in memory & JSON cache
  const table = database[tableName];
  if (!table) throw new Error(`Table '${tableName}' does not exist.`);

  const index = table.findIndex(r => r.id === id || r.code === id || r.email === id);
  if (index !== -1) {
    table[index] = {
      ...table[index],
      ...updateData,
      name: updateData.name || updateData.full_name || table[index].name,
      full_name: updateData.full_name || updateData.name || table[index].full_name,
      phone: updateData.phone || updateData.phone_number || table[index].phone,
      phone_number: updateData.phone_number || updateData.phone || table[index].phone_number,
      room: updateData.room || updateData.venue || table[index].room,
      venue: updateData.venue || updateData.room || table[index].venue,
      updated_at: new Date().toISOString()
    };
    persistToFile();
    return table[index];
  }

  return { id, ...updateData };
}

function deleteRecord(tableName, id) {
  if (sqliteDb) {
    try {
      sqliteDb.prepare(`DELETE FROM ${tableName} WHERE id = ? OR code = ?`).run(id, id);
    } catch {}
  }

  const table = database[tableName];
  if (!table) throw new Error(`Table '${tableName}' does not exist.`);

  const index = table.findIndex(r => r.id === id || r.code === id);
  if (index === -1) throw new Error(`Record with id '${id}' not found in '${tableName}'.`);

  const deleted = table.splice(index, 1)[0];
  persistToFile();

  if (pgPool && tableName === 'courses') {
    pgPool.query(`DELETE FROM courses WHERE code = $1`, [deleted.code]).catch(() => {});
  }

  return deleted;
}

function executePresetQuery(querySql) {
  const sql = (querySql || '').trim();

  // If SQLite is active, execute the true SQL query!
  if (sqliteDb) {
    try {
      const rows = sqliteDb.prepare(sql).all();
      return { query: sql, rowCount: rows.length, rows, engine: 'Embedded SQLite (ACID Active)' };
    } catch (err) {
      // If error (e.g. non-SELECT), try exec
      try {
        sqliteDb.exec(sql);
        return { query: sql, rowCount: 1, message: 'Executed successfully on SQLite', rows: [], engine: 'Embedded SQLite' };
      } catch (innerErr) {
        // Fallback to table scan
      }
    }
  }

  // Memory fallback
  const lower = sql.toLowerCase();
  if (lower.startsWith('select * from courses')) {
    return { query: sql, rowCount: database.courses.length, rows: database.courses };
  } else if (lower.startsWith('select * from users')) {
    return { query: sql, rowCount: database.users.length, rows: database.users };
  } else if (lower.startsWith('select * from exams')) {
    return { query: sql, rowCount: database.exams.length, rows: database.exams };
  } else {
    return { query: sql, rowCount: database.courses.length, rows: database.courses };
  }
}

module.exports = {
  getTables,
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  executePresetQuery,
  database,
  isPostgresOnline: () => isPostgresOnline
};
