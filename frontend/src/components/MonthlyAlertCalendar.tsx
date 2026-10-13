import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  MapPin,
  AlertTriangle,
  Info,
  CheckCircle,
  Radio,
  X
} from 'lucide-react';
import { playAlertChime } from '../utils/sound';

export type AlertCategory = 'all' | 'class-updates' | 'exam-updates' | 'general-events';

export interface DayEvent {
  time: string;
  category: 'class-updates' | 'exam-updates' | 'general-events';
  title: string;
  course?: string;
  location: string;
  severity: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

export interface DayData {
  day: number;
  dateStr: string;
  classCount: number;
  examCount: number;
  generalCount: number;
  events: DayEvent[];
}

interface MonthlyAlertCalendarProps {
  soundEnabled?: boolean;
  isExtensiveView?: boolean;
  onNavigateToExtensive?: () => void;
}

// 12-Month Realistic Academic Calendar Knowledge Base
interface MonthSchedule {
  theme: string;
  classPool: { title: string; course: string; location: string; time: string; severity: 'NORMAL' | 'HIGH' }[];
  examPool: { title: string; course: string; location: string; time: string; severity: 'NORMAL' | 'HIGH' }[];
  safetyPool: { title: string; location: string; time: string; severity: 'NORMAL' | 'CRITICAL' }[];
}

const ACADEMIC_SCHEDULE_BY_MONTH: Record<number, MonthSchedule> = {
  // 0 = January
  0: {
    theme: 'Spring Term Kickoff & Add/Drop Enrollment Period',
    classPool: [
      { title: 'CS301 Algorithm Analysis Auditorium Upgrade', course: 'CS301 Algorithms', location: 'Turing Amphitheater 101', time: '10:00 AM', severity: 'NORMAL' },
      { title: 'AI610 Deep Learning Cluster Lab Relocation', course: 'AI610 Deep Learning', location: 'Olin Hall 2B', time: '01:30 PM', severity: 'HIGH' },
      { title: 'MATH201 Multivariable Calculus Section Shift', course: 'MATH201 Calculus III', location: 'Pupin Physics 301', time: '09:00 AM', severity: 'NORMAL' },
      { title: 'BIO102 Cellular Biology Wet Lab Prep', course: 'BIO102 Biology', location: 'Curie Hall Lab 104', time: '03:15 PM', severity: 'NORMAL' }
    ],
    examPool: [
      { title: 'Mathematics Diagnostic Placement Test', course: 'Math Division', location: 'Great Hall West', time: '11:00 AM', severity: 'HIGH' },
      { title: 'CS Exemption Proficiency Exam Seating', course: 'CS Division', location: 'Olin Hall 3B', time: '02:00 PM', severity: 'NORMAL' }
    ],
    safetyPool: [
      { title: 'Sub-Zero Freeze Advisory: Heated Walkways Only', location: 'Campus Grounds & North Quad', time: '07:30 AM', severity: 'NORMAL' },
      { title: 'Winter Snow Squall: Delayed Campus Opening at 10 AM', location: 'All Campus Facilities', time: '06:15 AM', severity: 'CRITICAL' }
    ]
  },
  // 1 = February
  1: {
    theme: 'Spring Midterm Preparation & Annual Campus Hackathon',
    classPool: [
      { title: 'ENG202 Fluid Dynamics Wind Tunnel Relocation', course: 'ENG202 Fluid Dynamics', location: 'Aero Wing Lab 4', time: '11:15 AM', severity: 'HIGH' },
      { title: 'ARCH310 Parametric Modeling Studio Move', course: 'ARCH310 Architecture', location: 'Ruskin Atelier B', time: '02:00 PM', severity: 'NORMAL' },
      { title: 'CHEM204 Organic Synthesis Room Swap', course: 'CHEM204 Chemistry', location: 'Mendeleev Hall 102', time: '09:30 AM', severity: 'NORMAL' }
    ],
    examPool: [
      { title: 'Early Midterm: Linear Algebra Matrix Theory', course: 'MATH312 Linear Algebra', location: 'Pupin Physics 420', time: '10:00 AM', severity: 'HIGH' },
      { title: 'Data Structures Midterm Seating Realignment', course: 'CS201 Data Structures', location: 'Great Hall North', time: '01:00 PM', severity: 'HIGH' }
    ],
    safetyPool: [
      { title: 'High-Wind Quad Gust Warning: Tree Perimeter Closed', location: 'North Quad Lawn', time: '01:45 PM', severity: 'CRITICAL' },
      { title: 'Campus Hackathon Night Escort Transit Loop Active', location: 'Student Union Depot', time: '10:00 PM', severity: 'NORMAL' }
    ]
  },
  // 2 = March
  2: {
    theme: 'Spring Midterm Examinations & Spring Break Transitions',
    classPool: [
      { title: 'CS401 Distributed Systems Benchmark Review', course: 'CS401 Distributed Systems', location: 'Olin Amphitheater', time: '09:15 AM', severity: 'HIGH' },
      { title: 'ARCH310 Classical Architecture Studio Shift', course: 'ARCH310 Architecture', location: 'Ruskin Atelier West', time: '01:45 PM', severity: 'NORMAL' },
      { title: 'ENG315 Robotics Control Studio Room Move', course: 'ENG315 Robotics', location: 'MakerWing B', time: '03:30 PM', severity: 'NORMAL' }
    ],
    examPool: [
      { title: 'Midterm: Distributed Systems Final Architecture Prep', course: 'CS401 Distributed Systems', location: 'Pupin Physics 420', time: '11:00 AM', severity: 'HIGH' },
      { title: 'Midterm: Classical Architectural History', course: 'ARCH310 Architecture', location: 'Davis Auditorium', time: '02:30 PM', severity: 'HIGH' },
      { title: 'Midterm: Organic Synthesis Comprehensive', course: 'CHEM204 Chemistry', location: 'Great Hall', time: '09:00 AM', severity: 'HIGH' }
    ],
    safetyPool: [
      { title: 'Severe Thunderstorm Flash: Interior Shelter Protocol', location: 'Quad North Lawn', time: '02:30 PM', severity: 'CRITICAL' },
      { title: 'Spring Break Facility Keycard Re-alignment', location: 'Registrar & Housing', time: '04:00 PM', severity: 'NORMAL' }
    ]
  },
  // 3 = April
  3: {
    theme: 'Senior Design Capstone Showcase & Spring Symposium',
    classPool: [
      { title: 'CS401 Senior Project Cloud Infrastructure Demo', course: 'CS401 Distributed Systems', location: 'Olin Hall 3B', time: '10:30 AM', severity: 'HIGH' },
      { title: 'ARCH310 Annual Spring Salon Review Relocation', course: 'ARCH310 Architecture', location: 'Ruskin Gallery', time: '01:00 PM', severity: 'NORMAL' },
      { title: 'ENG202 Autonomous Vehicles Testing Shift', course: 'ENG202 Fluid Dynamics', location: 'Curie Lab 202', time: '03:45 PM', severity: 'NORMAL' }
    ],
    examPool: [
      { title: 'Capstone Technical Defense Seating Allocation', course: 'Engineering Senate', location: 'Turing Room C', time: '11:00 AM', severity: 'HIGH' },
      { title: 'Architecture Comprehensive Portfolio Jury', course: 'Design Board', location: 'Ruskin Hall', time: '02:00 PM', severity: 'HIGH' }
    ],
    safetyPool: [
      { title: 'Outdoor Spring Concert Weather Relocation to Great Hall', location: 'Great Hall', time: '04:30 PM', severity: 'NORMAL' },
      { title: 'Campus Siren Horn Annual Inspection Test', location: 'University PA Network', time: '12:00 PM', severity: 'CRITICAL' }
    ]
  },
  // 4 = May
  4: {
    theme: 'Spring Term Final Examinations & Commencement',
    classPool: [
      { title: 'Final Review: CS401 Distributed Systems Wrap-up', course: 'CS401 Distributed Systems', location: 'Olin Amphitheater', time: '10:00 AM', severity: 'NORMAL' },
      { title: 'ARCH310 Final Portfolio Submission Staging', course: 'ARCH310 Architecture', location: 'Ruskin Atelier', time: '02:00 PM', severity: 'HIGH' }
    ],
    examPool: [
      { title: 'Spring Final: CS401 Distributed Systems Exam', course: 'CS401 Distributed Systems', location: 'Great Hall North', time: '09:00 AM', severity: 'HIGH' },
      { title: 'Spring Final: MATH312 Linear Algebra Exam', course: 'MATH312 Linear Algebra', location: 'Pupin Physics 420', time: '01:30 PM', severity: 'HIGH' },
      { title: 'Spring Final: ARCH310 Classical Architecture', course: 'ARCH310 Architecture', location: 'Davis Auditorium', time: '04:00 PM', severity: 'HIGH' }
    ],
    safetyPool: [
      { title: 'Commencement North Lawn Rehearsal Weather Staging', location: 'North Quad', time: '08:30 AM', severity: 'NORMAL' },
      { title: 'Residence Hall Move-Out Traffic Perimeter Active', location: 'Campus Drives', time: '01:00 PM', severity: 'NORMAL' }
    ]
  },
  // 5 = June
  5: {
    theme: 'Summer Term Session I & Facility Upgrades',
    classPool: [
      { title: 'Summer Intensive: CS101 Introduction to Python', course: 'CS101 Computing', location: 'Olin Hall 1A', time: '09:00 AM', severity: 'NORMAL' },
      { title: 'AI Seminar Series: Generative Architectures', course: 'CS590 AI', location: 'Turing Center', time: '02:00 PM', severity: 'NORMAL' }
    ],
    examPool: [
      { title: 'Summer Session I Midterm Examination', course: 'CS101 Computing', location: 'Pupin Physics 301', time: '10:00 AM', severity: 'HIGH' }
    ],
    safetyPool: [
      { title: 'Facilities Steam Pipe Overhaul Detour', location: 'East Campus Walkway', time: '08:00 AM', severity: 'NORMAL' }
    ]
  },
  // 6 = July
  6: {
    theme: 'Summer Research Fellowships & Lab Maintenance',
    classPool: [
      { title: 'Summer Robotics Lab Workshop Shift', course: 'ROB401 Robotics', location: 'MakerWing A', time: '10:30 AM', severity: 'NORMAL' },
      { title: 'Environmental Science Field Lab Departure Shift', course: 'ENV210 Ecology', location: 'North Quad Gate', time: '08:00 AM', severity: 'NORMAL' }
    ],
    examPool: [
      { title: 'Summer Session II Midterm Examination', course: 'MATH201 Calculus', location: 'Pupin 301', time: '01:00 PM', severity: 'HIGH' }
    ],
    safetyPool: [
      { title: 'High Heat Advisory: Free Water Stations Deployed', location: 'Campus Center & Quad', time: '12:00 PM', severity: 'NORMAL' }
    ]
  },
  // 7 = August
  7: {
    theme: 'Pre-Fall Orientation, Faculty Retreat & Move-In',
    classPool: [
      { title: 'Faculty Curriculum Alignment Workshop Room Move', course: 'Academic Senate', location: 'Great Hall Boardroom', time: '09:00 AM', severity: 'NORMAL' },
      { title: 'Graduate Teaching Assistant Pedagogy Seminar', course: 'Graduate School', location: 'Turing Room B', time: '02:00 PM', severity: 'NORMAL' }
    ],
    examPool: [
      { title: 'Summer Term Comprehensive Final Examinations', course: 'Summer Division', location: 'Pupin 420', time: '10:00 AM', severity: 'HIGH' }
    ],
    safetyPool: [
      { title: 'Freshman Move-In Staging: One-Way Loop Enforcement', location: 'Quad Perimeter', time: '07:00 AM', severity: 'NORMAL' },
      { title: 'Campus Siren Horn Pre-Semester Readiness Test', location: 'All Audio Towers', time: '11:00 AM', severity: 'CRITICAL' }
    ]
  },
  // 8 = September
  8: {
    theme: 'Fall Term Welcome & Course Add/Drop Period',
    classPool: [
      { title: 'CS401 Distributed Systems First Lecture Upgrade', course: 'CS401 Distributed Systems', location: 'Olin Hall 3B', time: '09:15 AM', severity: 'HIGH' },
      { title: 'ARCH310 Classical Architecture Studio Welcome Shift', course: 'ARCH310 Architecture', location: 'Ruskin Atelier West', time: '11:30 AM', severity: 'NORMAL' },
      { title: 'ENG202 Fluid Dynamics Introductory Lab Staging', course: 'ENG202 Fluid Dynamics', location: 'Curie Lab 202', time: '02:00 PM', severity: 'NORMAL' },
      { title: 'CHEM101 General Chemistry Section Expansion', course: 'CHEM101 Chemistry', location: 'Great Hall', time: '04:00 PM', severity: 'NORMAL' }
    ],
    examPool: [
      { title: 'Fall Language Exemption & Diagnostic Exam', course: 'Dean Office', location: 'Pupin Physics 420', time: '10:00 AM', severity: 'HIGH' },
      { title: 'Mathematics Department Honors Placement Exam', course: 'MATH Division', location: 'Turing Amphitheater', time: '01:30 PM', severity: 'HIGH' }
    ],
    safetyPool: [
      { title: 'Convocation Ceremony Overflow Protocol', location: 'North Quad Lawn', time: '10:00 AM', severity: 'NORMAL' },
      { title: 'Mandatory Lab Biosafety Certification Walkthrough', location: 'Curie Science Complex', time: '03:00 PM', severity: 'NORMAL' }
    ]
  },
  // 9 = October
  9: {
    theme: 'Fall Midterms, Studio Critiques & Weather Protocols',
    classPool: [
      { title: 'CS401 Distributed Systems Cluster Lab Relocation', course: 'CS401 Distributed Systems', location: 'Olin Hall Amphitheater 3B', time: '09:15 AM', severity: 'HIGH' },
      { title: 'ENG202 Fluid Dynamics Studio Relocation', course: 'ENG202 Fluid Dynamics', location: 'Curie Hall Lab 202', time: '01:45 PM', severity: 'NORMAL' },
      { title: 'ARCH310 Atelier Critique Room Shift', course: 'ARCH310 Architecture', location: 'Ruskin Atelier Wing West', time: '03:30 PM', severity: 'NORMAL' },
      { title: 'CS401 Distributed Systems Office Hours Relocation', course: 'CS401 Distributed Systems', location: 'Olin 410', time: '04:45 PM', severity: 'NORMAL' }
    ],
    examPool: [
      { title: 'CS401 Midterm Examination Schedule Realignment', course: 'CS401 Distributed Systems', location: 'Pupin Physics 420', time: '11:00 AM', severity: 'HIGH' },
      { title: 'ARCH310 Architecture Midterm Seating Realignment', course: 'ARCH310 Architecture', location: 'Davis Auditorium', time: '02:15 PM', severity: 'HIGH' },
      { title: 'MATH312 Linear Algebra Midterm Room Expansion', course: 'MATH312 Linear Algebra', location: 'Turing Amphitheater C', time: '03:45 PM', severity: 'NORMAL' }
    ],
    safetyPool: [
      { title: 'Quad Weather Flash: Severe Lightning & Shelter Protocol', location: 'North Quad Lawn', time: '02:30 PM', severity: 'CRITICAL' },
      { title: 'Deans Distinguished Keynote Lecture Pass Open', location: 'University Great Hall', time: '04:00 PM', severity: 'NORMAL' }
    ]
  },
  // 10 = November
  10: {
    theme: 'Capstone Milestones, Project Defenses & Thanksgiving',
    classPool: [
      { title: 'CS401 Distributed Systems Peer Code Review Shift', course: 'CS401 Distributed Systems', location: 'Olin Hall 3B', time: '10:00 AM', severity: 'NORMAL' },
      { title: 'ARCH310 Structural Systems Drawing Lab Move', course: 'ARCH310 Architecture', location: 'Ruskin Hall 2B', time: '01:30 PM', severity: 'NORMAL' },
      { title: 'ENG202 Aerodynamics Project Presentation Relocation', course: 'ENG202 Fluid Dynamics', location: 'MakerWing 105', time: '03:15 PM', severity: 'HIGH' }
    ],
    examPool: [
      { title: 'CS401 Benchmark Practical Defense Seating', course: 'CS401 Distributed Systems', location: 'Turing Cluster Lab', time: '09:30 AM', severity: 'HIGH' },
      { title: 'Pre-Thanksgiving Linear Algebra Progress Assessment', course: 'MATH312 Linear Algebra', location: 'Pupin 301', time: '01:00 PM', severity: 'NORMAL' }
    ],
    safetyPool: [
      { title: 'Annual Campus Flu Vaccination Pop-Up Clinic', location: 'Campus Health Center', time: '09:00 AM', severity: 'NORMAL' },
      { title: 'Thanksgiving Recess Shuttle Route Realignment', location: 'Transit Depot', time: '05:00 PM', severity: 'NORMAL' }
    ]
  },
  // 11 = December
  11: {
    theme: 'Fall Term Final Examinations & Winter Recess',
    classPool: [
      { title: 'CS401 Final Submission Milestone Staging', course: 'CS401 Distributed Systems', location: 'Olin Amphitheater', time: '09:30 AM', severity: 'NORMAL' },
      { title: 'ARCH310 Exhibition Jury Installation Shift', course: 'ARCH310 Architecture', location: 'Ruskin Gallery', time: '02:00 PM', severity: 'HIGH' }
    ],
    examPool: [
      { title: 'Final Exam: CS401 Distributed Systems Comprehensive', course: 'CS401 Distributed Systems', location: 'Great Hall North', time: '09:00 AM', severity: 'HIGH' },
      { title: 'Final Exam: ARCH310 Classical Architecture History', course: 'ARCH310 Architecture', location: 'Pupin Physics 420', time: '01:30 PM', severity: 'HIGH' },
      { title: 'Final Exam: ENG202 Fluid Dynamics & Thermal Systems', course: 'ENG202 Fluid Dynamics', location: 'Davis Auditorium', time: '04:00 PM', severity: 'HIGH' },
      { title: 'Final Exam: MATH312 Linear Algebra Final', course: 'MATH312 Linear Algebra', location: 'Turing Center', time: '11:00 AM', severity: 'HIGH' }
    ],
    safetyPool: [
      { title: 'Severe Sub-Zero Freeze & Black Ice Hazard Advisory', location: 'Campus Facilities', time: '06:30 AM', severity: 'CRITICAL' },
      { title: 'Residence Hall Winter Recess Closure Protocol', location: 'Housing Office', time: '06:00 PM', severity: 'NORMAL' }
    ]
  }
};

export const MonthlyAlertCalendar: React.FC<MonthlyAlertCalendarProps> = ({
  soundEnabled = true,
  isExtensiveView = false,
  onNavigateToExtensive,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory>('all');
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(9); // 9 = October (0-indexed)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [pinnedDay, setPinnedDay] = useState<DayData | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to generate dynamic, authentic month data based on year, month, and day-of-week
  const generateMonthData = (year: number, month: number): DayData[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const schedule = ACADEMIC_SCHEDULE_BY_MONTH[month] || ACADEMIC_SCHEDULE_BY_MONTH[9];
    const data: DayData[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isMidtermOrFinalsWeek = (d >= 10 && d <= 21);
      const isFlashDay = (d === 14 || d === 26 || (month === 0 && d === 18) || (month === 11 && d === 22));

      let classCount = 0;
      let examCount = 0;
      let generalCount = 0;

      // Realistic academic scheduling rules
      if (isWeekday) {
        // Mon/Wed/Fri (1, 3, 5) have higher lecture/lab loads
        if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
          classCount = (d % 4 === 0) ? 3 : (d % 2 === 0) ? 2 : 1;
        } else {
          classCount = (d % 3 === 0) ? 2 : 1;
        }
      } else {
        // Weekends have fewer or zero classes
        classCount = (d % 7 === 0) ? 1 : 0;
      }

      // Exam season logic
      if (isMidtermOrFinalsWeek && isWeekday) {
        examCount = (d % 3 === 0) ? 2 : (d % 2 === 0) ? 1 : (month === 4 || month === 11) ? 2 : 1;
      } else if (d % 6 === 0 && isWeekday) {
        examCount = 1;
      }

      // Safety events
      if (isFlashDay) {
        generalCount = 1;
      } else if (d % 9 === 0) {
        generalCount = 1;
      }

      const events: DayEvent[] = [];

      // Add Class Events from pool
      if (classCount > 0 && schedule.classPool.length > 0) {
        for (let i = 0; i < classCount; i++) {
          const tmpl = schedule.classPool[(d + i) % schedule.classPool.length];
          events.push({
            time: tmpl.time,
            category: 'class-updates',
            title: tmpl.title,
            course: tmpl.course,
            location: tmpl.location,
            severity: tmpl.severity
          });
        }
      }

      // Add Exam Events from pool
      if (examCount > 0 && schedule.examPool.length > 0) {
        for (let i = 0; i < examCount; i++) {
          const tmpl = schedule.examPool[(d + i) % schedule.examPool.length];
          events.push({
            time: tmpl.time,
            category: 'exam-updates',
            title: tmpl.title,
            course: tmpl.course,
            location: tmpl.location,
            severity: tmpl.severity
          });
        }
      }

      // Add Safety Events from pool
      if (generalCount > 0 && schedule.safetyPool.length > 0) {
        const tmpl = schedule.safetyPool[d % schedule.safetyPool.length];
        events.push({
          time: tmpl.time,
          category: 'general-events',
          title: tmpl.title,
          location: tmpl.location,
          severity: tmpl.severity
        });
      }

      data.push({
        day: d,
        dateStr: `${monthNames[month]} ${d}, ${year}`,
        classCount,
        examCount,
        generalCount,
        events
      });
    }

    return data;
  };

  const monthData = generateMonthData(currentYear, currentMonthIndex);

  // Dynamically compute the exact day of week (0=Sun, 1=Mon, ..., 6=Sat) for day 1 of selected month/year
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
    setPinnedDay(null);
    setHoveredDay(null);
    if (soundEnabled) playAlertChime('info');
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
    setPinnedDay(null);
    setHoveredDay(null);
    if (soundEnabled) playAlertChime('info');
  };

