import React, { useState } from 'react';
import { ThreeHeroCanvas } from '../ThreeHeroCanvas';
import { playAlertChime } from '../../utils/sound';
import {
  Bell,
  CheckCircle,
  Calendar,
  MapPin,
  AlertTriangle,
  Send,
  Download,
  Info,
  Clock,
  Radio,
  Mail,
  Zap,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

interface LiveAlert {
  id: string;
  topic: 'exam-updates' | 'class-updates' | 'general-events' | 'campus-safety';
  priority: 'URGENT' | 'HIGH' | 'CRITICAL' | 'NORMAL';
  title: string;
  description: string;
  timestamp: string;
  recipientsNotified?: string;
  metaBadge: string;
  actionType: 'reschedule' | 'venue' | 'safety' | 'event';
  acknowledged?: boolean;
}

interface LiveStreamScreenProps {
  onOpenMarkdownModal: (fileId?: string) => void;
  soundEnabled: boolean;
}

export const LiveStreamScreen: React.FC<LiveStreamScreenProps> = ({
  onOpenMarkdownModal,
  soundEnabled
}) => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'classroom'>('all');
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
      actionType: 'reschedule'
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
      actionType: 'venue'
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
      actionType: 'safety'
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
      actionType: 'event'
    }
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTopic, setModalTopic] = useState<string>('class-updates');
  const [modalHeadline, setModalHeadline] = useState<string>('');
  const [modalDetails, setModalDetails] = useState<string>('');

  const openTriggerModal = (type: 'cancel' | 'venue' | 'flash') => {
    if (type === 'cancel') {
      setModalTopic('class-updates');
      setModalHeadline('MATH202: Multivariable Calculus Cancelled');
      setModalDetails('Session cancelled due to instructor conference transit delay. Recitation office hours will convene on Zoom.');
    } else if (type === 'venue') {
      setModalTopic('class-updates');
      setModalHeadline('PHIL101: Ethics Moved to Great Library Annex');
      setModalDetails('Room reallocation due to acoustics testing in Main Quad. Please arrive 5 minutes early.');
    } else {
      setModalTopic('general-events');
      setModalHeadline('CAMPUS ALERT: Sudden Hail Warning In Quadrangle');
      setModalDetails('Severe weather radar indicates marble-sized hail. Move all outdoor cohorts into nearby stone arcades.');
    }
    setIsModalOpen(true);
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
      description: modalDetails,
      timestamp: 'Just now • Fanout Latency: 0.9ms',
      recipientsNotified: '1,420 WebSockets & 3,890 WebPush Subscribers Delivered',
      actionType: 'safety'
    };

    setAlerts([newAlert, ...alerts]);
    setIsModalOpen(false);
  };

  const acknowledgeAlert = (id: string) => {
    if (soundEnabled) playAlertChime('success');
    setAlerts(
      alerts.map(a => (a.id === id ? { ...a, acknowledged: true } : a))
    );
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'urgent') return a.priority === 'URGENT' || a.priority === 'CRITICAL';
    if (filter === 'classroom') return a.topic === 'class-updates' || a.topic === 'exam-updates';
    return true;
  });

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO SECTION WITH 3D CANVAS & CHIAROSCURO LIGHTS */}
      <section className="relative w-full overflow-hidden bg-[#0E2D36] text-white shadow-xl min-h-[500px]">
        {/* 3D Three.js Interactive Mesh Layer */}
        <div className="absolute inset-0 w-full h-[540px] pointer-events-none opacity-85">
          <ThreeHeroCanvas height={540} />
        </div>

        {/* Ambient collegiate chiaroscuro glow rings */}
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
              <span className="font-mono text-xs text-[#8ebdce]">ARCH-OCT-2026-DISPATCH-V2</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#8ebdce]">Latency Target:</span>
              <span className="px-2 py-0.5 rounded bg-white/15 font-mono text-xs text-white font-semibold">
                1.4ms (p99)
              </span>
              <span className="px-2 py-0.5 rounded bg-[#2E473B] text-white font-mono text-xs font-semibold">
                ZERO PAID EXTERNAL APIs
              </span>
              <button
                onClick={() => onOpenMarkdownModal('01-live-stream-alerts.md')}
                className="ml-2 px-2.5 py-0.5 rounded bg-[#D99B26] hover:bg-[#c2881e] text-[#001f28] font-mono text-xs font-bold transition flex items-center gap-1"
                title="Download this screen's markdown documentation"
              >
                <Download className="w-3 h-3" />
                <span>Screen MD</span>
              </button>
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
              <p className="text-sm sm:text-base text-[#8ebdce] max-w-2xl leading-relaxed mt-1">
                Zero-latency multi-channel distribution fabric. Streaming time-sensitive academic disruptions, venue mutations, and safety advisories directly across Socket.IO, VAPID Web Push, and Nodemailer SMTP.
              </p>
            </div>

            {/* Quick Trigger Broadcast Console for Faculty / Dispatcher */}
            <div className="lg:col-span-4 flex flex-col gap-2 bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/15 shadow-2xl">
              <div className="flex items-center justify-between pb-1">
                <span className="font-mono text-xs uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#D99B26]" />
                  Simulate Broadcast Trigger
                </span>
                <span className="font-mono text-[11px] text-[#8ebdce]">Role: Faculty/CS</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => openTriggerModal('cancel')}
                  className="group flex flex-col items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-[#C2593F] transition-all text-center border border-white/5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#ffdeae] group-hover:text-white">
                    cancel_presentation
                  </span>
                  <span className="text-[11px] font-semibold mt-1 text-white">Cancel Class</span>
                </button>
                <button
                  onClick={() => openTriggerModal('venue')}
                  className="group flex flex-col items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-[#D99B26] transition-all text-center border border-white/5"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#ffdeae] group-hover:text-[#001f28]">
                    pin_drop
                  </span>
                  <span className="text-[11px] font-semibold mt-1 text-white group-hover:text-[#001f28]">
                    Shift Venue
                  </span>
                </button>
                <button
                  onClick={() => openTriggerModal('flash')}
                  className="group flex flex-col items-center justify-center p-2 rounded-lg bg-[#A82A2A]/80 hover:bg-[#A82A2A] transition-all text-center shadow-md border border-red-500/30"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] text-white">
                    emergency_share
                  </span>
                  <span className="text-[11px] font-bold mt-1 text-white">Flash Alert</span>
                </button>
              </div>
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
          {/* Socket.IO Metric Card */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white shadow-sm border border-[#DCE5E7]">
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

          {/* Web Push Metric Card */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white shadow-sm border border-[#DCE5E7]">
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

          {/* SMTP Metric Card */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white shadow-sm border border-[#DCE5E7]">
            <div className="w-12 h-12 rounded-lg bg-[#003643] text-[#ffdeae] flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-editorial text-lg text-[#003643] font-bold">4,102 Inboxes</span>
                <span className="font-mono text-[10px] text-[#003643] font-semibold bg-[#FBF4E7] px-2 py-0.5 rounded-full">
                  0 SMTP COST
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

              {/* Filter Pills */}
              <div className="flex items-center p-1 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] self-start">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filter === 'all'
                      ? 'bg-white text-[#003643] shadow-sm'
                      : 'text-[#41484b] hover:text-[#0f1e22]'
                  }`}
                >
                  All Streams
                </button>
                <button
                  onClick={() => setFilter('urgent')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filter === 'urgent'
                      ? 'bg-white text-[#003643] shadow-sm'
                      : 'text-[#41484b] hover:text-[#0f1e22]'
                  }`}
                >
                  Urgent (2)
                </button>
                <button
                  onClick={() => setFilter('classroom')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filter === 'classroom'
                      ? 'bg-white text-[#003643] shadow-sm'
                      : 'text-[#41484b] hover:text-[#0f1e22]'
                  }`}
                >
                  Classroom
                </button>
              </div>
            </div>

            {/* Notification Stream Cards Stack */}
            <div className="flex flex-col gap-4">
              {filteredAlerts.map(alert => {
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
                    className={`group relative overflow-hidden rounded-2xl p-5 shadow-[0_4px_16px_rgba(27,77,92,0.06)] hover:shadow-[0_8px_24px_rgba(27,77,92,0.12)] transition-all ${cardBg}`}
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
                            <span className="material-symbols-outlined text-[13px]">
                              {isCritical ? 'warning' : isUrgent ? 'alarm_on' : 'location_away'}
                            </span>
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

                      {/* Action Bar & Micro Stats */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F0F5F6]">
                        <div className="flex items-center gap-2 text-xs font-mono text-[#41484b]">
                          <CheckCircle className="w-3.5 h-3.5 text-[#2E473B]" />
                          <span>{alert.recipientsNotified}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {alert.actionType === 'reschedule' && (
                            <>
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-lg bg-[#F0F5F6] text-[#003643] hover:bg-[#dbebf1] transition text-xs font-semibold flex items-center gap-1.5"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Add to Calendar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => acknowledgeAlert(alert.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                                  alert.acknowledged
                                    ? 'bg-[#2E473B] text-white'
                                    : 'bg-[#C2593F] text-white hover:bg-[#a04028]'
                                }`}
                              >
                                <span>{alert.acknowledged ? 'Acknowledged ✓' : 'Acknowledge'}</span>
                              </button>
                            </>
                          )}
                          {alert.actionType === 'venue' && (
                            <>
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-lg bg-[#F0F5F6] text-[#003643] hover:bg-[#dbebf1] transition text-xs font-semibold flex items-center gap-1"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>View Indoor Map</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => acknowledgeAlert(alert.id)}
                                className="px-3 py-1.5 rounded-lg text-[#71787c] hover:bg-[#F0F5F6] text-xs"
                              >
                                {alert.acknowledged ? 'Dismissed ✓' : 'Dismiss'}
                              </button>
                            </>
                          )}
                          {alert.actionType === 'safety' && (
                            <>
                              <button
                                type="button"
                                className="px-3 py-1.5 rounded-lg bg-white text-[#A82A2A] border border-red-200 hover:bg-[#FDF0F0] text-xs font-bold flex items-center gap-1"
                              >
                                <span>Share Alert</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => acknowledgeAlert(alert.id)}
                                className="px-3 py-1.5 rounded-lg bg-[#A82A2A] text-white hover:bg-red-700 text-xs font-bold shadow-sm"
                              >
                                {alert.acknowledged ? 'Safe (Checked-in) ✓' : "Safe Check-in (I'm Indoors)"}
                              </button>
                            </>
                          )}
                          {alert.actionType === 'event' && (
                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-lg bg-[#F0F5F6] text-[#003643] hover:bg-[#dbebf1] text-xs font-semibold"
                            >
                              Reserve Seat Pass
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* RIGHT COLUMN: 52-Week Heatmap & Telemetry Analytics (5 Cols) */}
          <aside className="xl:col-span-5 flex flex-col gap-6">
            {/* GitHub-Style Heatmap Container */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(27,77,92,0.06)] border border-[#DCE5E7] flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#C2593F] font-bold">
                    Kafka Dispatch Consistency
                  </span>
                  <span className="font-mono text-xs text-[#71787c]">Year 2026 Telemetry</span>
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#003643]">
                  Broker Throughput &amp; Daily Alert Matrix
                </h3>
                <p className="text-xs text-[#41484b]">
                  52-week record of incident publications, venue shifts, and urgent academic notices.
                </p>
              </div>

              {/* Heatmap Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All Topics', 'class-updates', 'exam-updates', 'general-events'].map((chip, idx) => (
                  <button
                    key={chip}
                    type="button"
                    className={`px-2.5 py-1 rounded-full text-xs font-mono transition ${
                      idx === 0
                        ? 'bg-[#003643] text-white font-semibold'
                        : 'bg-[#F0F5F6] text-[#003643] hover:bg-[#dbebf1]'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Matrix Grid */}
              <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[440px] flex flex-col gap-1.5">
                  {/* Months Header */}
                  <div className="flex justify-between text-[10px] text-[#71787c] pl-6 pr-2 font-mono">
                    <span>Nov</span>
                    <span>Dec</span>
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                  </div>

                  {/* Days + Grid */}
                  <div className="flex items-start gap-1.5">
                    <div className="flex flex-col gap-[3px] text-[9px] text-[#71787c] font-mono w-4 pt-1">
                      <span>M</span>
                      <span className="opacity-0">T</span>
                      <span>W</span>
                      <span className="opacity-0">T</span>
                      <span>F</span>
                      <span className="opacity-0">S</span>
                      <span>S</span>
                    </div>

                    <div className="grid grid-flow-col grid-rows-7 gap-[3px] flex-grow">
                      {Array.from({ length: 364 }).map((_, idx) => {
                        let cellClass = 'bg-[#F0F5F6]';
                        if (idx % 17 === 0) cellClass = 'bg-[#C2593F]';
                        else if (idx % 11 === 0) cellClass = 'bg-[#D99B26]';
                        else if (idx % 5 === 0) cellClass = 'bg-[#1b4d5c]';
                        else if (idx % 3 === 0) cellClass = 'bg-[#1b4d5c]/40';
                        else if (idx % 2 === 0) cellClass = 'bg-[#1b4d5c]/20';

                        return (
                          <div
                            key={idx}
                            className={`w-2.5 h-2.5 rounded-[2px] transition-transform hover:scale-125 cursor-pointer ${cellClass}`}
                            title={`Day ${idx + 1}: Event Telemetry`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-[#71787c] pt-2 border-t border-[#F0F5F6]">
                <span>Zero Twilio / SendGrid Overhead</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F0F5F6]"></span>
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1b4d5c]/30"></span>
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#1b4d5c]"></span>
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#D99B26]"></span>
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#C2593F]"></span>
                  <span>More</span>
                </div>
              </div>

              {/* Bento Metric Boxes */}
              <div className="grid grid-cols-2 gap-2.5 mt-1">
                <div className="p-3 rounded-xl bg-[#F0F5F6] flex flex-col">
                  <span className="font-editorial text-2xl text-[#003643] font-bold">4,892</span>
                  <span className="text-xs text-[#71787c]">Alerts Dispatched (2026)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F0F5F6] flex flex-col">
                  <span className="font-editorial text-2xl text-[#2E473B] font-bold">99.98%</span>
                  <span className="text-xs text-[#71787c]">Delivery Success Rate</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F0F5F6] flex flex-col">
                  <span className="font-editorial text-2xl text-[#C2593F] font-bold">1.4ms</span>
                  <span className="text-xs text-[#71787c]">Avg Kafka Latency</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F0F5F6] flex flex-col">
                  <span className="font-editorial text-2xl text-[#D99B26] font-bold">$0.00</span>
                  <span className="text-xs text-[#71787c]">External API Cost</span>
                </div>
              </div>
            </div>

            {/* Topic Partitions Monitor */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(27,77,92,0.06)] border border-[#DCE5E7] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-editorial text-xl font-bold text-[#003643]">Kafka Topic Partitions</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F0F5F6] text-[#003643] font-mono text-xs font-semibold">
                  Active Broker 0
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  {
                    name: 'topic: class-updates',
                    offset: '41,209',
                    consumers: '8 In-Memory Listeners',
                    color: '#2E473B'
                  },
                  {
                    name: 'topic: exam-updates',
                    offset: '12,840',
                    consumers: 'Dedicated Push Dispatcher',
                    color: '#C2593F'
                  },
                  {
                    name: 'topic: general-events',
                    offset: '89,112',
                    consumers: 'SMTP Digest Worker',
                    color: '#D99B26'
                  }
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

              {/* Protocol Note */}
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
                  className="text-[#71787c] hover:text-[#0f1e22]"
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
                    <option value="exam-updates">exam-updates (Active midterms & finals)</option>
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
                    placeholder="Provide actionable student directions..."
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#F9ECE8] text-[#C2593F] font-mono text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
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
                  className="px-4 py-2 rounded-lg bg-[#C2593F] text-white hover:bg-[#a04028] text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast to Kafka</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
