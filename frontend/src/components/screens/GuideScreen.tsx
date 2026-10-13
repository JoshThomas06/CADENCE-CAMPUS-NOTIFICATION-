import React, { useState } from 'react';
import {
  BookOpen,
  Zap,
  Radio,
  Bell,
  Mail,
  Shield,
  Layers,
  Server,
  Terminal,
  Copy,
  Check,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  UserCheck,
  Smartphone,
  Cpu,
  Lock,
  AlertTriangle,
  Volume2,
  VolumeX,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { playAlertChime } from '../../utils/sound';

interface GuideScreenProps {
  soundEnabled?: boolean;
  onNavigateToLive?: () => void;
  onNavigateToDispatcher?: () => void;
  onSetRole?: (role: 'Student' | 'Faculty' | 'Admin') => void;
}

export const GuideScreen: React.FC<GuideScreenProps> = ({
  soundEnabled = true,
  onNavigateToLive,
  onNavigateToDispatcher,
  onSetRole,
}) => {
  const [copiedPayload, setCopiedPayload] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'overview' | 'zerocost' | 'glossary' | 'faculty' | 'admin' | 'student'>('all');
  const [isSirenSimulating, setIsSirenSimulating] = useState<boolean>(false);
  const [simulatedDevicesCount, setSimulatedDevicesCount] = useState<number>(4102);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(id);
    if (soundEnabled) playAlertChime('info');
    setTimeout(() => setCopiedPayload(null), 2000);
  };

  const sampleCloudEvent = {
    specversion: '1.0',
    id: 'evt-98471-a083ef',
    source: 'cadence://dispatch.service:4004',
    type: 'edu.cadence.class.VENUE_CHANGED',
    datacontenttype: 'application/json',
    time: '2026-10-14T10:42:18.421Z',
    traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
    data: {
      topic: 'class-updates',
      course_id: 'CS401',
      title: 'CS 401 Midterm Relocation to Hall C',
      priority: 'HIGH',
      previousVenue: 'Turing Amphitheater',
      assignedVenue: 'Babbage Hall C, Wing West',
      body: 'HVAC maintenance requires immediate lecture hall change. Bring personal portable workstations.',
      signatory: 'Dr. Julian Vance (Faculty)',
      estimatedRecipients: 199,
      zeroCostDispatch: true
    }
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      {/* 1. ATMOSPHERIC COLLEGIATE BANNER */}
      <header className="relative w-full rounded-3xl bg-[#0E2D36] text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-white/10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#D99B26]/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#C2593F]/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col max-w-4xl gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-[#ffdeae] font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#D99B26]" />
              Platform Guide &amp; Operational Manual
            </span>
            <span className="text-[#8ebdce] font-mono text-xs">•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#2E473B] text-white font-mono text-xs">
              System Architecture v4.2
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#C2593F]/30 text-[#ffb4a2] font-mono text-xs">
              Zero-Cost Self-Hosted Core
            </span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            How Cadence Campus Pulse Operates: Context, Data &amp; Execution
          </h1>

          <p className="text-base sm:text-lg text-[#dbebf1] leading-relaxed max-w-3xl">
            Everything you need to know about the Event-Driven Campus Notification Platform: our zero-cost multi-channel fanout model, Kafka streaming mechanics, CloudEvents taxonomy, and step-by-step dispatch walkthroughs for Faculty, Administrators, and Students.
          </p>

          {/* Quick Navigation Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Manuals' },
              { id: 'overview', label: '1. What is Cadence?' },
              { id: 'zerocost', label: '2. Zero-Cost Model ($0.00)' },
              { id: 'glossary', label: '3. Data & Terms Glossary' },
              { id: 'faculty', label: '4. How-To: Faculty Push' },
              { id: 'admin', label: '5. How-To: Admin Siren' },
              { id: 'student', label: '6. How-To: Student Hub' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (soundEnabled) playAlertChime('info');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#D99B26] text-[#001f28] shadow-md font-bold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. SECTION 1: WHAT IS CADENCE CAMPUS PULSE? */}
      {(activeTab === 'overview' || activeTab === 'all' as any) && (
        <section className="rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#DCE5E7]">
            <span className="w-10 h-10 rounded-xl bg-[#003643] text-white flex items-center justify-center font-editorial text-xl font-bold">
              01
            </span>
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#003643]">
                What is Cadence Campus Pulse?
              </h2>
              <span className="text-xs text-[#71787c] font-mono">
                The institutional rationale for event-driven asynchronous microservices
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm text-[#41484b] leading-relaxed">
            <div className="p-5 rounded-2xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-3">
              <span className="font-editorial text-lg font-bold text-[#003643]">
                The Problem It Solves
              </span>
              <p>
                Colleges and universities routinely suffer from fragmented, lag-prone communication. When a lecture hall experiences an HVAC outage, a professor falls ill, or an active severe lightning storm strikes, traditional institutional email blasts take <strong>15–45 minutes</strong> to reach inboxes—causing hundreds of students to congregate in closed facilities or hazardous outdoor quads.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-3">
              <span className="font-editorial text-lg font-bold text-[#003643]">
                Why Event-Driven Microservices?
              </span>
              <p>
                Instead of a monolithic database polling loop that buckles under concurrent traffic, Cadence uses an <strong>event-driven publish/subscribe architecture</strong> powered by Apache Kafka. When a faculty member or dean creates an alert, it is ingested in sub-millisecond time into a durable commit-log partition and immediately fanned out to thousands of recipients in parallel.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-3">
              <span className="font-editorial text-lg font-bold text-[#003643]">
                Role-Based Separation of Duties
              </span>
              <p>
                Cadence implements strict governance:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Students</strong>: Read-only live alert stream, iCal sync, indoor floorplans, and safety check-ins.</li>
                <li><strong>Faculty</strong>: Author, reschedule, and push course mutations to enrolled students.</li>
                <li><strong>Senate Admins</strong>: Complete authority over all topics, cluster watermarks, and campus-wide emergency flash sirens.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 3. SECTION 2: ZERO-COST ARCHITECTURE ECONOMICS */}
      {(activeTab === 'zerocost' || activeTab === 'all' as any) && (
        <section className="rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#DCE5E7]">
            <span className="w-10 h-10 rounded-xl bg-[#C2593F] text-white flex items-center justify-center font-editorial text-xl font-bold">
              02
            </span>
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#003643]">
                Zero-Cost Multi-Channel Architecture ($0.00 / Month)
              </h2>
              <span className="text-xs text-[#71787c] font-mono">
                How Cadence achieves enterprise scale without paid third-party cloud SaaS bills
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Channel 1 */}
            <div className="p-6 rounded-2xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#003643] text-white flex items-center justify-center">
                  <Radio className="w-5 h-5 text-[#ffdeae]" />
                </div>
                <span className="font-editorial text-xl font-bold text-[#003643]">
                  1. Duplex WebSockets (Socket.IO)
                </span>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  Powers instant in-app notification toasts and real-time feed updates. When an alert commits to Kafka, the Notification Engine dispatches it across room-bound socket connections in <strong>&lt;0.4ms</strong>.
                </p>
              </div>
              <div className="pt-3 border-t border-[#DCE5E7] flex items-center justify-between font-mono text-xs">
                <span className="text-[#71787c]">Replaces: Pusher ($199/mo)</span>
                <strong className="text-[#2E473B]">Cost: $0.00</strong>
              </div>
            </div>

            {/* Channel 2 */}
            <div className="p-6 rounded-2xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#C2593F] text-white flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <span className="font-editorial text-xl font-bold text-[#003643]">
                  2. Native Web Push (VAPID RFC 8291)
                </span>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  Uses the browser standard W3C Push API with voluntary application server identification (ECDSA P-256 keys). Dispatches to Windows, Mac, iOS, and Android system lock screens even with tabs closed.
                </p>
              </div>
              <div className="pt-3 border-t border-[#DCE5E7] flex items-center justify-between font-mono text-xs">
                <span className="text-[#71787c]">Replaces: Firebase FCM ($150/mo)</span>
                <strong className="text-[#2E473B]">Cost: $0.00</strong>
              </div>
            </div>

            {/* Channel 3 */}
            <div className="p-6 rounded-2xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#D99B26] text-[#001f28] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-editorial text-xl font-bold text-[#003643]">
                  3. Carrier Email-to-SMS Gateways
                </span>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  Uses institutional Nodemailer SMTP relays to forward urgent alerts directly to cellular devices via carrier email gateways (e.g. <code>txt.att.net</code>, <code>vtext.com</code>) without toll rates.
                </p>
              </div>
              <div className="pt-3 border-t border-[#DCE5E7] flex items-center justify-between font-mono text-xs">
                <span className="text-[#71787c]">Replaces: Twilio SMS ($450/mo)</span>
                <strong className="text-[#2E473B]">Cost: $0.00</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. SECTION 3: COMPLETE GLOSSARY OF TERMS & DATA FIELDS */}
      {(activeTab === 'glossary' || activeTab === 'all' as any) && (
        <section className="rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#DCE5E7]">
            <span className="w-10 h-10 rounded-xl bg-[#D99B26] text-[#001f28] flex items-center justify-center font-editorial text-xl font-bold">
              03
            </span>
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#003643]">
                Glossary of Core Concepts, Data Fields &amp; Metrics
              </h2>
              <span className="text-xs text-[#71787c] font-mono">
                Demystifying technical terms used throughout the Cadence interface
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                term: 'Apache Kafka Broker (:9092)',
                category: 'Infrastructure',
                desc: 'A horizontally scalable, partitioned commit-log system that stores ordered immutable records with millisecond durability.'
              },
              {
                term: 'Kafka Topics (class, exam, general)',
                category: 'Architecture',
                desc: 'Named streaming channels. Cadence partitions events into class-updates (lecture changes), exam-updates (reschedules), and general-events (safety alerts).'
              },
              {
                term: 'Partitions & High-Water Mark (HW)',
                category: 'Telemetry',
                desc: 'Each topic is split into multiple parallel buckets (e.g., Partition #0 for STEM courses, #1 for Humanities). The high-water mark represents the latest committed record replicated across all in-sync replicas (ISR).'
              },
              {
                term: 'Consumer Group Lag',
                category: 'Performance',
                desc: 'The difference between the latest offset published to Kafka and the offset currently processed by the notification engine worker. 0 msgs lag means real-time synchronicity.'
              },
              {
                term: 'CloudEvents v1.0.2',
                category: 'Data Protocol',
                desc: 'A Cloud Native Computing Foundation (CNCF) open standard for describing event data in common formats (JSON/Avro) with source, specversion, id, type, and timestamp.'
              },
              {
                term: 'VAPID (RFC 8291)',
                category: 'Security',
                desc: 'Voluntary Application Server Identification. A cryptographic signature protocol allowing application servers to send push notifications directly to browser push services without proprietary credentials.'
              },
              {
                term: 'Fanout Blast Radius',
                category: 'Operations',
                desc: 'The exact calculated audience of active subscribers (students, faculty, TAs) targeted by a course or campus-wide dispatch.'
              },
              {
                term: 'Snappy / Avro Compact Wire Format',
                category: 'Data Efficiency',
                desc: 'Binary compression schemas reducing message payloads down to ~342 bytes on the wire for maximum network throughput.'
              }
            ].map(item => (
              <div key={item.term} className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#003643]">{item.term}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#C2593F] font-mono text-[10px] font-semibold border border-[#DCE5E7]">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-[#41484b] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. SECTION 4: STEP-BY-STEP HOW-TO: PUSH ALERTS (FACULTY MANUAL) */}
      {(activeTab === 'faculty' || activeTab === 'all' as any) && (
        <section className="rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#DCE5E7]">
            <span className="w-10 h-10 rounded-xl bg-[#003643] text-white flex items-center justify-center font-editorial text-xl font-bold">
              04
            </span>
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#003643]">
                How to Push an Alert as Faculty (Step-by-Step)
              </h2>
              <span className="text-xs text-[#71787c] font-mono">
                Publishing class cancellations, laboratory shifts, and exam reschedule notices
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: '1',
                title: 'Open Event Dispatcher',
                desc: 'Click "Event Dispatcher" in the top navigation. Faculty accounts have permission to publish to class-updates and exam-updates.'
              },
              {
                step: '2',
                title: 'Target Topic & Course',
                desc: 'Select your Kafka Topic Target (e.g. class-updates), choose Event Specification (VENUE_CHANGED or CLASS_CANCELLED), and select your course cohort (e.g. CS401).'
              },
              {
                step: '3',
                title: 'Draft Notice Details',
                desc: 'Enter the headline, new venue coordinates (e.g. Olin Hall 3B), and descriptive body markdown. Review the estimated Fanout Blast Radius (e.g. 199 enrolled subscribers).'
              },
              {
                step: '4',
                title: 'Simulate & Broadcast',
                desc: 'Click "Simulate Dry Run" to verify schema validity with 0 errors. Then click "Broadcast to Kafka Broker (:9092)" to execute the 4-phase zero-drop pipeline.'
              }
            ].map(s => (
              <div key={s.step} className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#003643] text-white font-mono text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                  <span className="text-sm font-bold text-[#003643]">{s.title}</span>
                  <p className="text-xs text-[#41484b] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. SECTION 5: STEP-BY-STEP HOW-TO: EMERGENCY SIREN (ADMIN MANUAL) */}
      {(activeTab === 'admin' || activeTab === 'all' as any) && (
        <section className="rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#DCE5E7]">
            <span className="w-10 h-10 rounded-xl bg-[#A82A2A] text-white flex items-center justify-center font-editorial text-xl font-bold">
              05
            </span>
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#003643]">
                Campus Emergency Flash Protocols &amp; Admin Siren Manual
              </h2>
              <span className="text-xs text-[#71787c] font-mono">
                Life-safety directives, severe weather warnings, and campus-wide PA horn overrides
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FDF0F0] border border-red-200 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#A82A2A]" />
              <span className="font-editorial text-lg font-bold text-[#A82A2A]">
                CRITICAL_FLASH Priority Protocol (Senate By-Law 4.2)
              </span>
            </div>
            <p className="text-xs text-[#41484b] leading-relaxed">
              When an Administrator broadcasts on topic <code>general-events</code> with priority <code>CRITICAL_FLASH</code>, the event bypasses all subscriber mute preferences, sounds browser siren chimes, sends lockscreen push payloads with persistent vibration patterns, and activates all student safety check-in rosters across campus quads.
            </p>
          </div>

          {/* 4-Step Action Walkthrough */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '1',
                title: 'Escalate to SysAdmin',
                desc: 'Select "Dean Sterling (Senate SysAdmin)" in the top header role switcher to unlock university-wide override credentials.'
              },
              {
                step: '2',
                title: 'Set Topic: general-events',
                desc: 'Target the emergency general-events topic. Select "CRITICAL_FLASH" priority to activate high-decibel audio horns.'
              },
              {
                step: '3',
                title: 'Multi-Channel Blast Radius',
                desc: 'The engine fans out across all registered endpoints: 1,420 live WebSocket rooms, 3,890 Web Push service workers, and 4,102 SMS gateways.'
              },
              {
                step: '4',
                title: 'Monitor Safety Check-ins',
                desc: 'Students receive prompt to verify safety ("I Am Safe"). Senate dashboard updates headcount in real time with 0ms latency.'
              }
            ].map(s => (
              <div key={s.step} className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#A82A2A] text-white font-mono text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                  <span className="text-sm font-bold text-[#003643]">{s.title}</span>
                  <p className="text-xs text-[#41484b] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Live Siren Simulation Sandbox */}
          <div className="p-6 rounded-2xl bg-[#0a1d23] text-white border border-[#1b4d5c] flex flex-col gap-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#ff6b6b]" />
                <h4 className="font-editorial text-lg font-bold text-white">
                  Interactive Admin Siren Simulation &amp; Audio Test
                </h4>
              </div>
              <span className="text-xs font-mono text-[#ffb4a2]">
                Zero-Drop Kafka Tri-Fanout Verification
              </span>
            </div>

            <p className="text-xs text-[#dbebf1]/80 leading-relaxed">
              Test how the emergency siren sounds and visualizes in real time. Clicking the button below simulates an actual <code>CRITICAL_FLASH</code> dispatch across campus audio channels.
            </p>

            {isSirenSimulating ? (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg animate-ping">
                    🚨
                  </span>
                  <div>
                    <span className="font-editorial text-base font-bold text-white block">
                      EMERGENCY SIREN BROADCAST IN PROGRESS
                    </span>
                    <span className="text-xs font-mono text-red-200">
                      Dispatched to {simulatedDevicesCount.toLocaleString()} devices • Tri-Fanout Active
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (soundEnabled) playAlertChime('urgent');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-800 text-white text-xs font-mono font-bold hover:bg-red-700 transition active:scale-95 cursor-pointer"
                  >
                    Replay Siren Audio
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSirenSimulating(false);
                      if (soundEnabled) playAlertChime('info');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-mono font-semibold hover:bg-white/30 transition active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Simulation</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSirenSimulating(true);
                    if (soundEnabled) playAlertChime('urgent');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#A82A2A] text-white text-xs font-mono font-bold hover:bg-red-700 transition duration-200 active:scale-95 cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>⚡ Test Admin Siren Broadcast (Live Sound)</span>
                </button>
                <span className="text-xs font-mono text-[#8ebdce]">
                  Safe sandbox mode — does not trigger real alarms outside the browser
                </span>
              </div>
            )}

            {/* Direct Navigation to Live Consoles */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-[#8ebdce]">Perform in Production:</span>
              {onNavigateToLive && (
                <button
                  type="button"
                  onClick={() => {
                    if (onSetRole) onSetRole('Admin');
                    onNavigateToLive();
                    if (soundEnabled) playAlertChime('info');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#003643] text-white hover:bg-[#133945] text-xs font-mono font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-white/10"
                >
                  <span>Go to Live Alerts (Admin Mode)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onNavigateToDispatcher && (
                <button
                  type="button"
                  onClick={() => {
                    if (onSetRole) onSetRole('Admin');
                    onNavigateToDispatcher();
                    if (soundEnabled) playAlertChime('info');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#C2593F] text-white hover:bg-[#a04028] text-xs font-mono font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Open Event Dispatcher</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 7. SECTION 6: HOW-TO: STUDENT EXPERIENCE & SAFETY CHECK-IN */}
      {(activeTab === 'student' || activeTab === 'all' as any) && (
        <section className="rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#DCE5E7]">
            <span className="w-10 h-10 rounded-xl bg-[#2E473B] text-white flex items-center justify-center font-editorial text-xl font-bold">
              06
            </span>
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#003643]">
                Student Experience, Calendar Sync &amp; Safety Hub
              </h2>
              <span className="text-xs text-[#71787c] font-mono">
                How students consume alerts, export to calendars, inspect blueprints, and register safety
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#003643]">
                <Calendar className="w-5 h-5 text-[#C2593F]" />
                <span className="font-bold text-sm">Add to Calendar (.ics)</span>
              </div>
              <p className="text-xs text-[#41484b] leading-relaxed">
                Clicking "Add to Calendar" on any alert card automatically generates an RFC 5545 <code>.ics</code> file with alarm reminders for Google Calendar, Apple Calendar, and Outlook.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#003643]">
                <MapPin className="w-5 h-5 text-[#D99B26]" />
                <span className="font-bold text-sm">View Indoor Map</span>
              </div>
              <p className="text-xs text-[#41484b] leading-relaxed">
                Clicking "View Indoor Map" opens a high-precision campus architectural blueprint modal with level switchers (L1–L3) and beacon markers showing relocated classrooms.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#003643]">
                <Shield className="w-5 h-5 text-[#2E473B]" />
                <span className="font-bold text-sm">Life-Safety Check-in</span>
              </div>
              <p className="text-xs text-[#41484b] leading-relaxed">
                During severe weather flashes, students click "I Am Safe" to immediately register safety on the administrative emergency roster.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 8. INTERACTIVE CLOUDEVENTS SCHEMA SANDBOX */}
      <section className="rounded-2xl bg-[#0E2D36] text-white p-8 sm:p-10 border border-white/10 flex flex-col gap-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#D99B26]" />
              <h3 className="font-editorial text-2xl font-bold text-white">
                Live CloudEvents v1.0.2 Schema Sandbox
              </h3>
            </div>
            <p className="text-xs text-[#8ebdce] mt-1">
              Standardized CNCF payload structure emitted across the Kafka event fabric
            </p>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard(JSON.stringify(sampleCloudEvent, null, 2), 'schema')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white flex items-center gap-2 transition active:scale-95 cursor-pointer self-start sm:self-center"
          >
            {copiedPayload === 'schema' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedPayload === 'schema' ? 'Copied to Clipboard!' : 'Copy Schema JSON'}</span>
          </button>
        </div>

        <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-[#ffdeae] overflow-x-auto max-h-80 leading-relaxed">
          <pre>{JSON.stringify(sampleCloudEvent, null, 2)}</pre>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="rounded-2xl bg-white p-8 sm:p-10 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-3 border-b border-[#DCE5E7]">
          <HelpCircle className="w-6 h-6 text-[#003643]" />
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#003643]">
              Frequently Asked Questions (FAQ)
            </h2>
            <span className="text-xs text-[#71787c] font-mono">
              Operational details and local development runbook answers
            </span>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-[#DCE5E7]">
          {[
            {
              q: 'Can this platform run locally without Docker or Apache Kafka installed?',
              a: 'Yes! Cadence features an automatic in-memory mock broker and cluster fallback that boots out-of-the-box with pure Node.js. If Docker Desktop is available, you can also spin up true containerized Kafka via `docker compose up -d`.'
            },
            {
              q: 'Why are the dashboards different for Admin, Faculty, and Student?',
              a: 'Governance and security. Students only need to consume alerts, manage personal notification preferences, sync schedules to iCal, and check in during emergencies. Faculty are granted tools to author and mutate course-level notices. Senate Administrators hold master authority over emergency sirens and raw Kafka cluster partitions.'
            },
            {
              q: 'What format do the calendar invite downloads use?',
              a: 'All calendar exports use the RFC 5545 iCalendar standard (.ics), which is natively supported by Apple Calendar, Google Calendar, Microsoft Outlook, and mobile operating systems with embedded 15-minute alarms.'
            },
            {
              q: 'How does the Web Push notification system work with tabs closed?',
              a: 'Cadence registers a service worker adhering to W3C Push API standards. When a notification is published, the browser push service delivers the payload via system background wake without requiring active browser windows.'
            }
          ].map((item, i) => (
            <div key={i} className="py-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex items-center justify-between text-left font-editorial text-base sm:text-lg font-bold text-[#003643] hover:text-[#C2593F] transition cursor-pointer"
              >
                <span>{item.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-[#71787c]" /> : <ChevronDown className="w-4 h-4 text-[#71787c]" />}
              </button>
              {openFaq === i && (
                <p className="text-xs sm:text-sm text-[#41484b] leading-relaxed pl-2 border-l-2 border-[#D99B26]">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