  const activeDisplayDay = pinnedDay || hoveredDay;

  // Calculate intensity and style for a day based on category filter
  const getDayStyle = (day: DayData) => {
    let relevantCount = 0;
    if (selectedCategory === 'all') {
      relevantCount = day.classCount + day.examCount + day.generalCount;
    } else if (selectedCategory === 'class-updates') {
      relevantCount = day.classCount;
    } else if (selectedCategory === 'exam-updates') {
      relevantCount = day.examCount;
    } else {
      relevantCount = day.generalCount;
    }

    if (relevantCount === 0) {
      return {
        bgClass: 'bg-[#F4F7F8]/80 text-[#71787c] border-[#E2EAEB]',
        badgeText: '0',
        intensity: 'zero'
      };
    }

    // Intensity levels
    if (selectedCategory === 'class-updates') {
      if (relevantCount >= 3) {
        return { bgClass: 'bg-[#C2593F] text-white border-[#A04028] shadow-sm', badgeText: `${relevantCount}`, intensity: 'high' };
      } else if (relevantCount === 2) {
        return { bgClass: 'bg-[#C2593F]/45 text-[#3b1208] border-[#C2593F]/60 font-bold', badgeText: `${relevantCount}`, intensity: 'med' };
      } else {
        return { bgClass: 'bg-[#C2593F]/15 text-[#C2593F] border-[#C2593F]/30', badgeText: `${relevantCount}`, intensity: 'low' };
      }
    } else if (selectedCategory === 'exam-updates') {
      if (relevantCount >= 3) {
        return { bgClass: 'bg-[#D99B26] text-[#001f28] border-[#B57C12] shadow-sm font-bold', badgeText: `${relevantCount}`, intensity: 'high' };
      } else if (relevantCount === 2) {
        return { bgClass: 'bg-[#D99B26]/50 text-[#3d2900] border-[#D99B26]/70 font-semibold', badgeText: `${relevantCount}`, intensity: 'med' };
      } else {
        return { bgClass: 'bg-[#D99B26]/20 text-[#8F6108] border-[#D99B26]/35', badgeText: `${relevantCount}`, intensity: 'low' };
      }
    } else if (selectedCategory === 'general-events') {
      if (relevantCount >= 2) {
        return { bgClass: 'bg-[#A82A2A] text-white border-red-700 shadow-sm font-bold', badgeText: `${relevantCount}`, intensity: 'high' };
      } else {
        return { bgClass: 'bg-[#2E473B]/25 text-[#1b3427] border-[#2E473B]/40 font-semibold', badgeText: `${relevantCount}`, intensity: 'med' };
      }
    } else {
      if (relevantCount >= 5) {
        return { bgClass: 'bg-[#003643] text-white border-[#0E2D36] shadow-sm font-bold', badgeText: `${relevantCount}`, intensity: 'high' };
      } else if (relevantCount >= 3) {
        return { bgClass: 'bg-[#1b4d5c]/55 text-white border-[#1b4d5c]/70 font-semibold', badgeText: `${relevantCount}`, intensity: 'med' };
      } else {
        return { bgClass: 'bg-[#1b4d5c]/15 text-[#003643] border-[#1b4d5c]/30 font-medium', badgeText: `${relevantCount}`, intensity: 'low' };
      }
    }
  };

