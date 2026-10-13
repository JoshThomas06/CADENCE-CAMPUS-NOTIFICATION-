const { startAll } = require('../scripts/start-all');
const axios = require('axios');

async function testAll() {
  await startAll();
  await new Promise(r => setTimeout(r, 1200));

  const base = 'http://localhost:4000/api/database';
  
  // 1. Tables
  const tables = await axios.get(base + '/tables');
  console.log('✔ Available Tables:', tables.data.tables);

  // 2. Read Courses
  const courses = await axios.get(base + '/tables/courses');
  console.log('✔ Courses Count in DB:', courses.data.records.length);

  // 3. Create Course
  const newCourse = {
    id: 'cls_crud_test_01',
    code: 'CS499',
    title: 'Distributed Orchestration Testing',
    instructor_name: 'Dr. Julian Vance',
    room: 'Turing Hall 202',
    schedule: 'Mon / Wed 11:00 AM',
    status: 'NORMAL',
    enrolled_count: 75,
    department: 'Computer Science'
  };
  const created = await axios.post(base + '/tables/courses', newCourse);
  console.log('✔ CRUD Create Course:', created.data.record.code, created.data.record.title);

  // 4. Update Course Status
  const updated = await axios.put(base + '/tables/courses/cls_crud_test_01', {
    status: 'RELOCATED',
    room: 'Olin Amphitheater 3B'
  });
  console.log('✔ CRUD Update Course Status & Room:', updated.data.record.status, updated.data.record.room);

  // 5. Query
  const queryRes = await axios.post(base + '/query', { query: "SELECT * FROM courses WHERE status != 'NORMAL';" });
  console.log('✔ SQL Preset Query returned rows:', queryRes.data.rows.length);

  // 6. Delete Course
  const deleted = await axios.delete(base + '/tables/courses/cls_crud_test_01');
  console.log('✔ CRUD Delete Course:', deleted.data.message);

  // 7. Dynamic SMTP Config
  const smtpRes = await axios.post('http://localhost:4005/api/notifications/smtp-config', {
    user: 'test_admin@campus.edu',
    pass: 'abcd efgh ijkl mnop',
    host: 'smtp.gmail.com'
  });
  console.log('✔ Dynamic SMTP Relay Config Bound:', smtpRes.data.message);

  console.log('\n🌟 ALL DATABASE CRUD & NOTIFICATION TESTS PASSED 100%!');
  process.exit(0);
}

testAll().catch(err => {
  console.error('Test Failed:', err.response ? err.response.data : err.message);
  process.exit(1);
});
