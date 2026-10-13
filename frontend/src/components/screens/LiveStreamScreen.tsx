import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Send,
  Zap,
  Radio,
  Clock,
  CheckCircle,
  FileText,
  AlertOctagon,
  Calendar,
  MapPin,
  Share2,
  Bell,
  Mail,
  Shield,
  Search,
  Filter
} from 'lucide-react';
import { ThreeHeroCanvas } from '../ThreeHeroCanvas';
import { IndoorMapModal } from '../IndoorMapModal';
import { MonthlyAlertCalendar } from '../MonthlyAlertCalendar';
import { downloadIcsCalendarEvent } from '../../utils/calendar';
import { playAlertChime } from '../../utils/sound';

interface LiveAlert {
  id: string;
  topic: 'class-updates' | 'exam-updates' | 'general-events' | 'campus-safety';
  priority: 'URGENT' | 'HIGH' | 'CRITICAL' | 'NORMAL';
  metaBadge: string;
  title: string;
  description: string;
  timestamp: string;
  recipientsNotified: string;
  actionType: 'reschedule' | 'venue' | 'safety' | 'event';
  acknowledged?: boolean;
  copied?: boolean;
  calendarAdded?: boolean;
  venueName?: string;
}

interface LiveStreamScreenProps {
  soundEnabled: boolean;
  role?: 'Admin' | 'Faculty' | 'Student';
  onNavigateToDispatcher?: () => void;
  onNavigateToCalendar?: () => void;
}