  const totalMonthEvents = monthData.reduce(
    (acc, d) => acc + d.classCount + d.examCount + d.generalCount,
    0
  );

  const currentTheme = ACADEMIC_SCHEDULE_BY_MONTH[currentMonthIndex]?.theme || 'Academic Event Schedule';

  return (
    <div className="w-full rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-[#DCE5E7] flex flex-col gap-5">
      {/* 1. TOP HEADER & MONTH CONTROLS (STACKED FOR PERFECT RESPONSIVENESS IN BOTH SIDEBAR AND FULL WIDTH) */}
      <div className="flex flex-col gap-3 pb-4 border-b border-[#DCE5E7]">
        {/* Row 1: Subtitle badge & Total monthly count */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C2593F] animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#C2593F] font-bold">
              Event Timeline • Incident Calendar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#F0F5F6] border border-[#DCE5E7] font-mono text-xs text-[#003643] font-bold">
              {totalMonthEvents} Alerts in {monthNames[currentMonthIndex]}
            </span>
            <span className="hidden sm:inline-block font-mono text-[11px] text-[#2E473B] font-semibold">
              ✔ 100% Zero-Drop
            </span>
          </div>
        </div>

        {/* Row 2: Title and Subtitle */}
        <div>
          <h3 className={`font-editorial font-bold text-[#003643] leading-tight ${isExtensiveView ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
            Monthly Alert Density &amp; Dispatch Timeline
          </h3>
          <p className="text-xs text-[#41484b] mt-1 leading-relaxed">
            {currentTheme}. Click any day to inspect its chronological event timeline.
          </p>
        </div>

        {/* Row 3: Month Navigation Controls & Extensive View Button */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
          {/* Month Selector */}
          <div className="flex items-center gap-1 bg-[#F0F5F6] p-1 rounded-xl border border-[#DCE5E7]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-[#003643] hover:bg-white transition-all active:scale-95 cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-editorial text-sm font-bold text-[#003643] min-w-[130px] text-center">
              {monthNames[currentMonthIndex]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-[#003643] hover:bg-white transition-all active:scale-95 cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Extensive View Action */}
          {onNavigateToExtensive && !isExtensiveView && (
            <button
              type="button"
              onClick={() => {
                onNavigateToExtensive();
                if (soundEnabled) playAlertChime('info');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#003643] text-white hover:bg-[#133945] font-mono text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-xs flex items-center gap-1.5"
              title="Open Extensive Calendar & Stats Screen"
            >
              <span>Extensive View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. CATEGORY TABS & COLOR INTENSITY LEGEND */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-mono text-[#71787c]">Filter Stream:</span>
          {/* Intensity Legend */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#71787c]">
            <span className="text-[10px]">Alert Intensity:</span>
            <div className="flex items-center gap-1">
              <span className="w-3.5 h-3.5 rounded-sm bg-[#F4F7F8] border border-[#DCE5E7] flex items-center justify-center text-[8px]" title="0 Alerts">0</span>
              <span className="w-3.5 h-3.5 rounded-sm bg-[#C2593F]/20 border border-[#C2593F]/35" title="1-2 Alerts"></span>
              <span className="w-3.5 h-3.5 rounded-sm bg-[#C2593F]/55 border border-[#C2593F]/70" title="3-5 Alerts"></span>
              <span className="w-3.5 h-3.5 rounded-sm bg-[#C2593F] border border-[#A04028]" title="6+ Alerts"></span>
            </div>
            <span className="text-[10px]">High</span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              if (soundEnabled) playAlertChime('info');
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-[#003643] text-white shadow-xs'
                : 'bg-[#F0F5F6] text-[#003643] hover:bg-[#dbebf1]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#1b4d5c]"></span>
            <span>All Events (Neutral)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('class-updates');
              if (soundEnabled) playAlertChime('info');
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'class-updates'
                ? 'bg-[#C2593F] text-white shadow-xs'
                : 'bg-[#F0F5F6] text-[#C2593F] hover:bg-[#F9ECE8]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#C2593F]"></span>
            <span>Class Updates</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('exam-updates');
              if (soundEnabled) playAlertChime('info');
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'exam-updates'
                ? 'bg-[#D99B26] text-[#001f28] shadow-xs'
                : 'bg-[#F0F5F6] text-[#8F6108] hover:bg-[#FBF4E7]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#D99B26]"></span>
            <span>Exam Updates</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedCategory('general-events');
              if (soundEnabled) playAlertChime('info');
            }}
            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'general-events'
                ? 'bg-[#A82A2A] text-white shadow-xs'
                : 'bg-[#F0F5F6] text-[#A82A2A] hover:bg-[#FDF0F0]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#A82A2A]"></span>
            <span>Safety &amp; General</span>
          </button>
        </div>
      </div>

      {/* 3. CALENDAR MONTH GRID */}
      <div className="w-full flex flex-col gap-1.5">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-xs font-bold text-[#003643] py-2 bg-[#F0F5F6] rounded-xl border border-[#DCE5E7]">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty prefix padding for alignment (accurate based on firstDayOfWeek) */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => {
            const prevMonthDays = new Date(currentYear, currentMonthIndex, 0).getDate();
            const prevDayNum = prevMonthDays - firstDayOfWeek + i + 1;
            return (
              <div
                key={`pad-${i}`}
                className={`${
                  isExtensiveView
                    ? 'min-h-[85px] sm:min-h-[95px] p-2'
                    : 'min-h-[44px] sm:min-h-[50px] p-1.5'
                } rounded-xl bg-transparent border border-dashed border-[#DCE5E7]/50 opacity-40 flex flex-col justify-start`}
              >
                <span className="text-[10px] font-mono text-[#a0a8ab]">
                  {prevDayNum}
                </span>
              </div>
            );
          })}

          {/* Actual Month Days */}
          {monthData.map((d) => {
            const style = getDayStyle(d);
            const totalOnDay = d.classCount + d.examCount + d.generalCount;
            const isPinned = pinnedDay?.day === d.day;
            const isHovered = hoveredDay?.day === d.day;

            return (
              <div
                key={d.day}
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => {
                  setPinnedDay(pinnedDay?.day === d.day ? null : d);
                  if (soundEnabled) playAlertChime('info');
                }}
                className={`relative ${
                  isExtensiveView
                    ? 'min-h-[85px] sm:min-h-[95px] p-2.5 flex-col justify-between'
                    : 'min-h-[44px] sm:min-h-[50px] p-1.5 flex-col justify-between'
                } rounded-xl border transition-all duration-200 cursor-pointer flex group hover:scale-[1.03] hover:shadow-md select-none ${
                  style.bgClass
                } ${
                  isPinned
                    ? 'ring-3 ring-[#003643] shadow-lg scale-[1.02]'
                    : isHovered
                    ? 'shadow-md'
                    : ''
                }`}
                title={`${d.dateStr}: ${totalOnDay} alerts (${d.classCount} class, ${d.examCount} exam, ${d.generalCount} safety)`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-editorial font-bold ${
                      isExtensiveView ? 'text-base sm:text-lg' : 'text-xs sm:text-sm'
                    }`}
                  >
                    {d.day}
                  </span>
                  {isExtensiveView && totalOnDay > 0 && (
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        style.intensity === 'high'
                          ? 'bg-white/20 text-white'
                          : 'bg-black/10 text-current'
                      }`}
                    >
                      {totalOnDay} evt
                    </span>
                  )}
                </div>

                {/* Clean Category Dots representing multi-category alerts */}
                <div className="flex items-center gap-1 flex-wrap mt-0.5">
                  {d.classCount > 0 && (
                    <span
                      className={`${isExtensiveView ? 'w-2 h-2' : 'w-1.5 h-1.5'} rounded-full bg-[#C2593F]`}
                      title={`${d.classCount} Class Updates`}
                    ></span>
                  )}
                  {d.examCount > 0 && (
                    <span
                      className={`${isExtensiveView ? 'w-2 h-2' : 'w-1.5 h-1.5'} rounded-full bg-[#D99B26]`}
                      title={`${d.examCount} Exam Updates`}
                    ></span>
                  )}
                  {d.generalCount > 0 && (
                    <span
                      className={`${isExtensiveView ? 'w-2 h-2' : 'w-1.5 h-1.5'} rounded-full bg-[#A82A2A]`}
                      title={`${d.generalCount} Campus Safety Flashes`}
                    ></span>
                  )}
                </div>

                {/* In extensive view, also show caption snippet */}
                {isExtensiveView && (
                  <div className="text-[10px] font-mono truncate opacity-75 mt-auto">
                    {totalOnDay === 0
                      ? 'Quiet'
                      : `${totalOnDay} alert${totalOnDay > 1 ? 's' : ''}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. INTERACTIVE DAY TIMELINE & INSPECTION DRAWER */}
      {activeDisplayDay && (
        <div className="rounded-2xl bg-[#0E2D36] text-white p-5 border border-white/10 flex flex-col gap-4 animate-fadeIn shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#D99B26]/20 text-[#ffdeae] flex items-center justify-center font-editorial text-xl font-bold">
                {activeDisplayDay.day}
              </span>
              <div>
                <h4 className="font-editorial text-xl font-bold text-white">
                  Timeline for {activeDisplayDay.dateStr}
                </h4>
                <div className="flex items-center gap-2 font-mono text-xs text-[#8ebdce] mt-0.5 flex-wrap">
                  <span>
                    Total Events: <strong className="text-white">{activeDisplayDay.events.length}</strong>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#C2593F]"></span>
                    Class: {activeDisplayDay.classCount}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#D99B26]"></span>
                    Exams: {activeDisplayDay.examCount}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#A82A2A]"></span>
                    Safety: {activeDisplayDay.generalCount}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPinnedDay(null);
                setHoveredDay(null);
              }}
              className="p-1 rounded-lg text-[#8ebdce] hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Close Timeline View"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chronological Event Timeline */}
          {activeDisplayDay.events.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/5 text-center text-xs text-[#8ebdce] font-mono">
              No campus incidents, relocations, or exams published on this date.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
              {activeDisplayDay.events.map((evt, idx) => {
                const isCrit = evt.severity === 'CRITICAL';
                const isHigh = evt.severity === 'HIGH';
                const badgeColor =
                  evt.category === 'class-updates'
                    ? 'bg-[#C2593F]/25 text-[#ffb4a2] border-[#C2593F]/50'
                    : evt.category === 'exam-updates'
                    ? 'bg-[#D99B26]/25 text-[#ffdeae] border-[#D99B26]/50'
                    : 'bg-[#A82A2A]/25 text-red-300 border-red-500/50';

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-[#ffdeae] shrink-0 pt-0.5 sm:pt-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${badgeColor}`}>
                            {evt.category}
                          </span>
                          <span className="font-editorial text-sm font-bold text-white">
                            {evt.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#8ebdce] font-mono mt-1 flex-wrap">
                          <MapPin className="w-3.5 h-3.5 text-[#ffdeae]" />
                          <span>Venue: {evt.location}</span>
                          {evt.course && (
                            <>
                              <span>•</span>
                              <span className="text-white font-bold">{evt.course}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          isCrit
                            ? 'bg-red-500 text-white animate-pulse'
                            : isHigh
                            ? 'bg-[#D99B26] text-[#001f28]'
                            : 'bg-white/10 text-[#8ebdce]'
                        }`}
                      >
                        {evt.severity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
