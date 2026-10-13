import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  RefreshCw,
  Server,
  Zap,
  TrendingDown,
  Terminal,
  Activity,
  Layers,
  Database,
  Radio,
  Bell,
  Mail,
  ExternalLink
} from 'lucide-react';
import { playAlertChime } from '../../utils/sound';

interface KafkaTelemetryScreenProps {
  soundEnabled: boolean;
}

const EVENTS_DATA = [
  {
    topic: 'exam-updates',
    severity: 'CRITICAL',
    partition: 0,
    offset: 4456,
    time: '2025-10-14T10:42:18.421Z',
    id: 'evt_98471-a083ef',
    source: 'urn:campus:dispatch:exam-office',
    type: 'edu.campus.exam.relocation',
    courseCode: 'CS 401',
    title: 'CS 401 Midterm Relocation to Hall C',
    prev: 'Turing Amphitheater',
    assigned: 'Babbage Hall C, Wing West',
    summary: 'HVAC malfunction in Turing Amphitheater requires prompt venue change.',
    recipients: 184
  },
  {
    topic: 'class-updates',
    severity: 'URGENT',
    partition: 1,
    offset: 6201,
    time: '2025-10-14T10:39:04.102Z',
    id: 'evt_98468-b712fa',
    source: 'urn:campus:dispatch:registrar',
    type: 'edu.campus.class.format-change',
    courseCode: 'MATH 312',
    title: 'MATH 312: Class Shifted to Remote Hybrid',
    prev: 'Euclid 204',
    assigned: 'Synchronous Remote (Stream Room #892)',
    summary: 'Prof. Aristhor confirmed synchronous stream link generated for zoom #892.',
    recipients: 240
  },
  {
    topic: 'general-events',
    severity: 'INFO',
    partition: 2,
    offset: 8550,
    time: '2025-10-14T10:31:55.890Z',
    id: 'evt_98462-cc9011',
    source: 'urn:campus:facilities:microgrid',
    type: 'edu.campus.facility.calibration',
    courseCode: 'CAMPUS-GEN',
    title: 'North Quad Solar Array Calibration Run',
    prev: 'Routine Grid Balance',
    assigned: 'Battery Storage Vault 2',
    summary: 'Routine green energy microgrid balancing routine will conclude at 11:30 AM.',
    recipients: 1420
  },
  {
    topic: 'class-updates',
    severity: 'INFO',
    partition: 0,
    offset: 6124,
    time: '2025-10-14T10:25:12.610Z',
    id: 'evt_98459-df4402',
    source: 'urn:campus:dispatch:physics-dept',
    type: 'edu.campus.class.lab-reservation',
    courseCode: 'PHYS 204',
    title: 'PHYS 204: Lab Apparatus Reserved',
    prev: 'Curie Hall Lab B',
    assigned: 'Optical Bench 4',
    summary: 'Optics bench 4 available for afternoon undergraduate research session.',
    recipients: 42
  }
];