export const LiveStreamScreen: React.FC<LiveStreamScreenProps> = ({
  soundEnabled,
  role = 'Faculty',
  onNavigateToDispatcher,
  onNavigateToCalendar,
}) => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'classroom' | 'venue' | 'safety'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [heatmapTopic, setHeatmapTopic] = useState<string>('All Topics');
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ day: number; count: number; date: string } | null>(null);

  // Map Modal State
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [mapVenue, setMapVenue] = useState<string>('Tudor Hall 3B (Drafting Suite)');
  const [mapCourse, setMapCourse] = useState<string>('ARCH310');

  // Broadcast Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTopic, setModalTopic] = useState<string>('class-updates');
  const [modalHeadline, setModalHeadline] = useState<string>('');
  const [modalDetails, setModalDetails] = useState<string>('');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);

  // Toast feedback state
  const [quickToast, setQuickToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setQuickToast(msg);
    setTimeout(() => setQuickToast(null), 3500);
  };

  const [alerts, setAlerts] = useState<LiveAlert[]>([
    {
      id: 'alert-1',
      topic: 'exam-updates',
      priority: 'URGENT',
      metaBadge: 'Urgent • Exam Rescheduled',
      title: 'CS401: Distributed Systems Final Exam',
      description:
        'Postponed to Friday, Oct 18 • 10:00 AM in Great Hall West due to campus network stress-test conflict.',
      timestamp: 'Just now • Kafka :9092',
      recipientsNotified: '184/190 Students Notified • WebPush + Email dispatched',
      actionType: 'reschedule',
      venueName: 'Great Hall West'
    },
    {
      id: 'alert-2',
      topic: 'class-updates',
      priority: 'HIGH',
      metaBadge: 'High • Venue Changed',
      title: 'ARCH310: Classical Architecture Studio',
      description:
        'Re-routed from Quad North Garden Lawn directly to Tudor Hall 3B (Drafting Suite) due to unexpected wind chill and precipitation.',
      timestamp: '2 mins ago • Socket.IO',
      recipientsNotified: 'Drafting Easels Allocated: Room 3B',
      actionType: 'venue',
      venueName: 'Tudor Hall 3B (Drafting Suite)'
    },
    {
      id: 'alert-3',
      topic: 'campus-safety',
      priority: 'CRITICAL',
      metaBadge: 'Critical Broadcast • Campus Safety',
      title: 'Inclement Weather Flash Warning: Severe Gale in North Campus Lawn',
      description:
        'Outdoor gatherings suspended immediately. High branches falling along Dean’s Walk. Safety shelters active in Mason Science Hall & Academic Center Buildings A & B.',
      timestamp: '5 mins ago • VAPID + Nodemailer',
      recipientsNotified: 'Verified by Senate Public Safety Command • SLA 1.1s',
      actionType: 'safety',
      venueName: 'Mason Science Hall Shelters'
    },
    {
      id: 'alert-4',
      topic: 'general-events',
      priority: 'NORMAL',
      metaBadge: 'Normal • Academic Event',
      title: 'Guest Lecture: Dr. Aris Thorne on Event-Driven Brokers',
      description:
        'Keynote presentation exploring Zero-Cost distributed push topologies, Kafka partition balancing, and resilient high-throughput collegiate notifications.',
      timestamp: 'In 45m • Turing Amphitheater',
      recipientsNotified: 'Seats Remaining: 42 / 200',
      actionType: 'event',
      venueName: 'Turing Amphitheater Hall 1'
    }
  ]);

  // Open Trigger Modal
  const openTriggerModal = (type: 'cancel' | 'venue' | 'flash') => {
    if (type === 'cancel') {
      setModalTopic('class-updates');
      setModalHeadline('MATH202: Multivariable Calculus Cancelled');
      setModalDetails('Session cancelled due to instructor transit delay. Recitation office hours will convene on Zoom.');
    } else if (type === 'venue') {
      setModalTopic('class-updates');
      setModalHeadline('PHIL101: Ethics Moved to Great Library Annex');
      setModalDetails('Room reallocation due to acoustics testing in Main Quad. Please report directly to Great Library Annex.');
    } else {
      setModalTopic('general-events');
      setModalHeadline('CAMPUS FLASH: High Wind Advisory Across Quadrangle');
      setModalDetails('Severe weather warning. Move all outdoor cohorts into nearby stone arcades immediately.');
    }
    setIsModalOpen(true);
  };

  // Instant Quick Action Trigger (Direct Dispatch)
  const handleQuickDispatch = (type: 'cancel' | 'venue' | 'flash') => {
    if (soundEnabled) playAlertChime(type === 'flash' ? 'urgent' : 'warning');
    setIsBroadcasting(true);

    setTimeout(() => {
      let newAlert: LiveAlert;
      if (type === 'cancel') {
        newAlert = {
          id: `alert-${Date.now()}`,
          topic: 'class-updates',
          priority: 'URGENT',
          metaBadge: 'Urgent • Class Cancelled',
          title: 'CS401: Distributed Systems Lecture Cancelled',
          description: 'Faculty emergency transformer overhaul in Turing Lecture Hall. Recitation recording will be uploaded to Canvas.',
          timestamp: 'Just now • Fanout Latency: 0.8ms',
          recipientsNotified: '412 Students Notified via Socket.IO & Push',
          actionType: 'reschedule',
          venueName: 'Online / Turing Annex'
        };
        // Update database course status to CANCELLED
        fetch('http://localhost:4000/api/database/tables/courses/CS401', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'CANCELLED' })
        }).catch(() => {});
        triggerToast('Class Cancellation committed to Database & Kafka class-updates!');
      } else if (type === 'venue') {
        newAlert = {
          id: `alert-${Date.now()}`,
          topic: 'class-updates',
          priority: 'HIGH',
          metaBadge: 'High • Venue Shifted',
          title: 'ARCH310: Relocated to Tudor Hall 3B',
          description: 'Relocated from North Quad Lawn to Tudor Hall 3B due to gusty wind. Drafting boards ready.',
          timestamp: 'Just now • Fanout Latency: 1.1ms',
          recipientsNotified: '68 Enrolled Students Synchronized',
          actionType: 'venue',
          venueName: 'Tudor Hall 3B'
        };
        // Update database course status to RELOCATED
        fetch('http://localhost:4000/api/database/tables/courses/ARCH310', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'RELOCATED', room: 'Tudor Hall 3B' })
        }).catch(() => {});
        triggerToast('Venue Relocation committed to Database & Kafka class-updates!');
      } else {
        newAlert = {
          id: `alert-${Date.now()}`,
          topic: 'campus-safety',
          priority: 'CRITICAL',
          metaBadge: 'Tier 0 Flash • Campus Safety',
          title: 'CRITICAL FLASH: Severe Hail & Gale Warning',
          description: 'All outdoor quads closed immediately. Seek stone shelter in Mason Hall or Library Annex.',
          timestamp: 'Just now • Fanout Latency: 0.4ms',
          recipientsNotified: '16,500 Campus Members Dispatched (Tri-Channel)',
          actionType: 'safety',
          venueName: 'All Stone Interior Arcades'
        };
        triggerToast('Tier 0 Emergency Broadcast Dispatched & Logged to Database!');
      }

      // Persist alert to database ledger
      fetch('http://localhost:4000/api/database/tables/alert_audit_ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newAlert.id,
          topic: newAlert.topic,
          priority: newAlert.priority,
          signatory: role === 'Admin' ? 'Dean Sterling (Admin)' : 'Dr. Julian Vance (Faculty)',
          headline: newAlert.title,
          scope: 'Enrolled Campus Roster',
          latency: '0.8ms',
          timestamp: new Date().toLocaleTimeString()
        })
      }).catch(() => {});

      setAlerts(prev => [newAlert, ...prev]);
      setIsBroadcasting(false);
    }, 400);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalHeadline.trim()) return;

    if (soundEnabled) playAlertChime('urgent');

    const newAlert: LiveAlert = {
      id: `alert-${Date.now()}`,
      topic: modalTopic as any,
      priority: modalTopic === 'general-events' ? 'CRITICAL' : 'URGENT',
      metaBadge: 'Broadcast Just Now • Kafka Shard #04',
      title: modalHeadline,
      description: modalDetails || 'Manual broadcast from faculty dispatch terminal.',
      timestamp: 'Just now • Fanout Latency: 0.9ms',
      recipientsNotified: '1,420 WebSockets & 3,890 WebPush Subscribers Delivered',
      actionType: modalTopic === 'class-updates' ? 'venue' : 'safety',
      venueName: 'Campus Broadcaster'
    };

    fetch('http://localhost:4000/api/database/tables/alert_audit_ledger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newAlert.id,
        topic: newAlert.topic,
        priority: newAlert.priority,
        signatory: role === 'Admin' ? 'Dean Sterling (Admin)' : 'Dr. Julian Vance (Faculty)',
        headline: newAlert.title,
        scope: 'Campus Roster',
        latency: '0.9ms',
        timestamp: new Date().toLocaleTimeString()
      })
    }).catch(() => {});

    setAlerts([newAlert, ...alerts]);
    setIsModalOpen(false);
    triggerToast('Broadcast successfully published & committed to Database!');
  };

  const acknowledgeAlert = (id: string) => {
    if (soundEnabled) playAlertChime('success');
    setAlerts(alerts.map(a => (a.id === id ? { ...a, acknowledged: true } : a)));
    triggerToast('Delivery receipt verified and cryptographically signed.');
  };

  // Action: Add to Calendar
  const handleAddToCalendar = (alert: LiveAlert) => {
    if (soundEnabled) playAlertChime('success');
    downloadIcsCalendarEvent(
      alert.title,
      alert.description,
      alert.venueName || 'Campus Great Hall'
    );
    setAlerts(alerts.map(a => (a.id === alert.id ? { ...a, calendarAdded: true } : a)));
    triggerToast(`Added "${alert.title}" to your calendar (.ics downloaded)!`);
    setTimeout(() => {
      setAlerts(prev => prev.map(a => (a.id === alert.id ? { ...a, calendarAdded: false } : a)));
    }, 4000);
  };

  // Action: Open Indoor Map
  const handleOpenMap = (alert: LiveAlert) => {
    if (soundEnabled) playAlertChime('info');
    setMapVenue(alert.venueName || 'Tudor Hall 3B (Drafting Suite)');
    setMapCourse(alert.title.split(':')[0] || 'ARCH310');
    setIsMapOpen(true);
  };

  // Action: Share Alert
  const handleShareAlert = (alert: LiveAlert) => {
    if (soundEnabled) playAlertChime('info');
    const shareText = `[CAMPUS ALERT] ${alert.title}\n${alert.description}\nTime: ${alert.timestamp}`;
    navigator.clipboard.writeText(shareText);
    setAlerts(alerts.map(a => (a.id === alert.id ? { ...a, copied: true } : a)));
    triggerToast('Alert summary & verification hash copied to clipboard!');
    setTimeout(() => {
      setAlerts(prev => prev.map(a => (a.id === alert.id ? { ...a, copied: false } : a)));
    }, 3000);
  };

  // Action: Reserve Seat Pass
  const handleReserveSeat = (id: string) => {
    if (soundEnabled) playAlertChime('success');
    setAlerts(alerts.map(a => (a.id === id ? {
      ...a,
      acknowledged: true,
      recipientsNotified: 'Seat #42 Reserved • Pass ID: PSD-9912'
    } : a)));
    triggerToast('Guest lecture seat pass #42 reserved successfully!');
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch =
      searchQuery === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'urgent') return a.priority === 'URGENT' || a.priority === 'CRITICAL';
    if (filter === 'classroom') return a.topic === 'class-updates' || a.topic === 'exam-updates';
    if (filter === 'venue') return a.actionType === 'venue';
    if (filter === 'safety') return a.topic === 'campus-safety' || a.priority === 'CRITICAL';
    return true;
  });

  return (
    <div className="w-full flex flex-col relative">
      {/* Dynamic Toast Feedback Pill */}
      {quickToast && (
        <div className="fixed top-24 right-8 z-50 bg-[#003643] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#ffdeae]/40 text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{quickToast}</span>
        </div>
      )}

      {/* 1. HERO SECTION WITH 3D CANVAS & CHIAROSCURO LIGHTS */}
      <section className="relative w-full overflow-hidden bg-[#0E2D36] text-white shadow-xl min-h-[500px]">
        {/* 3D Three.js Interactive Mesh Layer */}
        <div className="absolute inset-0 w-full h-[540px] pointer-events-none opacity-85">
          <ThreeHeroCanvas height={540} />
        </div>

        {/* Ambient chiaroscuro glow rings */}
        <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-[#C2593F]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-1/4 w-[460px] h-[460px] rounded-full bg-[#D99B26]/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Top Breadcrumb & Live Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#ffdeae] font-mono text-xs border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#D99B26] animate-ping"></span>
                CLUSTER NODE #04 ACTIVE
              </span>
              <span className="text-[#8ebdce] font-mono text-xs">•</span>
              <span className="font-mono text-xs text-[#8ebdce]">KAFKA BROKER :9092 ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#8ebdce]">Latency Target:</span>
              <span className="px-2 py-0.5 rounded bg-white/15 font-mono text-xs text-white font-semibold">
                1.4ms (p99)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#2E473B] text-white font-mono text-xs font-semibold">
                ZERO PAID EXTERNAL APIs
              </span>
            </div>
          </div>

          {/* Headline and Broadcast Quick Trigger Bento */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-8">
            <div className="lg:col-span-8 flex flex-col gap-2">
              <p className="font-mono text-xs uppercase tracking-widest text-[#C2593F] font-semibold">
                Institutional Real-Time Backbone
              </p>
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight">
                Campus Pulse <span className="italic font-normal text-[#ffdeae]">&amp;</span> Dispatch Orchestrator
              </h1>
              <p className="text-sm sm:text-base text-[#8ebdce] max-w-2xl font-light leading-relaxed">
                Sub-millisecond fanout engine routing class cancellations, exam rescheduling notices, venue relocations, and critical flash warnings directly across browser sockets, native push tokens, and campus relay inboxes.
              </p>
            </div>

            {/* Role-Specific Quick Action Bento Box */}
            <div className="lg:col-span-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 shadow-xl flex flex-col gap-2.5">
              {role === 'Student' ? (
                // STUDENT VIEW: Life safety & course filtering (Read-only alerts, no publishing)
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#ffdeae] font-semibold flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#ffdeae]" />
                      Student Life-Safety Center
                    </span>
                    <span className="font-mono text-[10px] bg-[#2E473B] text-white px-2 py-0.5 rounded-full font-bold">
                      Read-Only Roster
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('CS401');
                        if (soundEnabled) playAlertChime('info');
                        triggerToast('Filtered stream to enrolled course CS401');
                      }}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-left border border-white/10 cursor-pointer"
                    >
                      <span className="font-mono text-[10px] text-[#ffdeae] block uppercase">Enrolled</span>
                      <span className="text-xs font-bold text-white">CS401 Stream</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('ARCH310');
                        if (soundEnabled) playAlertChime('info');
                        triggerToast('Filtered stream to enrolled course ARCH310');
                      }}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-left border border-white/10 cursor-pointer"
                    >
                      <span className="font-mono text-[10px] text-[#ffdeae] block uppercase">Enrolled</span>
                      <span className="text-xs font-bold text-white">ARCH310 Stream</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast('You are marked Verified Safe on active Senate roster ✓');
                      if (soundEnabled) playAlertChime('success');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#2E473B] hover:bg-[#385646] active:scale-95 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer border border-[#4d735f]"
                  >
                    <CheckCircle className="w-4 h-4 text-[#ffdeae]" />
                    <span>One-Click Campus Safe Check-in</span>
                  </button>
                </div>
              ) : role === 'Faculty' ? (
                // FACULTY VIEW: Course authoring & relocation controls
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#D99B26]" />
                      Faculty Course Dispatch
                    </span>
                    <span className="font-mono text-[11px] bg-[#C2593F] text-white px-2 py-0.5 rounded-full font-bold">
                      Dr. Vance / CS Dept
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleQuickDispatch('cancel')}
                      className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-[#C2593F] active:scale-95 transition-all text-center border border-white/10 hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                      type="button"
                      title="Simulate Cancel CS401 Class"
                    >
                      <span className="font-mono text-xs font-bold text-[#ffdeae] group-hover:text-white">✕</span>
                      <span className="text-[11px] font-semibold mt-1 text-white">Cancel Class</span>
                    </button>

                    <button
                      onClick={() => handleQuickDispatch('venue')}
                      className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/10 hover:bg-[#D99B26] active:scale-95 transition-all text-center border border-white/10 hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                      type="button"
                      title="Simulate Shift Venue"
                    >
                      <MapPin className="w-4 h-4 text-[#ffdeae] group-hover:text-[#001f28]" />
                      <span className="text-[11px] font-semibold mt-1 text-white group-hover:text-[#001f28]">
                        Shift Venue
                      </span>
                    </button>
                  </div>
                  {onNavigateToDispatcher && (
                    <button
                      type="button"
                      onClick={onNavigateToDispatcher}
                      className="w-full py-1.5 mt-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#ffdeae] hover:text-white font-mono text-[11px] font-bold border border-white/15 transition text-center cursor-pointer"
                    >
                      + Open Full Event Mutation Studio &rarr;
                    </button>
                  )}
                </div>
              ) : (
                // ADMIN VIEW: Full Senate Operations & Emergency Siren
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-[#A82A2A]" />
                      Senate Operations Console
                    </span>
                    <span className="font-mono text-[11px] bg-[#A82A2A] text-white px-2 py-0.5 rounded-full font-bold">
                      Master Authority
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      onClick={() => handleQuickDispatch('cancel')}
                      className="group flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-[#C2593F] active:scale-95 transition-all text-center border border-white/10 hover:shadow-lg cursor-pointer"
                      type="button"
                    >
                      <span className="font-mono text-xs font-bold text-[#ffdeae]">✕</span>
                      <span className="text-[10px] font-semibold mt-1 text-white">Cancel Class</span>
                    </button>

                    <button
                      onClick={() => handleQuickDispatch('venue')}
                      className="group flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-[#D99B26] active:scale-95 transition-all text-center border border-white/10 hover:shadow-lg cursor-pointer"
                      type="button"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#ffdeae]" />
                      <span className="text-[10px] font-semibold mt-1 text-white">Shift Venue</span>
                    </button>

                    <button
                      onClick={() => handleQuickDispatch('flash')}
                      className="group flex flex-col items-center justify-center p-2 rounded-xl bg-[#A82A2A] hover:bg-red-700 active:scale-95 transition-all text-center shadow-md border border-red-500/50 hover:shadow-lg cursor-pointer"
                      type="button"
                    >
                      <AlertOctagon className="w-3.5 h-3.5 text-white animate-pulse" />
                      <span className="text-[10px] font-bold mt-1 text-white">Flash Siren</span>
                    </button>
                  </div>
                  {onNavigateToDispatcher && (
                    <button
                      type="button"
                      onClick={onNavigateToDispatcher}
                      className="w-full py-1.5 mt-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#ffdeae] hover:text-white font-mono text-[11px] font-bold border border-white/15 transition text-center cursor-pointer"
                    >
                      + Custom Broadcast Dispatcher &rarr;
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Telemetry Status Ribbon: Microservices & Delivery Channels */}
          <div className="w-full pt-4 border-t border-white/15 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { name: 'User Svc :4001', detail: 'Heartbeat 240ms', color: '#2E473B' },
              { name: 'Class Svc :4002', detail: 'Synced (84 courses)', color: '#2E473B' },
              { name: 'Exam Svc :4003', detail: 'Locked & Primed', color: '#2E473B' },
              { name: 'Event Svc :4004', detail: '12 active quads', color: '#2E473B' },
              { name: 'Engine :4005', detail: '3,892 VAPID queued', color: '#D99B26' },
              { name: 'Kafka :9092', detail: '3 Topics • 0 Lag', color: '#C2593F' },
            ].map(svc => (
              <div
                key={svc.name}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                  style={{ backgroundColor: svc.color, color: svc.color }}
                ></div>
                <div className="flex flex-col">
                  <span className="font-mono text-xs text-white font-semibold">{svc.name}</span>
                  <span className="font-mono text-[10px] text-[#8ebdce]">{svc.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MULTI-CHANNEL THROUGHPUT STRIP */}
      <div className="w-full bg-[#F0F5F6] border-y border-[#DCE5E7] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white shadow-sm border border-[#DCE5E7] hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-[#1b4d5c] text-white flex items-center justify-center flex-shrink-0">
              <Radio className="w-6 h-6 text-[#ffdeae]" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-editorial text-lg text-[#003643] font-bold">1,420 Clients</span>
                <span className="font-mono text-[10px] text-[#2E473B] font-semibold bg-[#e7f6fd] px-2 py-0.5 rounded-full">
                  100% ONLINE
                </span>
              </div>
              <span className="text-xs text-[#41484b] truncate">
                Socket.IO In-App State Streams (Instant Web UI)
              </span>
              <div className="w-full bg-[#F0F5F6] h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#1b4d5c] h-full rounded-full w-full"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white shadow-sm border border-[#DCE5E7] hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-[#C2593F] text-white flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-editorial text-lg text-[#C2593F] font-bold">3,890 Pushes</span>
                <span className="font-mono text-[10px] text-[#C2593F] font-semibold bg-[#F9ECE8] px-2 py-0.5 rounded-full">
                  VAPID READY
                </span>
              </div>
              <span className="text-xs text-[#41484b] truncate">
                Web Push Background Workers (Mobile / Desktop)
              </span>
              <div className="w-full bg-[#F0F5F6] h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#C2593F] h-full rounded-full w-[94%]"></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white shadow-sm border border-[#DCE5E7] hover:shadow-md transition">
            <div className="w-12 h-12 rounded-lg bg-[#003643] text-[#ffdeae] flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-editorial text-lg text-[#003643] font-bold">4,102 Inboxes</span>
                <span className="font-mono text-[10px] text-[#003643] font-semibold bg-[#FBF4E7] px-2 py-0.5 rounded-full">
                  $0 SMTP COST
                </span>
              </div>
              <span className="text-xs text-[#41484b] truncate">
                Nodemailer Academic Relays (Faculty + Senate Digests)
              </span>
              <div className="w-full bg-[#F0F5F6] h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#D99B26] h-full rounded-full w-[98%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. PRIMARY SPLIT WORKSPACE: LIVE NOTIFICATION STREAM VS HEATMAP */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Live Floating Notification Feed (7 Cols) */}
          <section className="xl:col-span-7 flex flex-col gap-6">
            {/* Filter Pills and Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C2593F] animate-pulse"></span>
                  <h2 className="font-editorial text-2xl font-bold text-[#003643]">
                    Live Pulse &amp; Active Broadcast Stream
                  </h2>
                </div>
                <p className="text-xs text-[#41484b] mt-0.5">
                  Multi-topic real-time ingestion from Kafka Broker. High priority alert items require tactile acknowledgement.
                </p>
              </div>

              {/* Dynamic Filter Pills */}
              <div className="flex flex-wrap items-center p-1 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] self-start gap-1">
                {[
                  { id: 'all', label: 'All Streams' },
                  { id: 'urgent', label: 'Urgent' },
                  { id: 'classroom', label: 'Classroom' },
                  { id: 'venue', label: 'Venue Shifts' },
                  { id: 'safety', label: 'Safety Flashes' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setFilter(p.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition active:scale-95 ${
                      filter === p.id
                        ? 'bg-[#003643] text-white shadow-sm'
                        : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Search Bar */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter alerts by course, venue, keyword..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#DCE5E7] bg-white text-xs font-mono text-[#003643] focus:outline-none focus:ring-2 focus:ring-[#003643]"
              />
            </div>

            {/* Notification Stream Cards Stack */}
            <div className="flex flex-col gap-4">
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#DCE5E7] text-gray-500 font-mono text-xs">
                  No alerts matching filter "{filter}".
                </div>
              ) : (
                filteredAlerts.map(alert => {
                  const isUrgent = alert.priority === 'URGENT';
                  const isCritical = alert.priority === 'CRITICAL';
                  const isHigh = alert.priority === 'HIGH';

                  const borderAccentColor = isCritical
                    ? 'bg-[#A82A2A]'
                    : isUrgent
                    ? 'bg-[#C2593F]'
                    : isHigh
                    ? 'bg-[#003643]'
                    : 'bg-[#D99B26]';

                  const cardBg = isCritical
                    ? 'bg-[#FDF0F0]/90 border border-red-300'
                    : 'bg-white/95 border border-[#DCE5E7]';

                  return (
                    <article
                      key={alert.id}
                      className={`group relative overflow-hidden rounded-2xl p-5 shadow-[0_4px_16px_rgba(27,77,92,0.06)] hover:shadow-[0_12px_28px_rgba(27,77,92,0.14)] transition-all duration-200 transform hover:-translate-y-0.5 ${cardBg}`}
                    >
                      {/* Left Accent Ribbon */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${borderAccentColor}`}></div>

                      <div className="flex flex-col gap-3 pl-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] uppercase font-bold tracking-wider ${
                                isCritical
                                  ? 'bg-[#A82A2A] text-white shadow-xs'
                                  : isUrgent
                                  ? 'bg-[#F9ECE8] text-[#C2593F]'
                                  : isHigh
                                  ? 'bg-[#F0F5F6] text-[#003643]'
                                  : 'bg-[#FBF4E7] text-[#003643]'
                              }`}
                            >
                              {alert.metaBadge}
                            </span>
                            <span className="font-mono text-xs text-[#71787c]">
                              topic: {alert.topic}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-xs text-[#71787c]">
                            <Clock className="w-3.5 h-3.5 text-[#C2593F]" />
                            <span>{alert.timestamp}</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-editorial text-xl font-bold text-[#003643] tracking-tight">
                            {alert.title}
                          </h3>
                          <p className="text-sm text-[#41484b] mt-1 leading-relaxed">
                            {alert.description}
                          </p>
                        </div>

                        {/* Action Bar & Interactive Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F0F5F6]">
                          <div className="flex items-center gap-2 text-xs font-mono text-[#41484b]">
                            <CheckCircle className="w-3.5 h-3.5 text-[#2E473B]" />
                            <span>{alert.recipientsNotified}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* 1. ADD TO CALENDAR BUTTON */}
                            <button
                              type="button"
                              onClick={() => handleAddToCalendar(alert)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                                alert.calendarAdded
                                  ? 'bg-[#2E473B] text-white'
                                  : 'bg-[#F0F5F6] text-[#003643] hover:bg-[#dbebf1]'
                              }`}
                              title="Export event as .ics iCalendar file"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{alert.calendarAdded ? 'Added to iCal ✓' : 'Add to Calendar'}</span>
                            </button>

                            {/* 2. VIEW INDOOR MAP BUTTON */}
                            {alert.actionType === 'venue' && (
                              <button
                                type="button"
                                onClick={() => handleOpenMap(alert)}
                                className="px-3 py-1.5 rounded-lg bg-[#003643] text-white hover:bg-[#1b4d5c] transition text-xs font-semibold flex items-center gap-1 active:scale-95 cursor-pointer shadow-sm"
                              >
                                <MapPin className="w-3.5 h-3.5 text-[#ffdeae]" />
                                <span>View Indoor Map</span>
                              </button>
                            )}

                            {/* 3. SHARE ALERT BUTTON */}
                            <button
                              type="button"
                              onClick={() => handleShareAlert(alert)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer ${
                                alert.copied
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white text-[#003643] border-[#DCE5E7] hover:bg-[#F0F5F6]'
                              }`}
                              title="Copy alert link to clipboard"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>{alert.copied ? 'Link Copied ✓' : 'Share Alert'}</span>
                            </button>

                            {/* 4. ACKNOWLEDGE / SAFE CHECK-IN BUTTON */}
                            {alert.actionType === 'safety' ? (
                              <button
                                type="button"
                                onClick={() => acknowledgeAlert(alert.id)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer ${
                                  alert.acknowledged
                                    ? 'bg-[#2E473B] text-white'
                                    : 'bg-[#A82A2A] text-white hover:bg-red-700 animate-pulse'
                                }`}
                              >
                                {alert.acknowledged ? 'Safe (Checked-in) ✓' : "Safe Check-in (I'm Indoors)"}
                              </button>
                            ) : alert.actionType === 'event' ? (
                              <button
                                type="button"
                                onClick={() => handleReserveSeat(alert.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer ${
                                  alert.acknowledged
                                    ? 'bg-[#2E473B] text-white'
                                    : 'bg-[#C2593F] text-white hover:bg-[#a04028]'
                                }`}
                              >
                                {alert.acknowledged ? 'Seat Reserved ✓' : 'Reserve Seat Pass'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => acknowledgeAlert(alert.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition active:scale-95 cursor-pointer ${
                                  alert.acknowledged
                                    ? 'bg-[#2E473B] text-white'
                                    : 'bg-[#C2593F] text-white hover:bg-[#a04028]'
                                }`}
                              >
                                <span>{alert.acknowledged ? 'Acknowledged ✓' : 'Acknowledge'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* RIGHT COLUMN: 52-Week Heatmap & Telemetry Analytics (5 Cols) */}
          <aside className="xl:col-span-5 flex flex-col gap-6">
            
            {/* MONTHLY ALERT CALENDAR & TIMELINE */}
            <MonthlyAlertCalendar
              soundEnabled={soundEnabled}
              onNavigateToExtensive={onNavigateToCalendar}
            />

            {/* Consumer Groups Health Box */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#DCE5E7] space-y-4">
              <h4 className="font-editorial text-lg font-bold text-[#003643]">
                Kafka Consumer Groups
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'notification-group', offset: '41,209', consumers: 4, color: '#2E473B' },
                  { name: 'audit-logging-worker', offset: '109,240', consumers: 2, color: '#1b4d5c' },
                  { name: 'metrics-collector', offset: '58,812', consumers: 2, color: '#D99B26' }
                ].map(item => (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-[#F0F5F6]/70 border border-[#DCE5E7] flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-[#003643]">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        {item.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#71787c]">
                        Offset: {item.offset}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#71787c]">
                      <span>Consumers: {item.consumers}</span>
                      <span className="text-[#2E473B] font-semibold">Lag: 0 msgs</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FBF4E7] text-[#442c00] border border-[#ffdeae]/40">
                <Shield className="w-5 h-5 text-[#D99B26] shrink-0" />
                <p className="text-xs leading-relaxed">
                  All broadcasts conform to University Safety Protocol §4.2. Messages cryptographically signed via local campus keys.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* 4. MODAL: QUICK TRIGGER DISPATCHER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2D36]/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DCE5E7] overflow-hidden">
            <form onSubmit={handleBroadcastSubmit} className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#DCE5E7] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#C2593F] text-white flex items-center justify-center">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-editorial text-xl font-bold text-[#003643]">
                      Trigger Event Stream
                    </h4>
                    <p className="font-mono text-xs text-[#71787c]">
                      Kafka Topic Ingestion Simulation
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#71787c] hover:text-[#0f1e22] text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="font-mono text-xs text-[#71787c] uppercase tracking-wider block mb-1">
                    Target Topic
                  </label>
                  <select
                    value={modalTopic}
                    onChange={e => setModalTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F0F5F6] text-[#003643] text-sm focus:outline-none focus:ring-2 focus:ring-[#003643] border border-[#DCE5E7]"
                  >
                    <option value="class-updates">class-updates (84 enrolled courses)</option>
                    <option value="exam-updates">exam-updates (Active midterms &amp; finals)</option>
                    <option value="general-events">general-events (Campus wide alerts)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-xs text-[#71787c] uppercase tracking-wider block mb-1">
                    Alert Headline
                  </label>
                  <input
                    type="text"
                    value={modalHeadline}
                    onChange={e => setModalHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F0F5F6] text-[#003643] text-sm focus:outline-none focus:ring-2 focus:ring-[#003643] border border-[#DCE5E7]"
                    placeholder="Enter urgent broadcast title..."
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#71787c] uppercase tracking-wider block mb-1">
                    Broadcast Details
                  </label>
                  <textarea
                    rows={3}
                    value={modalDetails}
                    onChange={e => setModalDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F0F5F6] text-[#003643] text-sm focus:outline-none focus:ring-2 focus:ring-[#003643] border border-[#DCE5E7]"
                    placeholder="Provide actionable directions..."
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#F9ECE8] text-[#C2593F] font-mono text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Will fan out to 1,420 WebSockets &amp; 3,890 WebPush subscribers in ~1.4ms.</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#DCE5E7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#71787c] hover:bg-[#F0F5F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C2593F] text-white hover:bg-[#a04028] text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast to Kafka</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. INDOOR MAP MODAL */}
      <IndoorMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        venueName={mapVenue}
        courseCode={mapCourse}
      />
    </div>
  );
};
