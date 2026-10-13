import React, { useState } from 'react';
import {
  Download,
  Bell,
  Smartphone,
  Laptop,
  Mail,
  MessageSquare,
  Shield,
  CheckCircle,
  X,
  Radio,
  Sliders,
  Check,
  Zap,
  Lock,
  Calendar,
  Volume2
} from 'lucide-react';
import { playAlertChime } from '../../utils/sound';

interface SubscribersScreenProps {
  onOpenMarkdownModal: (fileId?: string) => void;
  soundEnabled: boolean;
}

export const SubscribersScreen: React.FC<SubscribersScreenProps> = ({
  onOpenMarkdownModal,
  soundEnabled
}) => {
  const [activePersona, setActivePersona] = useState<'Student' | 'Faculty' | 'Admin'>('Student');
  const [inAppToggle, setInAppToggle] = useState<boolean>(true);
  const [webPushToggle, setWebPushToggle] = useState<boolean>(true);
  const [carrierNetwork, setCarrierNetwork] = useState<string>('AT&T');
  const [phoneNumber, setPhoneNumber] = useState<string>('617-555-0192');
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  // Course Checkboxes
  const [courses, setCourses] = useState({
    cs401: { cancel: true, venue: true, exams: true },
    arch310: { cancel: true, venue: true, workshops: false },
    math205: { shifts: true, problemSets: false },
  });

  // Protocols Toggles
  const [protocols, setProtocols] = useState({
    lectures: true,
    dining: false,
    library: true,
  });

  // Receipts State
  const [receipts, setReceipts] = useState([
    {
      id: 'audit-1',
      title: 'CS401 Lab Relocation Announcement',
      tag: 'VENUE_SHIFT',
      topic: '/cadence/course/cs401',
      body: 'Today’s 2:00 PM Distributed Systems lab moves from Turing Hall 104 to Ada Lovelace Computing Center Lab B due to HVAC maintenance.',
      channel: 'Push + Socket',
      time: 'Today, 1:44 PM',
      color: '#A82A2A',
      verified: false
    },
    {
      id: 'audit-2',
      title: 'ARCH310 Studio Critique Extension',
      tag: 'SYLLABUS_MEMO',
      topic: '/cadence/course/arch310',
      body: 'Dr. Lin has extended the deadline for the Palladian elevation blueprints until Thursday 11:59 PM. Desk critiques available tomorrow.',
      channel: 'Email Digest',
      time: 'Yesterday, 5:12 PM',
      color: '#2E473B',
      verified: true
    },
    {
      id: 'audit-3',
      title: 'Distinguished Keynote: Dr. Kenneth Nolan',
      tag: 'CAMPUS_EVENT',
      topic: '/cadence/events/keynote',
      body: 'Lecture on "Resilience & Asynchronous Mesh Topologies" in University Great Hall at 4:30 PM. Reception to follow.',
      channel: 'SMS Relay',
      time: '2 days ago, 10:15 AM',
      color: '#D99B26',
      verified: true
    },
    {
      id: 'audit-4',
      title: 'Advisory: North Quad Steam Pipe Inspection',
      tag: 'FACILITY_WORK',
      topic: '/cadence/facilities/quad',
      body: 'Pedestrian walkway near Founders Gate closed for scheduled thermal pipeline testing between 08:00 - 12:00.',
      channel: 'Chrome PWA',
      time: '3 days ago, 7:55 AM',
      color: '#C2593F',
      verified: true
    }
  ]);

  const triggerTestPush = () => {
    if (soundEnabled) playAlertChime('urgent');
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 4500);
  };

  const acknowledgeReceipt = (id: string) => {
    if (soundEnabled) playAlertChime('success');
    setReceipts(receipts.map(r => (r.id === id ? { ...r, verified: true } : r)));
  };

  const acknowledgeAll = () => {
    if (soundEnabled) playAlertChime('success');
    setReceipts(receipts.map(r => ({ ...r, verified: true })));
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. ATMOSPHERIC COLLEGIATE HEADER PANEL */}
      <div className="relative w-full overflow-hidden bg-[#0E2D36] text-white px-4 sm:px-6 lg:px-8 py-10 border-b border-[#1b4d5c]">
        {/* Subtle architectural texture background */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-luminosity bg-cover bg-center filter grayscale"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCBgdjRbdiJ7AMR0hk6FO0w1afWHXqYlJUPLc-WSGkaS_egN3SQUN1OETbpK7EqwvJZnKRN3HhxfQmMnVonIRlvy_c0MNJjBmEKyRZuQd-5e-2MePk77-WbLNm90Ia5XKWUfRCa70s7ppC9h4d_x35oFxWkEoKj5Q4hoKpjJ4CG8HZLvcRUoBLFuexa0imQAisZ-YnhGOHSVnCE5x2TEd9Vu1-ATjIRMCs3iVHx_IEiesxwbskkHutsuQ')`
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#D99B26]/20 text-[#ffdeae] font-mono text-xs uppercase tracking-wider">
                Subscriber Profile Node #884
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E473B]"></span>
              <span className="font-mono text-xs text-[#8ebdce]">Sync: VAPID v2.4 Active</span>
              <button
                onClick={() => onOpenMarkdownModal('04-subscribers-preferences.md')}
                className="ml-2 px-2.5 py-0.5 rounded bg-[#D99B26] hover:bg-[#c2881e] text-[#001f28] font-mono text-xs font-bold transition flex items-center gap-1"
                title="Download this screen's markdown documentation"
              >
                <Download className="w-3 h-3" />
                <span>Screen MD</span>
              </button>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight">
              Dispatch Subscriptions &amp; Telemetry Relay
            </h1>
            <p className="text-sm sm:text-base text-[#dbebf1] leading-relaxed">
              Tailor real-time campus socket events, web push tokens, and academic course advisories in accordance with Senate Safety Protocol 4.2.
            </p>
          </div>

          {/* Quick Telemetry Chips */}
          <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1b4d5c]/80 text-white">
              <Shield className="w-4 h-4 text-[#D99B26]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#8ebdce] uppercase font-mono leading-none">
                  Security Protocol
                </span>
                <span className="font-mono text-xs font-semibold">Tier-1 Guaranteed</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1b4d5c]/80 text-white">
              <Radio className="w-4 h-4 text-[#C2593F]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#8ebdce] uppercase font-mono leading-none">
                  Active Relays
                </span>
                <span className="font-mono text-xs font-semibold">3 Endpoints Up</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT LAYOUT GRID */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col gap-8">
        {/* 2.1 PERSONA IDENTITY & HARDWARE TOKENS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Persona Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-[#DCE5E7] flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-[#003643] flex items-center justify-center text-[#ffdeae] font-editorial text-2xl font-bold shadow-md">
                      ML
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2E473B] border-2 border-white"
                      title="Live Socket Connected"
                    ></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-editorial text-2xl font-bold text-[#003643] leading-tight">
                      Maya Lin
                    </span>
                    <span className="text-xs text-[#41484b]">Senior CS &amp; Studio Arts Joint Major</span>
                    <span className="font-mono text-xs text-[#C2593F]">UID: #0924-ALUM-2025</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#F9ECE8] text-[#C2593F] font-mono text-xs font-semibold">
                  STUDENT
                </span>
              </div>

              {/* Role Perspective Switcher */}
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#71787c] font-semibold">
                  Simulate Role Dispatch Perspective
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 bg-[#F0F5F6] rounded-xl border border-[#DCE5E7]">
                  {(['Student', 'Faculty', 'Admin'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setActivePersona(p);
                        if (soundEnabled) playAlertChime('info');
                      }}
                      className={`py-1.5 text-center rounded-lg text-xs font-semibold transition ${
                        activePersona === p
                          ? 'bg-white text-[#003643] shadow-sm'
                          : 'text-[#41484b] hover:text-[#003643]'
                      }`}
                    >
                      {p === 'Faculty' ? 'Dr. S. Lin' : p === 'Admin' ? 'Senate Ops' : 'Student'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-4 pt-3 flex items-center gap-2 bg-[#F0F5F6] rounded-xl p-3 border border-[#DCE5E7]">
              <span className="material-symbols-outlined text-[#003643] text-[20px]">school</span>
              <p className="text-xs text-[#41484b] italic leading-relaxed">
                "Enrolled under Turing Hall Cluster. Automatic subscription active for Spring 2025 Semester."
              </p>
            </div>
          </div>

          {/* Registered Hardware & Device Tokens (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-[#DCE5E7] flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#DCE5E7]">
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-[#003643]" />
                  <span className="font-editorial text-lg font-bold text-[#003643]">
                    Registered Dispatch Hardware &amp; Tokens
                  </span>
                </div>
                <span className="font-mono text-xs text-[#2E473B] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2E473B] animate-ping"></span> 3 / 3 Healthy
                </span>
              </div>

              {/* Hardware Token Rows */}
              <div className="flex flex-col gap-2">
                {/* Device 1 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7]">
                  <div className="flex items-center gap-3">
                    <Laptop className="w-5 h-5 text-[#003643]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#003643]">
                        Chrome PWA Desktop ServiceWorker
                      </span>
                      <span className="font-mono text-[11px] text-[#71787c]">
                        VAPID Endpoint: 89f4...3ca1 • Last Ping: 32s ago
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#2E473B]/10 text-[#2E473B] font-mono text-[11px] font-semibold">
                    Connected
                  </span>
                </div>

                {/* Device 2 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7]">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#003643]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#003643]">
                        Mobile iOS Web Push (Safari PWA)
                      </span>
                      <span className="font-mono text-[11px] text-[#71787c]">
                        Device: iPhone 15 Pro • Token: 4b12...ec99 • Battery Good
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#2E473B]/10 text-[#2E473B] font-mono text-[11px] font-semibold">
                    Listening
                  </span>
                </div>

                {/* Device 3 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7]">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#003643]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#003643]">
                        Institutional Exchange Relay
                      </span>
                      <span className="font-mono text-[11px] text-[#71787c]">
                        elin@campus.edu • DKIM/DMARC Senate Authenticated
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#D99B26]/15 text-[#D99B26] font-mono text-[11px] font-semibold">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs font-mono text-[#71787c]">
              <span>Key Pair Fingerprint: 0x9AF8...B10E (ECDSA SHA-256)</span>
              <button
                type="button"
                onClick={() => alert('New WebAuthn Device Registration Flow Opened.')}
                className="text-[#003643] hover:underline font-bold"
              >
                + Register New Device
              </button>
            </div>
          </div>
        </div>

        {/* 2.2 MULTI-CHANNEL DELIVERY TOGGLE BOARD */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DCE5E7] flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[#DCE5E7]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#C2593F]" />
                <span className="font-editorial text-2xl font-bold text-[#003643]">
                  Multi-Channel Delivery Channels
                </span>
              </div>
              <span className="text-xs text-[#71787c]">
                Determine how downstream telemetry events transition across WebSockets, Service Workers, SMTP digests, and cellular gateways.
              </span>
            </div>

            {/* Test Notification Trigger */}
            <button
              type="button"
              onClick={triggerTestPush}
              className="px-4 py-2 rounded-xl bg-[#003643] hover:bg-[#0E2D36] text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Zap className="w-4 h-4 text-[#D99B26]" />
              <span>Test Push Notification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Channel A: In-App Sockets */}
            <div className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-white text-[#003643] shadow-xs">
                    <Radio className="w-5 h-5" />
                  </span>
                  <input
                    type="checkbox"
                    checked={inAppToggle}
                    onChange={() => setInAppToggle(!inAppToggle)}
                    className="w-5 h-5 rounded text-[#003643] accent-[#003643] cursor-pointer"
                  />
                </div>
                <span className="font-editorial text-lg font-bold text-[#003643]">
                  In-App Floating Toasts
                </span>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  Socket.IO duplex connection. Translucent capsule cards pop dynamically while using the browser tab.
                </p>
              </div>
              <span className="font-mono text-xs text-[#2E473B] font-semibold">
                • Realtime latency: &lt;14ms
              </span>
            </div>

            {/* Channel B: Web Push */}
            <div className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-white text-[#C2593F] shadow-xs">
                    <Bell className="w-5 h-5" />
                  </span>
                  <input
                    type="checkbox"
                    checked={webPushToggle}
                    onChange={() => setWebPushToggle(!webPushToggle)}
                    className="w-5 h-5 rounded text-[#003643] accent-[#003643] cursor-pointer"
                  />
                </div>
                <span className="font-editorial text-lg font-bold text-[#003643]">
                  OS-Level Web Push
                </span>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  VAPID standard background wake. Dispatches directly to Mac, Windows, iOS, and Android system lockscreens.
                </p>
              </div>
              <span className="font-mono text-xs text-[#C2593F] font-semibold">
                • Background wake enabled
              </span>
            </div>

            {/* Channel C: Nodemailer */}
            <div className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-white text-[#D99B26] shadow-xs">
                    <Mail className="w-5 h-5" />
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#D99B26]/20 text-[#D99B26] font-mono text-[10px] font-semibold">
                    DIGEST
                  </span>
                </div>
                <span className="font-editorial text-lg font-bold text-[#003643]">
                  Nodemailer Dispatch
                </span>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  HTML responsive newsletter summaries directly to elin@campus.edu.
                </p>
              </div>
              <select className="w-full bg-white text-[#003643] font-mono text-xs rounded-lg p-2 border border-[#DCE5E7] outline-none">
                <option value="daily">Daily Senate Digest (6:00 PM)</option>
                <option value="immediate">Immediate for Urgent</option>
                <option value="weekly">Weekly Rollup</option>
              </select>
            </div>

            {/* Channel D: Carrier SMS */}
            <div className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-lg bg-white text-[#003643] shadow-xs">
                    <MessageSquare className="w-5 h-5" />
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#e1f0f7] text-[#003643] font-mono text-[10px] font-semibold">
                    FREE RELAY
                  </span>
                </div>
                <span className="font-editorial text-lg font-bold text-[#003643]">
                  Carrier SMS Bridge
                </span>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  Direct cell relay via telco carrier email gateway without premium SMS tolls.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <div className="flex gap-1">
                  <select
                    value={carrierNetwork}
                    onChange={e => setCarrierNetwork(e.target.value)}
                    className="w-1/2 bg-white text-[#003643] rounded-lg p-1.5 border border-[#DCE5E7]"
                  >
                    <option value="AT&T">AT&amp;T</option>
                    <option value="Verizon">Verizon</option>
                    <option value="T-Mobile">T-Mobile</option>
                  </select>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-1/2 bg-white text-[#003643] rounded-lg px-2 py-1.5 border border-[#DCE5E7]"
                  />
                </div>
                <span className="text-[10px] text-[#71787c]">
                  Relay: 6175550192@{carrierNetwork === 'AT&T' ? 'txt.att.net' : 'vtext.com'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2.3 GRANULAR TOPIC & COURSE SUBSCRIPTION MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Enrolled Courses (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DCE5E7] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DCE5E7]">
              <div>
                <h3 className="font-editorial text-xl font-bold text-[#003643]">
                  Enrolled Course Alert Streams
                </h3>
                <span className="text-xs text-[#71787c]">
                  Granular filtering for class relocations, professor notices, and midterm reschedule events.
                </span>
              </div>
              <span className="font-mono text-xs text-[#003643] font-semibold px-2.5 py-1 rounded-full bg-[#F0F5F6] border border-[#DCE5E7]">
                Spring 2025
              </span>
            </div>

            {/* Course 1: CS401 */}
            <div className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#003643] text-white flex items-center justify-center font-mono text-xs font-bold">
                    CS
                  </span>
                  <div>
                    <span className="text-sm font-bold text-[#003643]">CS401: Distributed Systems</span>
                    <span className="text-xs text-[#71787c] block">Prof. K. Sterling • Mon/Wed 10:00 AM • Lovelace Hall 302</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#2E473B]/10 text-[#2E473B] font-mono text-[10px] font-semibold">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#DCE5E7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courses.cs401.cancel}
                    onChange={() =>
                      setCourses({
                        ...courses,
                        cs401: { ...courses.cs401, cancel: !courses.cs401.cancel }
                      })
                    }
                    className="rounded accent-[#003643]"
                  />
                  <span className="text-xs font-semibold text-[#003643]">Cancellations</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#DCE5E7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courses.cs401.venue}
                    onChange={() =>
                      setCourses({
                        ...courses,
                        cs401: { ...courses.cs401, venue: !courses.cs401.venue }
                      })
                    }
                    className="rounded accent-[#003643]"
                  />
                  <span className="text-xs font-semibold text-[#003643]">Venue Shifts</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#DCE5E7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courses.cs401.exams}
                    onChange={() =>
                      setCourses({
                        ...courses,
                        cs401: { ...courses.cs401, exams: !courses.cs401.exams }
                      })
                    }
                    className="rounded accent-[#003643]"
                  />
                  <span className="text-xs font-semibold text-[#003643]">Exam Updates</span>
                </label>
              </div>
            </div>

            {/* Course 2: ARCH310 */}
            <div className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#C2593F] text-white flex items-center justify-center font-mono text-xs font-bold">
                    AR
                  </span>
                  <div>
                    <span className="text-sm font-bold text-[#003643]">ARCH310: Classical Architecture Studio</span>
                    <span className="text-xs text-[#71787c] block">Dr. Sarah Lin • Tue/Thu 1:30 PM • Ruskin Atelier Tower</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#2E473B]/10 text-[#2E473B] font-mono text-[10px] font-semibold">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#DCE5E7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courses.arch310.cancel}
                    onChange={() =>
                      setCourses({
                        ...courses,
                        arch310: { ...courses.arch310, cancel: !courses.arch310.cancel }
                      })
                    }
                    className="rounded accent-[#003643]"
                  />
                  <span className="text-xs font-semibold text-[#003643]">Cancellations</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#DCE5E7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courses.arch310.venue}
                    onChange={() =>
                      setCourses({
                        ...courses,
                        arch310: { ...courses.arch310, venue: !courses.arch310.venue }
                      })
                    }
                    className="rounded accent-[#003643]"
                  />
                  <span className="text-xs font-semibold text-[#003643]">Studio Relocations</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#DCE5E7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courses.arch310.workshops}
                    onChange={() =>
                      setCourses({
                        ...courses,
                        arch310: { ...courses.arch310, workshops: !courses.arch310.workshops }
                      })
                    }
                    className="rounded accent-[#003643]"
                  />
                  <span className="text-xs text-[#71787c]">Opt. Workshops</span>
                </label>
              </div>
            </div>
          </div>

          {/* Campus-Wide Protocols (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DCE5E7] flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#DCE5E7]">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-[#003643]">
                    Campus-Wide Protocols
                  </h3>
                  <span className="text-xs text-[#71787c]">
                    Centralised safety infrastructure mandated by academic council.
                  </span>
                </div>
              </div>

              {/* Mandatory Weather Card */}
              <div className="p-4 rounded-xl bg-[#F9ECE8]/70 border border-[#ffdad2] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#C2593F]" />
                    <span className="text-xs font-bold text-[#003643]">Severe Weather &amp; Safety</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#C2593F]/15 text-[#C2593F] font-mono text-[10px] font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> MANDATORY
                  </span>
                </div>
                <p className="text-xs text-[#41484b] leading-relaxed">
                  Tornado alerts, civil shelter orders, hazardous condition halts. Cannot be muted or delayed per Senate By-Law 4.2.
                </p>
              </div>

              {/* Protocol Toggles */}
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#003643]">
                      Distinguished Lectures &amp; Symposia
                    </span>
                    <span className="text-[11px] text-[#71787c]">Deans’ keynotes and gallery openings</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={protocols.lectures}
                    onChange={() => setProtocols({ ...protocols, lectures: !protocols.lectures })}
                    className="w-4 h-4 accent-[#003643] cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#003643]">
                      Dining &amp; Commons Closures
                    </span>
                    <span className="text-[11px] text-[#71787c]">Commons refectory maintenance updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={protocols.dining}
                    onChange={() => setProtocols({ ...protocols, dining: !protocols.dining })}
                    className="w-4 h-4 accent-[#003643] cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#003643]">
                      Library Reservations &amp; Pod Access
                    </span>
                    <span className="text-[11px] text-[#71787c]">Carrel expirations &amp; quiet zone advisories</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={protocols.library}
                    onChange={() => setProtocols({ ...protocols, library: !protocols.library })}
                    className="w-4 h-4 accent-[#003643] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#2E473B]">
              <CheckCircle className="w-4 h-4" />
              <span>Audited against Spring 2025 Registry Standard</span>
            </div>
          </div>
        </div>

        {/* 2.4 PERSONAL RECEIPT AUDIT TRAIL */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#DCE5E7] flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-[#DCE5E7]">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#003643]">
                Personal Receipt Audit Trail
              </h3>
              <p className="text-xs text-[#71787c]">
                Immutable log of recent telemetry dispatches received by your registered device tokens.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const csv = 'title,channel,time,status\n' + receipts.map(r => `${r.title},${r.channel},${r.time},${r.verified ? 'Verified' : 'Pending'}`).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'maya-lin-dispatch-receipts.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#F0F5F6] hover:bg-[#dbebf1] text-[#003643] text-xs font-mono font-semibold transition border border-[#DCE5E7]"
              >
                Export Cryptographic Log (.csv)
              </button>
              <button
                type="button"
                onClick={acknowledgeAll}
                className="px-3 py-1.5 rounded-xl bg-[#2E473B]/10 hover:bg-[#2E473B]/20 text-[#2E473B] text-xs font-mono font-semibold transition"
              >
                Acknowledge All Unread
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {receipts.map(r => (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: r.color }}
                  ></div>
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#003643]">{r.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-[#C2593F] font-mono text-[10px] border border-[#DCE5E7]">
                        {r.tag}
                      </span>
                      <span className="font-mono text-[11px] text-[#71787c]">Topic: {r.topic}</span>
                    </div>
                    <p className="text-xs text-[#41484b] mt-1">{r.body}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="flex flex-col items-end text-xs font-mono">
                    <span className="font-semibold text-[#003643]">{r.channel}</span>
                    <span className="text-[#71787c]">{r.time}</span>
                  </div>
                  {r.verified ? (
                    <span className="px-3 py-1 rounded-lg bg-[#2E473B]/10 text-[#2E473B] text-xs font-mono font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => acknowledgeReceipt(r.id)}
                      className="px-3 py-1 rounded-lg bg-[#003643] text-white hover:bg-[#0E2D36] text-xs font-semibold transition"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FLOATING VISIONOS TOAST SIMULATOR */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-500 max-w-md w-full">
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border-l-4 border-[#C2593F] border border-[#DCE5E7] flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#F9ECE8] text-[#C2593F] shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#C2593F] font-bold uppercase tracking-wider">
                  VAPID Push Test • Just Now
                </span>
                <button
                  type="button"
                  onClick={() => setToastVisible(false)}
                  className="text-[#71787c] hover:text-[#0f1e22]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <span className="font-editorial text-base font-bold text-[#003643] mt-0.5">
                Signal Delivery Verified
              </span>
              <p className="text-xs text-[#41484b] mt-1">
                Endpoint test relayed to your Chrome PWA socket. Latency: 12ms. All subscriber permissions intact!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