export const KafkaTelemetryScreen: React.FC<KafkaTelemetryScreenProps> = ({
  soundEnabled
}) => {
  const [eventsList, setEventsList] = useState(EVENTS_DATA);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [syntaxColors, setSyntaxColors] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncedCount, setSyncedCount] = useState<number>(0);

  const selectedEvent = eventsList[selectedIndex] || eventsList[0] || EVENTS_DATA[0];

  const handleCopyJson = () => {
    const payload = {
      specversion: '1.0',
      id: selectedEvent.id,
      source: selectedEvent.source,
      type: selectedEvent.type,
      traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
      time: selectedEvent.time,
      datacontenttype: 'application/json',
      data: {
        courseCode: selectedEvent.courseCode,
        title: selectedEvent.title,
        previousVenue: selectedEvent.prev,
        assignedVenue: selectedEvent.assigned,
        priority: selectedEvent.severity,
        channels: [
          `socket.io:room:${selectedEvent.courseCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          `vapid:tag:${selectedEvent.severity.toLowerCase()}-alert`,
          `smtp:${selectedEvent.courseCode.toLowerCase().replace(/[^a-z0-9]/g, '')}-enrolled@campus.edu`
        ],
        estimatedRecipients: selectedEvent.recipients,
        zeroCostDispatch: true
      }
    };

    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    if (soundEnabled) playAlertChime('info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncOffsets = () => {
    setIsSyncing(true);
    if (soundEnabled) playAlertChime('info');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncedCount(prev => prev + 1);
    }, 800);
  };

  const handleProduceBurst = () => {
    const topics = ['class-updates', 'exam-updates', 'general-events'];
    const severities = ['CRITICAL', 'URGENT', 'INFO'];
    const courses = ['CS 401', 'ARCH 310', 'ENG 202', 'MATH 312', 'PHYS 204'];
    const titles = [
      'Distributed Systems Studio Re-route',
      'Architectural Review Session Shifted',
      'Fluid Dynamics Problem Set Review Relocated',
      'High-Priority Campus PA Siren Test Scheduled',
      'Solar Microgrid Storage Rebalancing Concluded'
    ];

    const pickTopic = topics[Math.floor(Math.random() * topics.length)];
    const pickSev = severities[Math.floor(Math.random() * severities.length)];
    const pickCourse = courses[Math.floor(Math.random() * courses.length)];
    const pickTitle = titles[Math.floor(Math.random() * titles.length)];

    const newEvt = {
      topic: pickTopic,
      severity: pickSev,
      partition: Math.floor(Math.random() * 3),
      offset: 8550 + eventsList.length * 17,
      time: new Date().toISOString(),
      id: `evt_${Math.floor(10000 + Math.random() * 90000)}-${Math.random().toString(16).substring(2, 8)}`,
      source: 'urn:campus:dispatch:sensor-cluster',
      type: `edu.campus.${pickTopic.split('-')[0]}.broadcast`,
      courseCode: pickCourse,
      title: `${pickCourse}: ${pickTitle}`,
      prev: 'Primary Quad Forum',
      assigned: 'Design Atelier #3',
      summary: 'Dynamic real-time event packet generated and routed through zero-cost fanout pipeline.',
      recipients: Math.floor(80 + Math.random() * 450)
    };

    setEventsList([newEvt, ...eventsList]);
    setSelectedIndex(0);
    if (soundEnabled) playAlertChime(pickSev === 'CRITICAL' ? 'urgent' : 'success');
  };

  const filteredEvents = eventsList.filter(evt => {
    const matchTopic = filterTopic === 'all' || evt.topic === filterTopic;
    const matchSeverity = filterSeverity === 'all' || evt.severity === filterSeverity;
    return matchTopic && matchSeverity;
  });

  return (
    <div className="w-full flex flex-col max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      {/* 1. TOP ARCHITECTURE & ZERO-COST MISSION BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0E2D36] text-white p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute -right-16 -bottom-20 w-96 h-96 rounded-full bg-[#1b4d5c]/40 blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-[#D99B26]/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#1b4d5c] font-mono text-xs text-[#ffdeae] font-semibold uppercase tracking-wider">
                Kafka Telemetry Core
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#2E473B]/80 text-white font-mono text-xs">
                Cluster ID: lk-inst-oxford-01
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#C2593F]/25 text-[#ffb4a2] font-mono text-xs">
                Broker v3.6.0 (KRaft / ZK Bridge)
              </span>
              
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl text-white font-bold tracking-tight mt-1">
              Institutional Event Streaming &amp; Multi-Channel Zero-Cost Dispatch
            </h1>
            <p className="text-sm sm:text-base text-[#8ebdce] leading-relaxed">
              High-throughput partition fabrics feeding low-latency campus sockets, sovereign Web Push PWA workers, and self-hosted SMTP pipelines with deterministic zero message drop.
            </p>
          </div>

          {/* Zero-Cost Cost Metric Vignette */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch gap-3 w-full lg:w-auto">
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 flex flex-col gap-1 min-w-[210px] border border-white/15">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#8ebdce] uppercase tracking-wider">
                  Cloud SaaS Deficit
                </span>
                <TrendingDown className="w-4 h-4 text-[#C2593F]" />
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-editorial text-2xl text-[#ffdeae] font-bold">$0.00</span>
                <span className="font-mono text-xs text-[#8ebdce]">/ billing cycle</span>
              </div>
              <span className="font-mono text-[11px] text-[#ffdeae]/90">
                Saved vs Twilio &amp; SendGrid: $450/mo
              </span>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 flex flex-col gap-1 min-w-[210px] border border-white/15">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#8ebdce] uppercase tracking-wider">
                  Cluster Lag Delta
                </span>
                <div className="w-2 h-2 rounded-full bg-[#D99B26] animate-ping"></div>
              </div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-editorial text-2xl text-white font-bold">0 msgs</span>
                <span className="font-mono text-xs text-[#2E473B] font-bold">real-time sync</span>
              </div>
              <span className="font-mono text-[11px] text-[#8ebdce]">
                High-water mark offset verified
              </span>
            </div>
          </div>
        </div>

        {/* Infrastructure Pills Row */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 bg-black/20 rounded-xl p-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-[#2E473B]"></span>
              <span className="text-white font-semibold">Zookeeper :2181</span>
              <span className="text-[#8ebdce] text-[10px]">QUORUM OK</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-[#2E473B]"></span>
              <span className="text-white font-semibold">Kafka Broker :9092</span>
              <span className="text-[#8ebdce] text-[10px]">TCP OPEN</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-[#2E473B]"></span>
              <span className="text-white font-semibold">PostgreSQL :5432</span>
              <span className="text-[#8ebdce] text-[10px]">LIVE DATA STORE</span>
            </div>
            <a
              href="http://localhost:8080/?pgsql=postgres&username=campus_user&db=campus_db"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition shadow-sm cursor-pointer"
              title="Open Adminer live PostgreSQL table inspector (:8080)"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Live DB Explorer (Adminer :8080)</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#ffdeae]/20 text-[#ffdeae] font-mono text-[11px] font-semibold">
              100% Free / Self-Hosted
            </span>
            <span className="px-2 py-0.5 rounded bg-[#C2593F]/30 text-[#ffdad2] font-mono text-[11px] font-semibold">
              Zero Twilio/Firebase
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px]">
              KafkaJS Fallback: Armed
            </span>
          </div>
        </div>
      </section>

      {/* 2. SECTION 1: MULTI-CHANNEL TELEMETRY CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Socket.IO Engine */}
        <div className="rounded-2xl bg-white shadow-sm p-6 flex flex-col justify-between border border-[#DCE5E7] hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#e1f0f7] flex items-center justify-center text-[#003643]">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#003643]">Socket.IO In-App Engine</h3>
                  <span className="font-mono text-xs text-[#71787c]">campus-pulse.ws.internal</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#dbebf1] text-[#003643] font-mono text-xs font-semibold">
                0.4ms lat
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4 py-3 bg-[#F0F5F6] rounded-xl px-4 border border-[#DCE5E7]">
              <div>
                <span className="font-mono text-[11px] text-[#71787c] uppercase tracking-wider block">Live Clients</span>
                <span className="font-editorial text-2xl font-bold text-[#003643]">1,420</span>
                <span className="font-mono text-[11px] text-[#2E473B] block mt-0.5">Active WSS Rooms</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#71787c] uppercase tracking-wider block">Throughput</span>
                <span className="font-editorial text-2xl font-bold text-[#C2593F]">12.4k</span>
                <span className="font-mono text-[11px] text-[#71787c] block mt-0.5">msgs / minute</span>
              </div>
            </div>

            {/* Sparkline */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#71787c]">Throughput Envelope (Last 60s)</span>
                <span className="text-[#003643] font-semibold">Peak 230 msg/s</span>
              </div>
              <svg className="w-full h-12 text-[#1b4d5c]" fill="none" preserveAspectRatio="none" viewBox="0 0 300 48">
                <path d="M0 38 Q 20 30, 45 34 T 90 20 T 135 28 T 180 8 T 225 18 T 270 12 L 300 15 L 300 48 L 0 48 Z" fill="currentColor" fillOpacity="0.12"></path>
                <path d="M0 38 Q 20 30, 45 34 T 90 20 T 135 28 T 180 8 T 225 18 T 270 12 L 300 15" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2"></path>
                <circle cx="270" cy="12" fill="#D99B26" r="3.5"></circle>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs font-mono bg-[#F0F5F6] rounded-lg p-2.5 border border-[#DCE5E7]">
            <span className="text-[#71787c]">Protocols: WSS / Polling Fallback</span>
            <span className="font-semibold text-[#003643]">TCP Keepalive: 25s</span>
          </div>
        </div>

        {/* Web Push VAPID Worker */}
        <div className="rounded-2xl bg-white shadow-sm p-6 flex flex-col justify-between border border-[#DCE5E7] hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F9ECE8] flex items-center justify-center text-[#C2593F]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#003643]">Web Push VAPID Worker</h3>
                  <span className="font-mono text-xs text-[#71787c]">RFC 8291 / RFC 8292 PWA</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#FBF4E7] text-[#D99B26] font-mono text-xs font-semibold">
                2.1ms enc
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4 py-3 bg-[#F0F5F6] rounded-xl px-4 border border-[#DCE5E7]">
              <div>
                <span className="font-mono text-[11px] text-[#71787c] uppercase tracking-wider block">PWA Endpoints</span>
                <span className="font-editorial text-2xl font-bold text-[#003643]">3,890</span>
                <span className="font-mono text-[11px] text-[#2E473B] block mt-0.5">Faculty &amp; Students</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#71787c] uppercase tracking-wider block">Success Ratio</span>
                <span className="font-editorial text-2xl font-bold text-[#2E473B]">99.8%</span>
                <span className="font-mono text-[11px] text-[#71787c] block mt-0.5">Battery Saver Opt</span>
              </div>
            </div>

            {/* Key Ring Delivery Bar */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#71787c]">ECDH secp256r1 Key Ring Delivery</span>
                <span className="text-[#C2593F] font-semibold">99.8% Dispatch OK</span>
              </div>
              <div className="w-full bg-[#dbebf1] rounded-full h-3 overflow-hidden flex">
                <div className="bg-[#003643] h-full" style={{ width: '82%' }}></div>
                <div className="bg-[#D99B26] h-full" style={{ width: '14%' }}></div>
                <div className="bg-[#C2593F] h-full" style={{ width: '4%' }}></div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#71787c] font-mono">
                <span>Chrome/Android 82%</span>
                <span>Safari iOS 14%</span>
                <span>Firefox 4%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs font-mono bg-[#F0F5F6] rounded-lg p-2.5 border border-[#DCE5E7]">
            <span className="text-[#71787c]">Urgency: High (Silent Sync)</span>
            <span className="font-semibold text-[#003643]">TTL: 86400s (Offline Safe)</span>
          </div>
        </div>

        {/* Nodemailer SMTP Relay */}
        <div className="rounded-2xl bg-white shadow-sm p-6 flex flex-col justify-between border border-[#DCE5E7] hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FBF4E7] flex items-center justify-center text-[#D99B26]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-[#003643]">Nodemailer SMTP Relay</h3>
                  <span className="font-mono text-xs text-[#71787c]">Postfix Campus Edge Node #2</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#F9ECE8] text-[#C2593F] font-mono text-xs font-semibold">
                $0.00 Cost
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4 py-3 bg-[#F0F5F6] rounded-xl px-4 border border-[#DCE5E7]">
              <div>
                <span className="font-mono text-[11px] text-[#71787c] uppercase tracking-wider block">Dispatched</span>
                <span className="font-editorial text-2xl font-bold text-[#003643]">4,102</span>
                <span className="font-mono text-[11px] text-[#2E473B] block mt-0.5">Inbox Delivered</span>
              </div>
              <div>
                <span className="font-mono text-[11px] text-[#71787c] uppercase tracking-wider block">SMS Gateway</span>
                <span className="font-editorial text-2xl font-bold text-[#D99B26]">1,094</span>
                <span className="font-mono text-[11px] text-[#71787c] block mt-0.5">Carrier Email-to-SMS</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <span className="font-mono text-xs text-[#71787c]">Carrier Gateway Relay Matrix (0¢ per SMS)</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-[#F0F5F6] border border-[#DCE5E7]">
                  <span className="font-mono text-xs block font-semibold text-[#003643]">@vtext.com</span>
                  <span className="text-[11px] text-[#71787c]">420 sent</span>
                </div>
                <div className="p-2 rounded bg-[#F0F5F6] border border-[#DCE5E7]">
                  <span className="font-mono text-xs block font-semibold text-[#003643]">@txt.att.net</span>
                  <span className="text-[11px] text-[#71787c]">388 sent</span>
                </div>
                <div className="p-2 rounded bg-[#F0F5F6] border border-[#DCE5E7]">
                  <span className="font-mono text-xs block font-semibold text-[#003643]">@tmomail.net</span>
                  <span className="text-[11px] text-[#71787c]">286 sent</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs font-mono bg-[#F0F5F6] rounded-lg p-2.5 border border-[#DCE5E7]">
            <span className="text-[#71787c]">DKIM / SPF / DMARC: Signed OK</span>
            <span className="font-semibold text-[#2E473B]">Zero API Cost Verified</span>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: TOPIC PARTITIONS & BROKER TOPOLOGY */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: Topic Partitions Breakdown (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#003643]">
                Kafka Topic Partitions &amp; Watermarks
              </h2>
              <span className="text-xs text-[#71787c]">
                Replica set RF=1 (Local/Docker node) • In-Sync Replicas (ISR) 100%
              </span>
            </div>
            <button
              onClick={handleSyncOffsets}
              className={`px-3 py-1.5 rounded-lg bg-[#F0F5F6] text-[#003643] hover:bg-[#dbebf1] text-xs font-mono font-semibold transition flex items-center gap-1.5 border border-[#DCE5E7] ${
                isSyncing ? 'animate-pulse text-[#D99B26]' : ''
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Offsets'}</span>
            </button>
          </div>

          {/* Topic 1: class-updates */}
          <div className="rounded-2xl bg-white shadow-sm p-4 border border-[#DCE5E7] flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E473B]"></span>
                <span className="font-mono text-xs font-bold text-[#003643]">
                  campus.stream.class-updates
                </span>
                <span className="px-2 py-0.5 rounded bg-[#e1f0f7] text-[#003643] font-mono text-[10px]">
                  3 Partitions
                </span>
                <span className="px-2 py-0.5 rounded bg-[#e1f0f7] text-[#003643] font-mono text-[10px]">
                  cleanup: compact
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#71787c]">
                <span>Lag: <strong className="text-[#2E473B]">0 msgs</strong></span>
                <span>Total Offsets: <strong className="text-[#003643]">18,490</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { name: 'Partition #0', hw: '6,124' },
                { name: 'Partition #1', hw: '6,201' },
                { name: 'Partition #2', hw: '6,165' },
              ].map(p => (
                <div key={p.name} className="rounded-xl bg-[#F0F5F6] p-2.5 flex flex-col gap-1 border border-[#DCE5E7]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-[#003643]">{p.name}</span>
                    <span className="text-[#2E473B]">Leader #1</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1 text-xs">
                    <span className="text-[#71787c]">HW Mark:</span>
                    <span className="font-mono font-bold text-[#003643]">{p.hw}</span>
                  </div>
                  <div className="w-full bg-[#DCE5E7] h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-[#003643] h-full w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic 2: exam-updates */}
          <div className="rounded-2xl bg-white shadow-sm p-4 border border-[#DCE5E7] flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C2593F]"></span>
                <span className="font-mono text-xs font-bold text-[#003643]">
                  campus.stream.exam-updates
                </span>
                <span className="px-2 py-0.5 rounded bg-[#e1f0f7] text-[#003643] font-mono text-[10px]">
                  2 Partitions
                </span>
                <span className="px-2 py-0.5 rounded bg-[#F9ECE8] text-[#C2593F] font-mono text-[10px] font-semibold">
                  CRITICAL PRIORITY
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-[#71787c]">
                <span>Lag: <strong className="text-[#2E473B]">0 msgs</strong></span>
                <span>Total Offsets: <strong className="text-[#003643]">8,912</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { name: 'Partition #0 (STEM & Eng)', hw: '4,456' },
                { name: 'Partition #1 (Humanities/Law)', hw: '4,456' },
              ].map(p => (
                <div key={p.name} className="rounded-xl bg-[#F0F5F6] p-2.5 flex flex-col gap-1 border border-[#DCE5E7]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-[#003643]">{p.name}</span>
                    <span className="text-[#2E473B]">Leader #1</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-1 text-xs">
                    <span className="text-[#71787c]">HW Mark:</span>
                    <span className="font-mono font-bold text-[#003643]">{p.hw}</span>
                  </div>
                  <div className="w-full bg-[#DCE5E7] h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-[#C2593F] h-full w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consumer Groups Table */}
          <div className="rounded-2xl bg-white shadow-sm p-4 border border-[#DCE5E7] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-lg font-bold text-[#003643]">Consumer Group Topologies</h3>
              <span className="font-mono text-xs text-[#71787c]">State: Stable / Rebalance Idle</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-[#F0F5F6] text-[#71787c] uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-2.5 rounded-l-lg">Consumer Group</th>
                    <th className="p-2.5">Member Instance ID</th>
                    <th className="p-2.5">Assigned Partitions</th>
                    <th className="p-2.5">Protocol</th>
                    <th className="p-2.5 rounded-r-lg text-right">Commit State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCE5E7]">
                  <tr className="hover:bg-[#F0F5F6]/50">
                    <td className="p-2.5 font-mono font-semibold text-[#003643]">notification-group</td>
                    <td className="p-2.5 font-mono text-[#71787c]">node-inst-worker-alpha-71</td>
                    <td className="p-2.5 font-mono text-[#003643]">class [0,1,2] • exam [0,1]</td>
                    <td className="p-2.5 font-mono text-[#71787c]">RoundRobin</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#2E473B]">SYNCHRONIZED</td>
                  </tr>
                  <tr className="hover:bg-[#F0F5F6]/50">
                    <td className="p-2.5 font-mono font-semibold text-[#003643]">audit-logging-worker</td>
                    <td className="p-2.5 font-mono text-[#71787c]">audit-pg-sink-09</td>
                    <td className="p-2.5 font-mono text-[#003643]">general [0..3] • exam [0..1]</td>
                    <td className="p-2.5 font-mono text-[#71787c]">RangeAssignor</td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#2E473B]">SYNCHRONIZED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Collegiate Painting & Intensity Matrix (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          {/* Collegiate Ambient Hub banner with the oil painting vignette */}
          <div className="relative overflow-hidden rounded-2xl shadow-md min-h-[260px] flex flex-col justify-end p-5 group border border-[#DCE5E7]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAvMeMWzAGu5yOIjmn4vtRGiE27bAyXXzlYngb21ijQUB6Dyi1le1ZrQvrHjegZsd4_ZtdvSG5-5RERvhMV5_cObofzrWOcfdCxyUpTNHbhf43AlE5QMC7gQ9-kBBBiYCiDwLR_EAja0bvwfhN6E8KTIfgsuFSv6QXKG8r9bPqpkiJ6-T1qvPMF-CwMNuM11te-ramiFIsl695-a9khvyVxWl_tpuUJ4QZfmHiePiWgA8d1nMqmIjRmgw')`
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E2D36] via-[#0E2D36]/65 to-transparent"></div>
            <div className="relative z-10 text-white">
              <span className="px-2 py-0.5 rounded bg-[#D99B26] text-[#001f28] font-mono text-[10px] uppercase font-bold tracking-wider inline-block mb-1">
                Campus Ambient Hub
              </span>
              <h4 className="font-editorial text-2xl font-bold text-white">
                South Quad &amp; St. Jude Cloisters
              </h4>
              <p className="text-xs text-[#8ebdce] mt-1 max-w-sm leading-relaxed">
                Live broadcast endpoint #04 servicing 42 academic halls, 14 residential quadrangles, and emergency PA horns.
              </p>
            </div>
          </div>

          {/* Broker Partition Throughput & Consumer Sync Telemetry */}
          <div className="rounded-2xl bg-white shadow-sm p-5 border border-[#DCE5E7] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#003643]">
                  Partition Watermark &amp; Consumer Lag
                </h3>
                <span className="font-mono text-[11px] text-[#71787c]">
                  Real-time consumer offset synchronization
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#2E473B]/10 text-[#2E473B] font-mono text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E473B] animate-ping"></span>
                0 msgs lag
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-1 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#003643]"></span>
                  <span className="font-bold text-[#003643]">class-updates</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-[#71787c]">P0: 6.1k • P1: 6.2k • P2: 6.1k</span>
                  <span className="text-[#2E473B] font-bold">ISR 3/3</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D99B26]"></span>
                  <span className="font-bold text-[#003643]">exam-updates</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-[#71787c]">P0: 4.4k • P1: 4.4k</span>
                  <span className="text-[#2E473B] font-bold">ISR 2/2</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C2593F]"></span>
                  <span className="font-bold text-[#003643]">general-events</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-[#71787c]">P0..P3: 8.5k msgs</span>
                  <span className="text-[#2E473B] font-bold">ISR 4/4</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DCE5E7] flex items-center justify-between text-xs font-mono text-[#71787c]">
              <span>Throughput: <strong className="text-[#003643]">12.4k msg/min</strong></span>
              <span>Replication: <strong className="text-[#2E473B]">KRaft Quorum Active</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: LIVE EVENT STREAM LOG & CLOUDEVENTS INSPECTOR */}
      <section className="rounded-2xl bg-white shadow-sm p-6 border border-[#DCE5E7] flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#DCE5E7]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E473B] animate-pulse"></span>
              <h2 className="font-editorial text-2xl font-bold text-[#003643]">
                Live Event Stream Log &amp; Schema Inspector
              </h2>
            </div>
            <p className="text-xs text-[#71787c] mt-0.5">
              CloudEvents v1.0.2 compliant telemetry payloads emitted across cluster brokers
            </p>
          </div>

          {/* Filter Controls & Live Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleProduceBurst}
              className="px-3.5 py-1.5 rounded-lg bg-[#C2593F] hover:bg-[#a8442c] text-white text-xs font-mono font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-md"
            >
              <Zap className="w-3.5 h-3.5 text-[#ffdeae]" />
              <span>Simulate Event Burst</span>
            </button>

            <select
              value={filterTopic}
              onChange={e => setFilterTopic(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#F0F5F6] text-[#003643] text-xs font-mono font-medium border border-[#DCE5E7] outline-none cursor-pointer"
            >
              <option value="all">All Kafka Topics</option>
              <option value="class-updates">class-updates</option>
              <option value="exam-updates">exam-updates</option>
              <option value="general-events">general-events</option>
            </select>

            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#F0F5F6] text-[#003643] text-xs font-mono font-medium border border-[#DCE5E7] outline-none cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="URGENT">URGENT</option>
              <option value="INFO">INFO</option>
            </select>

            <button
              onClick={() => setSyntaxColors(!syntaxColors)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                syntaxColors
                  ? 'bg-[#003643] text-white shadow-sm'
                  : 'bg-[#D99B26] text-[#001f28]'
              }`}
            >
              <span>{syntaxColors ? 'Color Syntax ON' : 'Color Syntax OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const blob = new Blob([JSON.stringify(eventsList, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'kafka-telemetry-stream.json';
                a.click();
                URL.revokeObjectURL(url);
                if (soundEnabled) playAlertChime('info');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#F0F5F6] hover:bg-[#dbebf1] text-[#003643] text-xs font-mono font-semibold transition-all duration-200 active:scale-95 cursor-pointer flex items-center gap-1 border border-[#DCE5E7]"
              title="Download Event Stream"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Stream</span>
            </button>
          </div>
        </div>

        {/* Split Grid: Left Event Rows + Right JSON Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Events List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredEvents.map((evt, idx) => {
              const isSelected = eventsList.indexOf(evt) === selectedIndex;
              const isCrit = evt.severity === 'CRITICAL';
              const isUrg = evt.severity === 'URGENT';

              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedIndex(eventsList.indexOf(evt));
                    if (soundEnabled) playAlertChime('info');
                  }}
                  className={`cursor-pointer p-3.5 rounded-xl border-l-4 transition-all duration-200 active:scale-[0.99] flex flex-col gap-1.5 ${
                    isCrit
                      ? 'border-[#A82A2A]'
                      : isUrg
                      ? 'border-[#C2593F]'
                      : 'border-[#003643]'
                  } ${
                    isSelected
                      ? 'bg-[#e1f0f7] shadow-sm border border-[#DCE5E7] scale-[1.01]'
                      : 'bg-[#F0F5F6] hover:bg-[#dbebf1]/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          isCrit
                            ? 'bg-[#FDF0F0] text-[#A82A2A]'
                            : isUrg
                            ? 'bg-[#F9ECE8] text-[#C2593F]'
                            : 'bg-[#dbebf1] text-[#003643]'
                        }`}
                      >
                        {evt.severity}
                      </span>
                      <span className="font-semibold text-[#003643]">
                        {evt.topic} [p#{evt.partition}]
                      </span>
                    </div>
                    <span className="text-[#71787c]">{evt.time.split('T')[1]}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-editorial text-base font-bold text-[#003643]">
                      {evt.title}
                    </span>
                    <span className="font-mono text-xs text-[#C2593F]">offset: #{evt.offset}</span>
                  </div>

                  <p className="text-xs text-[#41484b] truncate">{evt.summary}</p>
                </div>
              );
            })}
          </div>

          {/* Right JSON Schema Inspector Console (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#0E2D36] text-white p-5 flex flex-col justify-between shadow-inner border border-[#1b4d5c]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#D99B26]" />
                  <span className="font-mono text-xs font-bold text-white">
                    CloudEvent Schema (v1.0.2)
                  </span>
                </div>
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-[#8ebdce] flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

              {/* JSON Monospace Box */}
              <pre className="font-mono text-xs leading-relaxed overflow-x-auto p-3.5 rounded-xl bg-black/40 text-[#8ebdce] max-h-[360px]">
                {syntaxColors ? (
                  <div>
                    {`{\n`}
                    {`  `}<span className="text-[#ffb4a2]">"specversion"</span>: <span className="text-[#ffdeae]">"1.0"</span>,{`\n`}
                    {`  `}<span className="text-[#ffb4a2]">"id"</span>: <span className="text-[#ffdeae]">"{selectedEvent.id}"</span>,{`\n`}
                    {`  `}<span className="text-[#ffb4a2]">"source"</span>: <span className="text-[#ffdeae]">"{selectedEvent.source}"</span>,{`\n`}
                    {`  `}<span className="text-[#ffb4a2]">"type"</span>: <span className="text-[#ffdeae]">"{selectedEvent.type}"</span>,{`\n`}
                    {`  `}<span className="text-[#ffb4a2]">"time"</span>: <span className="text-[#ffdeae]">"{selectedEvent.time}"</span>,{`\n`}
                    {`  `}<span className="text-[#ffb4a2]">"datacontenttype"</span>: <span className="text-[#ffdeae]">"application/json"</span>,{`\n`}
                    {`  `}<span className="text-[#ffb4a2]">"data"</span>: {`{\n`}
                    {`    `}<span className="text-[#ffb4a2]">"courseCode"</span>: <span className="text-[#ffdeae]">"{selectedEvent.courseCode}"</span>,{`\n`}
                    {`    `}<span className="text-[#ffb4a2]">"title"</span>: <span className="text-[#ffdeae]">"{selectedEvent.title}"</span>,{`\n`}
                    {`    `}<span className="text-[#ffb4a2]">"previousVenue"</span>: <span className="text-[#ffdeae]">"{selectedEvent.prev}"</span>,{`\n`}
                    {`    `}<span className="text-[#ffb4a2]">"assignedVenue"</span>: <span className="text-[#ffdeae]">"{selectedEvent.assigned}"</span>,{`\n`}
                    {`    `}<span className="text-[#ffb4a2]">"priority"</span>: <span className="text-[#ffdeae]">"{selectedEvent.severity}"</span>,{`\n`}
                    {`    `}<span className="text-[#ffb4a2]">"estimatedRecipients"</span>: <span className="text-white font-bold">{selectedEvent.recipients}</span>,{`\n`}
                    {`    `}<span className="text-[#ffb4a2]">"zeroCostDispatch"</span>: <span className="text-[#D99B26]">true</span>{`\n`}
                    {`  }\n`}
                    {`}`}
                  </div>
                ) : (
                  JSON.stringify(
                    {
                      specversion: '1.0',
                      id: selectedEvent.id,
                      source: selectedEvent.source,
                      type: selectedEvent.type,
                      time: selectedEvent.time,
                      data: {
                        courseCode: selectedEvent.courseCode,
                        title: selectedEvent.title,
                        priority: selectedEvent.severity,
                        recipients: selectedEvent.recipients
                      }
                    },
                    null,
                    2
                  )
                )}
              </pre>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#8ebdce]">
              <span>Partition: {selectedEvent.partition} | Offset: {selectedEvent.offset}</span>
              <span className="text-[#ffdeae]">Validation: Protobuf/JSON Schema OK</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
