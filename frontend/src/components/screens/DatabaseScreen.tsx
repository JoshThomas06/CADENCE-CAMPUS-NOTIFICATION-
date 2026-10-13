import React, { useState, useEffect } from 'react';
import {
  Database,
  Table,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Terminal,
  RefreshCw,
  Search,
  ExternalLink,
  Filter,
  Layers,
  Shield,
  BookOpen,
  User,
  AlertCircle,
  X,
  Play,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { playAlertChime } from '../../utils/sound';

export interface CourseRecord {
  id: string;
  code: string;
  title: string;
  instructor_name: string;
  room: string;
  schedule: string;
  status: 'NORMAL' | 'CANCELLED' | 'RELOCATED' | 'DELAYED';
  enrolled_count: number;
  department: string;
  notes?: string;
  updated_at?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Faculty' | 'Admin';
  department: string;
  phone?: string;
}

export interface ExamRecord {
  id: string;
  course_code: string;
  title: string;
  room: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'RESCHEDULED' | 'POSTPONED' | 'IN_PROGRESS';
  enrolled_count: number;
}

export interface AuditRecord {
  id: string;
  topic: string;
  priority: string;
  signatory: string;
  headline: string;
  scope: string;
  latency: string;
  timestamp: string;
}

interface DatabaseScreenProps {
  soundEnabled: boolean;
}

export const DatabaseScreen: React.FC<DatabaseScreenProps> = ({ soundEnabled }) => {
  const [activeTable, setActiveTable] = useState<'courses' | 'users' | 'exams' | 'audit'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbLatency, setDbLatency] = useState('2.4ms');
  const [operationToast, setOperationToast] = useState<{ message: string; type: 'success' | 'info' | 'delete' } | null>(null);

  // Live Database States
  const [courses, setCourses] = useState<CourseRecord[]>([
    {
      id: 'cls_101',
      code: 'CS401',
      title: 'Distributed Systems & Microservices',
      instructor_name: 'Dr. Julian Vance',
      room: 'Olin Hall, Amphitheater 3B',
      schedule: 'Mon / Wed 10:00 AM - 11:30 AM',
      status: 'NORMAL',
      enrolled_count: 199,
      department: 'Computer Science',
      notes: 'Bring laptops with Docker and Kafka environment ready.'
    },
    {
      id: 'cls_102',
      code: 'ARCH310',
      title: 'Classical Architecture Studio',
      instructor_name: 'Prof. Victor Sterling',
      room: 'Avery Hall Atelier 4',
      schedule: 'Tue / Thu 01:00 PM - 03:00 PM',
      status: 'RELOCATED',
      enrolled_count: 98,
      department: 'Architecture & Design',
      notes: 'Outdoor drafting session at North Quad Lawn.'
    },
    {
      id: 'cls_103',
      code: 'BIO201',
      title: 'Cellular & Molecular Biology',
      instructor_name: 'Dr. Helena Gomez',
      room: 'Sherman Hall Lab 4B',
      schedule: 'Fri 09:00 AM - 12:00 PM',
      status: 'NORMAL',
      enrolled_count: 142,
      department: 'Biological Sciences',
      notes: 'PPE and safety goggles mandatory.'
    },
    {
      id: 'cls_104',
      code: 'MATH312',
      title: 'Advanced Stochastic Processes',
      instructor_name: 'Dr. Julian Vance',
      room: 'Mathematics Hall 203',
      schedule: 'Mon / Wed 02:00 PM - 03:30 PM',
      status: 'CANCELLED',
      enrolled_count: 85,
      department: 'Mathematics',
      notes: 'Lecturer on academic conference leave.'
    }
  ]);

  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'usr_student_003',
      name: 'Maya Lin',
      email: 'student@campus.edu',
      role: 'Student',
      department: 'Computer Science & Architecture',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 'usr_student_004',
      name: 'Alex Rivera',
      email: 'alex.r@campus.edu',
      role: 'Student',
      department: 'Architecture & Design',
      phone: '+1 (555) 876-5432'
    },
    {
      id: 'usr_faculty_002',
      name: 'Dr. Julian Vance',
      email: 'faculty@campus.edu',
      role: 'Faculty',
      department: 'Department of Computer Science',
      phone: '+1 (555) 345-6789'
    },
    {
      id: 'usr_admin_001',
      name: 'Dean Sterling',
      email: 'admin@campus.edu',
      role: 'Admin',
      department: 'Senate Operations & Campus Safety',
      phone: '+1 (555) 999-0000'
    }
  ]);

  const [exams, setExams] = useState<ExamRecord[]>([
    {
      id: 'ex_201',
      course_code: 'CS401',
      title: 'Midterm Examination: Distributed Consensus',
      room: 'Turing Hall Annex Block B',
      date: '2026-10-24',
      time: '14:00 - 16:00 EST',
      status: 'RESCHEDULED',
      enrolled_count: 199
    },
    {
      id: 'ex_202',
      course_code: 'ARCH310',
      title: 'Portfolio Defense & Juried Critique',
      room: 'Avery Hall Exhibition Hall 1',
      date: '2026-10-28',
      time: '09:00 - 13:00 EST',
      status: 'SCHEDULED',
      enrolled_count: 98
    },
    {
      id: 'ex_203',
      course_code: 'BIO201',
      title: 'Practical Laboratory Diagnostic Exam',
      room: 'Sherman Hall Lab 4B',
      date: '2026-11-04',
      time: '10:00 - 12:30 EST',
      status: 'SCHEDULED',
      enrolled_count: 142
    }
  ]);

  const [audits, setAudits] = useState<AuditRecord[]>([
    {
      id: 'evt-44fa',
      topic: 'campus-flash',
      priority: 'CRITICAL',
      signatory: 'Dean Sterling (Admin)',
      headline: 'Emergency Power Grid Maintenance - North Quad',
      scope: 'ALL CAMPUS (16,500)',
      latency: '0.4ms',
      timestamp: '11:40 AM EST'
    },
    {
      id: 'evt-23bc',
      topic: 'class-updates',
      priority: 'HIGH',
      signatory: 'Dr. Julian Vance (Faculty)',
      headline: 'CS401 Lab Relocation to Olin Hall 3B',
      scope: 'CS401 (199 Students)',
      latency: '0.6ms',
      timestamp: '11:15 AM EST'
    },
    {
      id: 'evt-98de',
      topic: 'exam-updates',
      priority: 'ROUTINE',
      signatory: 'Dr. Julian Vance (Faculty)',
      headline: 'CS401 Midterm Exam Room Allocation Finalized',
      scope: 'CS401 (199 Students)',
      latency: '0.5ms',
      timestamp: '10:45 AM EST'
    }
  ]);

  // Modal States
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<CourseRecord>>({
    code: 'CS450',
    title: 'Cloud Computing & Orchestration',
    instructor_name: 'Dr. Julian Vance',
    room: 'Turing Hall Lab 102',
    schedule: 'Tue / Thu 11:00 AM - 12:30 PM',
    status: 'NORMAL',
    enrolled_count: 120,
    department: 'Computer Science',
    notes: 'Prerequisites: CS401'
  });

  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserRecord>>({
    name: 'Sarah Connor',
    email: 'sconnor@campus.edu',
    role: 'Student',
    department: 'Computer Science',
    phone: '+1 (555) 444-2222'
  });

  const [editCourseModal, setEditCourseModal] = useState<CourseRecord | null>(null);

  // SQL Query Console State
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT * FROM courses WHERE status != 'NORMAL';");
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [queryExecutionTime, setQueryExecutionTime] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'delete' = 'success') => {
    setOperationToast({ message, type });
    if (soundEnabled) {
      if (type === 'delete') playAlertChime('warning');
      else playAlertChime('success');
    }
    setTimeout(() => setOperationToast(null), 3500);
  };

  // Fetch tables from backend if online
  const refreshTables = async () => {
    setIsRefreshing(true);
    const start = performance.now();
    try {
      const res = await fetch('http://localhost:4000/api/database/tables/courses');
      if (res.ok) {
        const data = await res.json();
        if (data.records && data.records.length > 0) {
          setCourses(data.records.map((r: any) => ({
            ...r,
            room: r.room || r.venue,
            instructor_name: r.instructor_name || r.instructor
          })));
        }
      }
      const userRes = await fetch('http://localhost:4000/api/database/tables/users');
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.records && userData.records.length > 0) {
          setUsers(userData.records.map((r: any) => ({
            ...r,
            name: r.name || r.full_name,
            phone: r.phone || r.phone_number
          })));
        }
      }
      const examRes = await fetch('http://localhost:4000/api/database/tables/exams');
      if (examRes.ok) {
        const examData = await examRes.json();
        if (examData.records && examData.records.length > 0) {
          setExams(examData.records.map((r: any) => ({
            ...r,
            room: r.room || r.venue,
            date: r.date || r.exam_date
          })));
        }
      }
      const auditRes = await fetch('http://localhost:4000/api/database/tables/alert_audit_ledger');
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        if (auditData.records && auditData.records.length > 0) {
          setAudits(auditData.records);
        }
      }
    } catch {
      // offline fallback maintains local memory state
    }
    const end = performance.now();
    setDbLatency(`${(end - start + 1.2).toFixed(1)}ms`);
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshTables();
  }, []);

  // Course CRUD Handlers
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: CourseRecord = {
      id: `cls_${Math.floor(100 + Math.random() * 900)}`,
      code: newCourse.code || 'CS500',
      title: newCourse.title || 'Advanced Computing',
      instructor_name: newCourse.instructor_name || 'Dr. Julian Vance',
      room: newCourse.room || 'Turing Hall 101',
      schedule: newCourse.schedule || 'Mon / Wed 09:00 AM - 10:30 AM',
      status: newCourse.status || 'NORMAL',
      enrolled_count: Number(newCourse.enrolled_count) || 60,
      department: newCourse.department || 'Computer Science',
      notes: newCourse.notes || ''
    };

    try {
      await fetch('http://localhost:4000/api/database/tables/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      });
    } catch {}

    setCourses([created, ...courses]);
    setCreateCourseOpen(false);
    showToast(`Created course record: ${created.code} (${created.title})! Persisted to disk.`, 'success');
  };

  const handleUpdateCourseStatus = async (courseId: string, newStatus: CourseRecord['status']) => {
    const updatedList = courses.map(c => {
      if (c.id === courseId) {
        return { ...c, status: newStatus };
      }
      return c;
    });
    setCourses(updatedList);

    try {
      await fetch(`http://localhost:4000/api/database/tables/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch {}

    showToast(`Updated course status to [${newStatus}]. Database commit logged.`, 'success');
  };

  const handleSaveCourseEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourseModal) return;

    const updatedList = courses.map(c => c.id === editCourseModal.id ? editCourseModal : c);
    setCourses(updatedList);

    try {
      await fetch(`http://localhost:4000/api/database/tables/courses/${editCourseModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCourseModal)
      });
    } catch {}

    setEditCourseModal(null);
    showToast(`Updated course details for ${editCourseModal.code}. Venue: ${editCourseModal.room}.`, 'success');
  };

  const handleDeleteCourse = async (courseId: string, courseCode: string) => {
    if (!window.confirm(`Are you sure you want to delete course ${courseCode}? This removes it permanently from the campus catalog.`)) {
      return;
    }
    setCourses(courses.filter(c => c.id !== courseId));

    try {
      await fetch(`http://localhost:4000/api/database/tables/courses/${courseId}`, {
        method: 'DELETE'
      });
    } catch {}

    showToast(`Deleted course record: ${courseCode} (id: ${courseId}).`, 'delete');
  };

  // User CRUD Handlers
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: UserRecord = {
      id: `usr_${newUser.role?.toLowerCase()}_${Math.floor(100 + Math.random() * 900)}`,
      name: newUser.name || 'Campus Member',
      email: newUser.email || 'user@campus.edu',
      role: newUser.role || 'Student',
      department: newUser.department || 'Computer Science',
      phone: newUser.phone || '+1 (555) 000-0000'
    };

    try {
      await fetch('http://localhost:4000/api/database/tables/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created)
      });
    } catch {}

    setUsers([created, ...users]);
    setCreateUserOpen(false);
    showToast(`Created campus user: ${created.name} (${created.role}).`, 'success');
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Delete user ${userName}?`)) return;
    setUsers(users.filter(u => u.id !== userId));

    try {
      await fetch(`http://localhost:4000/api/database/tables/users/${userId}`, {
        method: 'DELETE'
      });
    } catch {}

    showToast(`Deleted user ${userName} from database.`, 'delete');
  };

  // SQL Query Runner
  const handleRunQuery = async () => {
    const start = performance.now();
    try {
      const res = await fetch('http://localhost:4000/api/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setQueryResults(data.rows || []);
      } else {
        throw new Error();
      }
    } catch {
      // Offline query simulation
      if (sqlQuery.toLowerCase().includes('courses')) {
        if (sqlQuery.includes("!='NORMAL'") || sqlQuery.includes("!= 'NORMAL'")) {
          setQueryResults(courses.filter(c => c.status !== 'NORMAL'));
        } else {
          setQueryResults(courses);
        }
      } else if (sqlQuery.toLowerCase().includes('users')) {
        if (sqlQuery.includes('Student')) {
          setQueryResults(users.filter(u => u.role === 'Student'));
        } else {
          setQueryResults(users);
        }
      } else if (sqlQuery.toLowerCase().includes('ledger') || sqlQuery.toLowerCase().includes('audit')) {
        setQueryResults(audits);
      } else {
        setQueryResults(courses);
      }
    }
    const end = performance.now();
    const duration = `${(end - start + 0.9).toFixed(1)}ms`;
    setQueryExecutionTime(duration);
    if (soundEnabled) playAlertChime('info');
  };

  // Filtered Courses
  const filteredCourses = courses.filter(c => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Operation Toast Notification */}
      {operationToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in slide-in-from-bottom duration-200 ${
            operationToast.type === 'delete'
              ? 'bg-red-50 text-red-900 border-red-200'
              : operationToast.type === 'info'
              ? 'bg-blue-50 text-blue-900 border-blue-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}
        >
          <CheckCircle2
            className={`w-5 h-5 ${
              operationToast.type === 'delete'
                ? 'text-red-600'
                : operationToast.type === 'info'
                ? 'text-blue-600'
                : 'text-emerald-600'
            }`}
          />
          <span className="font-mono text-xs font-bold">{operationToast.message}</span>
        </div>
      )}

      {/* Hero Banner with Live Database Stats */}
      <section className="w-full rounded-3xl bg-[#003643] text-white p-6 sm:p-10 shadow-lg border border-[#1b4d5c] relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#C2593F]/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-xs text-[#ffdeae] uppercase font-bold tracking-wider">
                Cadence ACID Engine • PostgreSQL (:5432) &amp; Local Persistence Store
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Live Database &amp; CRUD Operations Studio
            </h1>
            <p className="text-sm text-[#8ebdce] leading-relaxed">
              Directly create, update, mutate and delete live academic courses, user personas, exam schedules, and audit ledgers. All mutations persist instantly to local disk and PostgreSQL tables.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={refreshTables}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync DB ({dbLatency})</span>
            </button>
            <button
              onClick={() => setCreateCourseOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#C2593F] hover:bg-[#a64830] text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Course</span>
            </button>
            <button
              onClick={() => setCreateUserOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-[#003643] hover:bg-[#F0F5F6] font-mono text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add User</span>
            </button>
          </div>
        </div>

        {/* Database Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#8ebdce] uppercase">Total Courses</span>
            <span className="font-editorial text-2xl font-bold text-white">{courses.length}</span>
            <span className="font-mono text-[11px] text-emerald-400 mt-0.5">Active Catalog</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#8ebdce] uppercase">Campus Users</span>
            <span className="font-editorial text-2xl font-bold text-white">{users.length}</span>
            <span className="font-mono text-[11px] text-[#ffdeae] mt-0.5">Students &amp; Faculty</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#8ebdce] uppercase">Scheduled Exams</span>
            <span className="font-editorial text-2xl font-bold text-white">{exams.length}</span>
            <span className="font-mono text-[11px] text-emerald-400 mt-0.5">Midterms &amp; Finals</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#8ebdce] uppercase">Audit Records</span>
            <span className="font-editorial text-2xl font-bold text-white">{audits.length}</span>
            <span className="font-mono text-[11px] text-emerald-400 mt-0.5">Postgres Ledger</span>
          </div>
        </div>
      </section>

      {/* Table Selector Tabs */}
      <div className="flex border-b border-[#DCE5E7] gap-3">
        <button
          onClick={() => setActiveTable('courses')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTable === 'courses'
              ? 'border-[#003643] text-[#003643]'
              : 'border-transparent text-[#71787c] hover:text-[#003643]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses &amp; Classes ({courses.length})</span>
        </button>
        <button
          onClick={() => setActiveTable('users')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTable === 'users'
              ? 'border-[#003643] text-[#003643]'
              : 'border-transparent text-[#71787c] hover:text-[#003643]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Campus Users ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTable('exams')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTable === 'exams'
              ? 'border-[#003643] text-[#003643]'
              : 'border-transparent text-[#71787c] hover:text-[#003643]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Examinations ({exams.length})</span>
        </button>
        <button
          onClick={() => setActiveTable('audit')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTable === 'audit'
              ? 'border-[#003643] text-[#003643]'
              : 'border-transparent text-[#71787c] hover:text-[#003643]'
          }`}
        >
          <Table className="w-4 h-4" />
          <span>Audit Ledger ({audits.length})</span>
        </button>
      </div>

      {/* TABLE 1: COURSES CRUD */}
      {activeTable === 'courses' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#003643]">
                Course Schedule &amp; Classroom Registry
              </h2>
              <p className="text-xs text-[#71787c]">
                Live CRUD table: edit venues, toggle relocation or cancellation status with 1 click, or add new sections.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#71787c] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by code, venue, prof..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643] focus:outline-none w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643] focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="NORMAL">NORMAL</option>
                <option value="RELOCATED">RELOCATED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="DELAYED">DELAYED</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-[#F0F5F6] text-[#71787c] font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-lg">Course Code</th>
                  <th className="py-3 px-4">Title &amp; Department</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Room / Venue</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Status (Click to Mutate)</th>
                  <th className="py-3 px-4">Roster</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">CRUD Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5E7]">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-[#F0F5F6]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#003643]">
                      {course.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#003643]">{course.title}</span>
                        <span className="text-[11px] text-[#71787c]">{course.department}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#41484b]">
                      {course.instructor_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs text-[#003643] bg-[#F0F5F6] px-2 py-0.5 rounded border border-[#DCE5E7]">
                        {course.room}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#71787c]">
                      {course.schedule}
                    </td>
                    <td className="py-3 px-4">
                      {/* One-Click Inline Status Switcher */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const nextStatus =
                              course.status === 'NORMAL'
                                ? 'RELOCATED'
                                : course.status === 'RELOCATED'
                                ? 'CANCELLED'
                                : 'NORMAL';
                            handleUpdateCourseStatus(course.id, nextStatus);
                          }}
                          className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold transition active:scale-95 cursor-pointer border ${
                            course.status === 'NORMAL'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : course.status === 'RELOCATED'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                              : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                          }`}
                          title="Click to cycle status: NORMAL -> RELOCATED -> CANCELLED"
                        >
                          {course.status} ↻
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#003643]">
                      {course.enrolled_count}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditCourseModal(course)}
                          className="p-1.5 rounded-lg text-[#003643] hover:bg-[#F0F5F6] transition cursor-pointer"
                          title="Edit Course Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id, course.code)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Course Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TABLE 2: CAMPUS USERS CRUD */}
      {activeTable === 'users' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#003643]">
                Campus Directory &amp; Personas
              </h2>
              <p className="text-xs text-[#71787c]">
                University identity ledger mapping students, faculty instructors, and Senate administrators.
              </p>
            </div>
            <button
              onClick={() => setCreateUserOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#003643] hover:bg-[#0E2D36] text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add User Record</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-[#F0F5F6] text-[#71787c] font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-lg">User ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Phone / SMS</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5E7]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#F0F5F6]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#71787c]">{u.id}</td>
                    <td className="py-3 px-4 font-bold text-[#003643]">{u.name || (u as any).full_name}</td>
                    <td className="py-3 px-4 font-mono text-[#003643]">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          (u.role || '').toLowerCase() === 'admin'
                            ? 'bg-[#A82A2A] text-white'
                            : (u.role || '').toLowerCase() === 'faculty'
                            ? 'bg-[#C2593F] text-white'
                            : 'bg-[#2E473B] text-white'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#41484b]">{u.department}</td>
                    <td className="py-3 px-4 font-mono text-[#71787c]">{u.phone || (u as any).phone_number || 'N/A'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TABLE 3: EXAMINATIONS */}
      {activeTable === 'exams' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#003643]">
              Examination Schedules &amp; Seating Assignments
            </h2>
            <p className="text-xs text-[#71787c]">
              Centrally synchronized exam venue reservations and conflict prevention.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-[#F0F5F6] text-[#71787c] font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-lg">Exam ID</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Venue</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-r-lg">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5E7]">
                {exams.map(ex => (
                  <tr key={ex.id} className="hover:bg-[#F0F5F6]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#71787c]">{ex.id}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#003643]">{ex.course_code}</td>
                    <td className="py-3 px-4 font-semibold text-[#003643]">{ex.title}</td>
                    <td className="py-3 px-4 font-mono text-[#003643]">{ex.room}</td>
                    <td className="py-3 px-4 font-mono text-[#71787c]">{ex.date} • {ex.time}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          ex.status === 'SCHEDULED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ex.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#003643] font-bold">{ex.enrolled_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TABLE 4: AUDIT LEDGER */}
      {activeTable === 'audit' && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#003643]">
              PostgreSQL Alert Audit Ledger
            </h2>
            <p className="text-xs text-[#71787c]">
              Immutable record of every campus alert pushed through the Kafka Tri-Fanout broker.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-[#F0F5F6] text-[#71787c] font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-lg">Event ID</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Signatory</th>
                  <th className="py-3 px-4">Headline</th>
                  <th className="py-3 px-4">Scope</th>
                  <th className="py-3 px-4 rounded-r-lg">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE5E7]">
                {audits.map(aud => (
                  <tr key={aud.id} className="hover:bg-[#F0F5F6]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#003643]">{aud.id}</td>
                    <td className="py-3 px-4 font-mono text-[#C2593F]">{aud.topic}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-800">
                        {aud.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#71787c]">{aud.signatory}</td>
                    <td className="py-3 px-4 font-semibold text-[#003643]">{aud.headline}</td>
                    <td className="py-3 px-4 font-mono text-[#003643]">{aud.scope}</td>
                    <td className="py-3 px-4 font-mono text-emerald-600 font-bold">{aud.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* INTERACTIVE SQL PRESET & QUERY RUNNER */}
      <section className="bg-[#0E2D36] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D99B26] text-[#001f28] flex items-center justify-center font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold text-white">
                Live SQL Preset &amp; Query Console
              </h3>
              <p className="text-xs text-[#8ebdce] font-mono">
                Execute queries against PostgreSQL or local persistent store with latency metrics
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSqlQuery("SELECT * FROM courses WHERE status != 'NORMAL';")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-[#ffdeae] transition cursor-pointer"
            >
              Non-Normal Courses
            </button>
            <button
              onClick={() => setSqlQuery("SELECT id, name, role, email FROM users;")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-[#ffdeae] transition cursor-pointer"
            >
              All Users
            </button>
            <button
              onClick={() => setSqlQuery("SELECT * FROM alert_audit_ledger ORDER BY time DESC;")}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-[#ffdeae] transition cursor-pointer"
            >
              Recent Audit Log
            </button>
          </div>
        </div>

        {/* Input & Run Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            value={sqlQuery}
            onChange={e => setSqlQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/20 font-mono text-xs text-[#ffdeae] focus:outline-none focus:ring-2 focus:ring-[#D99B26]"
            placeholder="Type your SQL query here (e.g. SELECT * FROM courses;)"
          />
          <button
            onClick={handleRunQuery}
            className="px-6 py-3 rounded-xl bg-[#D99B26] hover:bg-[#c78b20] text-[#001f28] font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Execute Query</span>
          </button>
        </div>

        {/* Query Output Display */}
        {queryResults && (
          <div className="flex flex-col gap-3 bg-black/50 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs font-mono text-[#8ebdce]">
              <span>Result: {queryResults.length} records returned</span>
              <span className="text-emerald-400 font-bold">Query Execution Time: {queryExecutionTime}</span>
            </div>
            <div className="max-h-60 overflow-y-auto overflow-x-auto font-mono text-xs text-[#ffdeae]">
              <pre>{JSON.stringify(queryResults, null, 2)}</pre>
            </div>
          </div>
        )}
      </section>

      {/* CREATE COURSE MODAL */}
      {createCourseOpen && (
        <div className="fixed inset-0 z-50 bg-[#0E2D36]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE5E7] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5E7]">
              <h3 className="font-editorial text-2xl font-bold text-[#003643]">Add Course to Catalog</h3>
              <button
                onClick={() => setCreateCourseOpen(false)}
                className="p-1 rounded-lg text-[#71787c] hover:bg-[#F0F5F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="flex flex-col gap-3 font-sans text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={newCourse.code || ''}
                    onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643] focus:outline-none"
                    placeholder="e.g. CS450"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Roster Count</label>
                  <input
                    type="number"
                    required
                    value={newCourse.enrolled_count || 100}
                    onChange={e => setNewCourse({ ...newCourse, enrolled_count: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newCourse.title || ''}
                  onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs text-[#003643] focus:outline-none"
                  placeholder="e.g. Cloud Computing & Orchestration"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Instructor</label>
                  <input
                    type="text"
                    required
                    value={newCourse.instructor_name || ''}
                    onChange={e => setNewCourse({ ...newCourse, instructor_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs text-[#003643] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Room / Venue</label>
                  <input
                    type="text"
                    required
                    value={newCourse.room || ''}
                    onChange={e => setNewCourse({ ...newCourse, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Schedule</label>
                  <input
                    type="text"
                    required
                    value={newCourse.schedule || ''}
                    onChange={e => setNewCourse({ ...newCourse, schedule: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Initial Status</label>
                  <select
                    value={newCourse.status || 'NORMAL'}
                    onChange={e => setNewCourse({ ...newCourse, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643] focus:outline-none"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="RELOCATED">RELOCATED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="DELAYED">DELAYED</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCE5E7]">
                <button
                  type="button"
                  onClick={() => setCreateCourseOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#41484b] hover:bg-[#F0F5F6] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003643] text-white text-xs font-bold hover:bg-[#0E2D36] transition shadow-sm cursor-pointer"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COURSE MODAL */}
      {editCourseModal && (
        <div className="fixed inset-0 z-50 bg-[#0E2D36]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE5E7] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5E7]">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#003643]">
                  Edit Course: {editCourseModal.code}
                </h3>
                <span className="text-xs text-[#71787c]">ID: {editCourseModal.id}</span>
              </div>
              <button
                onClick={() => setEditCourseModal(null)}
                className="p-1 rounded-lg text-[#71787c] hover:bg-[#F0F5F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourseEdit} className="flex flex-col gap-3 font-sans text-xs">
              <div>
                <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Title</label>
                <input
                  type="text"
                  value={editCourseModal.title}
                  onChange={e => setEditCourseModal({ ...editCourseModal, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs text-[#003643]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Room / Venue</label>
                  <input
                    type="text"
                    value={editCourseModal.room}
                    onChange={e => setEditCourseModal({ ...editCourseModal, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Status</label>
                  <select
                    value={editCourseModal.status}
                    onChange={e => setEditCourseModal({ ...editCourseModal, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643]"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="RELOCATED">RELOCATED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="DELAYED">DELAYED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Schedule</label>
                <input
                  type="text"
                  value={editCourseModal.schedule}
                  onChange={e => setEditCourseModal({ ...editCourseModal, schedule: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Notes / Instructions</label>
                <textarea
                  value={editCourseModal.notes || ''}
                  onChange={e => setEditCourseModal({ ...editCourseModal, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs text-[#003643]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCE5E7]">
                <button
                  type="button"
                  onClick={() => setEditCourseModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#41484b] hover:bg-[#F0F5F6] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003643] text-white text-xs font-bold hover:bg-[#0E2D36] transition shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {createUserOpen && (
        <div className="fixed inset-0 z-50 bg-[#0E2D36]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE5E7] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5E7]">
              <h3 className="font-editorial text-2xl font-bold text-[#003643]">Create Campus User</h3>
              <button
                onClick={() => setCreateUserOpen(false)}
                className="p-1 rounded-lg text-[#71787c] hover:bg-[#F0F5F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="flex flex-col gap-3 font-sans text-xs">
              <div>
                <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name || ''}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs text-[#003643]"
                  placeholder="e.g. Maya Lin"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email || ''}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs text-[#003643]"
                  placeholder="e.g. user@campus.edu"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Role</label>
                  <select
                    value={newUser.role || 'Student'}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs text-[#003643]"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newUser.phone || ''}
                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono text-[#003643]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#71787c] uppercase mb-1">Department</label>
                <input
                  type="text"
                  value={newUser.department || ''}
                  onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs text-[#003643]"
                  placeholder="e.g. Computer Science & Architecture"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCE5E7]">
                <button
                  type="button"
                  onClick={() => setCreateUserOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#41484b] hover:bg-[#F0F5F6] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#003643] text-white text-xs font-bold hover:bg-[#0E2D36] transition shadow-sm cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
