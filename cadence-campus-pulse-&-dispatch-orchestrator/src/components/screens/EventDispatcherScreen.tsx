import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Send,
  Zap,
  Shield,
  Layers,
  Radio,
  Clock,
  CheckCircle,
  FileText,
  AlertOctagon,
  Settings
} from 'lucide-react';
import { playAlertChime } from '../../utils/sound';

interface EventDispatcherScreenProps {
  onOpenMarkdownModal: (fileId?: string) => void;
  soundEnabled: boolean;
}

export const EventDispatcherScreen: React.FC<EventDispatcherScreenProps> = ({
  onOpenMarkdownModal,
  soundEnabled
}) => {
  const [topic, setTopic] = useState<'class-updates' | 'exam-updates' | 'general-events'>('class-updates');
  const [eventType, setEventType] = useState<string>('VENUE_CHANGED');
  const [course, setCourse] = useState<string>('CS401');
  const [headline, setHeadline] = useState<string>('Lecture Hall HVAC Maintenance Relocation');
  const [venue, setVenue] = useState<string>('Olin Hall, Amphitheater 3B');
  const [bodyText, setBodyText] = useState<string>(
    "Due to localized climate control adjustments in Low Memorial Library, this afternoon's Distributed Systems lab will convene in Olin Hall Amphitheater 3B. Please report directly with your portable workbenches."
  );
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'CRITICAL_FLASH'>('NORMAL');
  const [preset, setPreset] = useState<'faculty' | 'chair' | 'emergency'>('faculty');
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  // Audit Rows State
  const [auditRows, setAuditRows] = useState([
    {
      id: 'evt-77f4-90a1',
      time: '14:31:08 EST',
      topic: 'class-updates // VENUE_CHANGED',
      scope: 'CS401 Distributed Systems',
      latency: '1.2ms',
      status: 'Delivered (199/199)'
    },
    {
      id: 'evt-331b-4100',
      time: '14:15:22 EST',
      topic: 'exam-updates // EXAM_POSTPONED',
      scope: 'ARCH310 Architecture',
      latency: '0.9ms',
      status: 'Delivered (98/98)'
    },
    {
      id: 'evt-192a-bb09',
      time: '13:50:04 EST',
      topic: 'class-updates // CLASS_CANCELLED',
      scope: 'ENG202 Fluid Dynamics',
      latency: '1.4ms',
      status: 'Delivered (324/324)'
    }
  ]);

  const applyPreset = (type: 'faculty' | 'chair' | 'emergency') => {
    setPreset(type);
    if (soundEnabled) playAlertChime('info');

    if (type === 'faculty') {
      setTopic('class-updates');
      setEventType('VENUE_CHANGED');
      setCourse('CS401');
      setHeadline('Lecture Hall HVAC Maintenance Relocation');
      setVenue('Olin Hall, Amphitheater 3B');
      setBodyText(
        "Due to localized climate control adjustments in Low Memorial Library, this afternoon's Distributed Systems lab will convene in Olin Hall Amphitheater 3B."
      );
      setPriority('NORMAL');
    } else if (type === 'chair') {
      setTopic('exam-updates');
      setEventType('EXAM_POSTPONED');
      setCourse('ARCH310');
      setHeadline('Midterm Examination Schedule Realignment');
      setVenue('Pupin Physics 420 (Friday 09:00 EST)');
      setBodyText(
        'Due to room scheduling overlap, the mid-semester evaluation for Architectural Theory will take place in Pupin 420.'
      );
      setPriority('HIGH');
    } else {
      setTopic('general-events');
      setEventType('CAMPUS_EMERGENCY');
      setCourse('CAMPUS_WIDE');
      setHeadline('Quad Weather Flash: Severe Lightning Shelter Protocol');
      setVenue('Immediate Interior Shelter Mandatory');
      setBodyText(
        'Severe lightning cell approaching. Academic Council mandates immediate interior sheltering in stone buildings until 16:30.'
      );
      setPriority('CRITICAL_FLASH');
    }
  };

  const getScopeDetails = () => {
    switch (course) {
      case 'ARCH310':
        return { students: 92, faculty: 4, tas: 2, total: 98 };
      case 'ENG202':
        return { students: 310, faculty: 8, tas: 6, total: 324 };
      case 'CAMPUS_WIDE':
        return { students: 14850, faculty: 1200, tas: 450, total: 16500 };
      case 'CS401':
      default:
        return { students: 184, faculty: 12, tas: 3, total: 199 };
    }
  };

  const scopeStats = getScopeDetails();

  const currentPayload = {
    specversion: '1.0',
    id: `evt-${Math.floor(1000 + Math.random() * 9000).toString(16)}`,
    source: 'cadence://dispatch.service:4004',
    type: `edu.cadence.${topic.split('-')[0]}.${eventType}`,
    datacontenttype: 'application/json',
    time: new Date().toISOString(),
    data: {
      topic,
      course_id: course,
      priority,
      headline,
      venue,
      body: bodyText,
      signatory: 'Dr. Julian Vance (Faculty)'
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleDispatch = () => {
    if (soundEnabled) {
      playAlertChime(priority === 'CRITICAL_FLASH' ? 'urgent' : 'success');
    }

    const newRow = {
      id: `evt-${Math.floor(1000 + Math.random() * 9000).toString(16)}`,
      time: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' EST',
      topic: `${topic} // ${eventType}`,
      scope: course === 'CAMPUS_WIDE' ? 'ALL CAMPUS' : course,
      latency: '0.6ms',
      status: `Delivered (${scopeStats.total}/${scopeStats.total})`
    };

    setAuditRows([newRow, ...auditRows]);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* 1. TOP HEADER & ACTION BAR */}
      <header className="relative w-full rounded-2xl bg-white shadow-sm p-6 sm:p-8 border border-[#DCE5E7] overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#D99B26]/15 via-[#C2593F]/10 to-transparent blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="flex flex-col max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F5F6] text-[#003643] font-mono text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E473B] animate-ping"></span>
                CLUSTER NODE #04 // DISPATCHER REPL
              </span>
              <span className="text-[#c0c8cb] font-mono text-xs">•</span>
              <span className="font-mono text-xs text-[#C2593F] tracking-widest uppercase font-semibold">
                Academic Senate Protocol v4.2
              </span>
              <button
                onClick={() => onOpenMarkdownModal('03-event-dispatcher.md')}
                className="px-2.5 py-0.5 rounded bg-[#D99B26] hover:bg-[#c2881e] text-[#001f28] font-mono text-xs font-bold transition flex items-center gap-1"
                title="Download this screen's markdown documentation"
              >
                <Download className="w-3 h-3" />
                <span>Screen MD</span>
              </button>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#003643] font-bold tracking-tight leading-tight">
              Event Dispatcher &amp; Broadcast Trigger Console
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#41484b] max-w-2xl leading-relaxed">
              Decoupled, zero-cost microservice trigger interface for collegiate life-safety announcements, schedule mutations, and high-throughput Kafka telemetry fanout.
            </p>
          </div>

          {/* Presets Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-1.5 rounded-2xl bg-[#F0F5F6] border border-[#DCE5E7]">
            <div className="px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#71787c]">
              Workflow Preset:
            </div>
            <div className="inline-flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => applyPreset('faculty')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  preset === 'faculty'
                    ? 'bg-[#003643] text-white shadow-sm'
                    : 'text-[#41484b] hover:text-[#003643] hover:bg-white'
                }`}
              >
                Faculty Quick Action
              </button>
              <button
                type="button"
                onClick={() => applyPreset('chair')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  preset === 'chair'
                    ? 'bg-[#D99B26] text-[#001f28] shadow-sm'
                    : 'text-[#41484b] hover:text-[#003643] hover:bg-white'
                }`}
              >
                Chair Bulk Reschedule
              </button>
              <button
                type="button"
                onClick={() => applyPreset('emergency')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  preset === 'emergency'
                    ? 'bg-[#A82A2A] text-white shadow-sm'
                    : 'text-[#41484b] hover:text-[#A82A2A] hover:bg-[#FDF0F0]'
                }`}
              >
                Campus Safety Flash
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN BENTO WORKSPACE */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Builder (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="w-full rounded-2xl bg-white shadow-sm p-6 sm:p-8 border border-[#DCE5E7] flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE5E7]">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#F0F5F6] text-[#003643] flex items-center justify-center border border-[#DCE5E7]">
                  <Zap className="w-5 h-5 text-[#D99B26]" />
                </span>
                <div>
                  <h2 className="font-editorial text-xl font-bold text-[#003643]">
                    Kafka Event Mutation Studio
                  </h2>
                  <p className="text-xs text-[#71787c]">
                    Publish real-time payloads straight into decoupled broker partitions.
                  </p>
                </div>
              </div>

              {/* Priority Pill */}
              <div
                className={`px-3 py-1 rounded-full font-mono text-xs flex items-center gap-1.5 ${
                  priority === 'CRITICAL_FLASH'
                    ? 'bg-[#FDF0F0] text-[#A82A2A] font-bold border border-red-200'
                    : priority === 'HIGH'
                    ? 'bg-[#FBF4E7] text-[#D99B26] font-bold border border-amber-200'
                    : 'bg-[#F0F5F6] text-[#003643] border border-[#DCE5E7]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    priority === 'CRITICAL_FLASH'
                      ? 'bg-[#A82A2A] animate-ping'
                      : priority === 'HIGH'
                      ? 'bg-[#D99B26]'
                      : 'bg-[#003643]'
                  }`}
                ></span>
                <span>PRIORITY: {priority}</span>
              </div>
            </div>

            {/* Step 1: Topic Target Tabs */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-[#003643] font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Kafka Topic Target</span>
                <span className="text-[#71787c]">Default partitions: 12 • RF: 3</span>
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7]">
                {(['class-updates', 'exam-updates', 'general-events'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTopic(t);
                      if (soundEnabled) playAlertChime('info');
                    }}
                    className={`py-2 px-3 rounded-lg font-mono text-xs font-semibold transition ${
                      topic === t
                        ? 'bg-[#003643] text-white shadow-sm'
                        : 'text-[#41484b] hover:text-[#003643] hover:bg-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Event Specification & Target Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#003643]">Event Specification</label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#003643] text-xs font-mono border border-[#DCE5E7] shadow-xs focus:ring-2 focus:ring-[#003643] outline-none"
                >
                  <option value="VENUE_CHANGED">VENUE_CHANGED (Relocation Notice)</option>
                  <option value="CLASS_CANCELLED">CLASS_CANCELLED (Session Abort)</option>
                  <option value="EXAM_POSTPONED">EXAM_POSTPONED (Reschedule)</option>
                  <option value="CAMPUS_EMERGENCY">CAMPUS_EMERGENCY (Safety Directive)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#003643]">Target Cohort / Scope</label>
                <select
                  value={course}
                  onChange={e => setCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#003643] text-xs font-mono border border-[#DCE5E7] shadow-xs focus:ring-2 focus:ring-[#003643] outline-none"
                >
                  <option value="CS401">CS401 Distributed Systems</option>
                  <option value="ARCH310">ARCH310 Classical Architecture</option>
                  <option value="ENG202">ENG202 Fluid Dynamics</option>
                  <option value="CAMPUS_WIDE">ALL CAMPUS — Quad &amp; Halls</option>
                </select>
              </div>
            </div>

            {/* Blast Radius Strip */}
            <div className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[#D99B26]/20 text-[#003643] flex items-center justify-center">
                  <Radio className="w-4 h-4 text-[#D99B26]" />
                </span>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-[#71787c] uppercase">
                    Estimated Fanout Blast Radius
                  </span>
                  <span className="font-mono text-xs font-bold text-[#003643]">
                    {scopeStats.students.toLocaleString()} students • {scopeStats.faculty} faculty • {scopeStats.tas} TAs ({scopeStats.total.toLocaleString()} Total Active Subs)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-white text-[#003643] border border-[#DCE5E7]">
                  Socket.IO
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white text-[#C2593F] border border-[#DCE5E7]">
                  WebPush VAPID
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white text-[#71787c] border border-[#DCE5E7]">
                  SMTP Relay
                </span>
              </div>
            </div>

            {/* Inputs: Headline and Coordinates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#003643]">Headline / Summary</label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#003643] text-xs font-sans border border-[#DCE5E7] shadow-xs focus:ring-2 focus:ring-[#003643] outline-none"
                  placeholder="Subject line..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#003643]">New Venue / Directive</label>
                <input
                  type="text"
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#003643] text-xs font-sans border border-[#DCE5E7] shadow-xs focus:ring-2 focus:ring-[#003643] outline-none"
                  placeholder="Location or safety directive..."
                />
              </div>
            </div>

            {/* Textarea Body */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#003643]">
                  Broadcast Payload Body (Markdown Supported)
                </label>
                <span className="font-mono text-[10px] text-[#71787c]">UTF-8 String Buffer</span>
              </div>
              <textarea
                rows={3}
                value={bodyText}
                onChange={e => setBodyText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white text-[#003643] text-xs font-sans border border-[#DCE5E7] shadow-xs focus:ring-2 focus:ring-[#003643] outline-none"
              />
            </div>

            {/* Priority Escalation Radios */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#003643]">Dispatch Priority Escalation</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label
                  onClick={() => setPriority('NORMAL')}
                  className={`cursor-pointer flex items-center gap-2 p-3 rounded-xl border transition ${
                    priority === 'NORMAL'
                      ? 'bg-[#F0F5F6] border-[#003643]'
                      : 'bg-white border-[#DCE5E7] hover:bg-[#F0F5F6]'
                  }`}
                >
                  <input
                    type="radio"
                    name="priorityLevel"
                    checked={priority === 'NORMAL'}
                    readOnly
                    className="accent-[#003643]"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#003643]">NORMAL</span>
                    <span className="text-[10px] text-[#71787c]">Async queue, quiet</span>
                  </div>
                </label>

                <label
                  onClick={() => setPriority('HIGH')}
                  className={`cursor-pointer flex items-center gap-2 p-3 rounded-xl border transition ${
                    priority === 'HIGH'
                      ? 'bg-[#FBF4E7] border-[#D99B26]'
                      : 'bg-white border-[#DCE5E7] hover:bg-[#FBF4E7]'
                  }`}
                >
                  <input
                    type="radio"
                    name="priorityLevel"
                    checked={priority === 'HIGH'}
                    readOnly
                    className="accent-[#D99B26]"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#003643]">HIGH</span>
                    <span className="text-[10px] text-[#71787c]">Immediate chime</span>
                  </div>
                </label>

                <label
                  onClick={() => setPriority('CRITICAL_FLASH')}
                  className={`cursor-pointer flex items-center gap-2 p-3 rounded-xl border transition ${
                    priority === 'CRITICAL_FLASH'
                      ? 'bg-[#FDF0F0] border-[#A82A2A]'
                      : 'bg-white border-[#DCE5E7] hover:bg-[#FDF0F0]'
                  }`}
                >
                  <input
                    type="radio"
                    name="priorityLevel"
                    checked={priority === 'CRITICAL_FLASH'}
                    readOnly
                    className="accent-[#A82A2A]"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#A82A2A]">CRITICAL FLASH</span>
                    <span className="text-[10px] text-[#A82A2A]">Override DND / Siren</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Trigger Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#DCE5E7]">
              <div className="flex items-center gap-2 text-xs text-[#71787c]">
                <Shield className="w-4 h-4 text-[#2E473B]" />
                <span>Signed as: <strong className="text-[#003643]">Dr. Julian Vance (Faculty)</strong></span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playAlertChime('info');
                    alert('Dry Run Validated: 0 Schema Errors. 199 subscribers verified against Active Directory.');
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-mono text-xs font-semibold text-[#003643] bg-[#F0F5F6] hover:bg-[#dbebf1] transition border border-[#DCE5E7]"
                >
                  Simulate Dry Run
                </button>
                <button
                  type="button"
                  onClick={handleDispatch}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-md ${
                    priority === 'CRITICAL_FLASH'
                      ? 'bg-[#A82A2A] hover:bg-red-700'
                      : priority === 'HIGH'
                      ? 'bg-[#D99B26] text-[#001f28] hover:bg-[#c2881e]'
                      : 'bg-[#003643] hover:bg-[#0E2D36]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {broadcastSuccess
                      ? 'Committed to Broker (:9092) ✓'
                      : 'Broadcast to Kafka Broker (:9092)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Schema Inspector & Visual Painting (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Live CloudEvents JSON Schema Inspector */}
          <div className="w-full rounded-2xl bg-[#0E2D36] text-white p-5 flex flex-col gap-3 shadow-md border border-[#1b4d5c]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A82A2A]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#D99B26]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E473B]"></span>
                <span className="font-mono text-xs text-[#8ebdce] ml-2">
                  CloudEvents v1.0.2 Payload Inspector
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopySchema}
                className="p-1 rounded text-[#8ebdce] hover:text-white hover:bg-white/10 transition"
                title="Copy schema JSON"
              >
                {copiedSchema ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="bg-black/40 rounded-xl p-3 font-mono text-xs text-[#ffdeae] overflow-x-auto max-h-72 leading-relaxed">
              <pre>{JSON.stringify(currentPayload, null, 2)}</pre>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#8ebdce] pt-1">
              <span>Serialization: AVRO-COMPACT</span>
              <span>Est. Wire Size: 342 B</span>
            </div>
          </div>

          {/* Campus Landscape Art Accent Card */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-md min-h-[220px] flex flex-col justify-end p-5 border border-[#DCE5E7] group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOA8Q33Edkv3WMhv9wgYVJhJWXWgWI7PHTeSLatEQd-m6W400QGnspWcXEzmIN66UzwozE4q0JAzVuewVxNJWOaP62CidpavRNvNmphBaX4vhuZPZmjhTKY3EnALnJNVgldLxTck9W0Uy2Zhfdc-0L-uyPt05Brfh3DAZ24ggdA3WvsDd3VmHsW6xCDlog4MY3atplbHcj7jvxjvEppF5x9MMaQ5VGpg98-5RZehFQf6bBNy4uuviwag')`
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E2D36]/95 via-[#0E2D36]/50 to-transparent"></div>
            <div className="relative z-10 flex flex-col text-white">
              <span className="font-mono text-[10px] text-[#ffdeae] uppercase tracking-wider font-bold">
                Campus Atmosphere Dispatch
              </span>
              <h3 className="font-editorial text-2xl font-bold text-white">
                Low Library &amp; North Lawn Quadrant
              </h3>
              <p className="text-xs text-[#8ebdce] mt-1 leading-relaxed">
                Active ambient temperature 71°F. Ambient audio telemetry shows standard afternoon quad congregation.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 3. MULTI-STAGE PIPELINE TRACKER */}
      <section className="w-full rounded-2xl bg-white shadow-sm p-6 sm:p-8 border border-[#DCE5E7] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#003643]">
              Live Microservice Event Pipeline
            </h2>
            <p className="text-xs text-[#71787c]">
              Real-time trace path for triggered campus notifications across all protocol stages.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F5F6] text-[#2E473B] font-mono text-xs font-semibold border border-[#DCE5E7]">
            <span className="w-2 h-2 rounded-full bg-[#2E473B] animate-pulse"></span>
            ZERO-DROP PIPELINE RUNNING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              port: 'PORT :4004',
              title: 'Event Producer',
              desc: 'Express.js API ingestion & schema validation.',
              stat1: 'p99: 0.3ms',
              stat2: '200 OK'
            },
            {
              step: '2',
              port: 'PORT :9092',
              title: 'Kafka Cluster Broker',
              desc: '3x partitioned durable commit-log storage.',
              stat1: 'Lag: 0 msgs',
              stat2: 'In-Sync'
            },
            {
              step: '3',
              port: 'PORT :4005',
              title: 'Notification Engine',
              desc: 'Consumer group resolution & preference pruning.',
              stat1: 'Filter: 0.8ms',
              stat2: 'Healthy'
            },
            {
              step: '4',
              port: 'TRI-FANOUT',
              title: 'Delivery Layer',
              desc: 'Socket.IO + VAPID Web Push + SMTP Relay.',
              stat1: 'Delivery: 100%',
              stat2: 'ACK: 199/199'
            }
          ].map(p => (
            <div
              key={p.step}
              className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col justify-between gap-3"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-md bg-[#003643] text-white flex items-center justify-center font-mono text-xs font-bold">
                    {p.step}
                  </span>
                  <span className="font-mono text-[10px] text-[#71787c]">{p.port}</span>
                </div>
                <span className="text-sm font-bold text-[#003643]">{p.title}</span>
                <p className="text-xs text-[#41484b]">{p.desc}</p>
              </div>
              <div className="pt-2 border-t border-[#DCE5E7] flex items-center justify-between font-mono text-xs text-[#2E473B] font-semibold">
                <span>{p.stat1}</span>
                <span>{p.stat2}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ACTIVE EVENT QUEUE AUDIT TRAIL */}
      <section className="w-full rounded-2xl bg-white shadow-sm p-6 sm:p-8 border border-[#DCE5E7] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#003643]">
              Active Event Queue &amp; Audit Trail
            </h2>
            <p className="text-xs text-[#71787c]">
              Immutable record of campus alerts dispatched through this node.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const csvContent =
                'timestamp,event_id_topic,scope,latency,status\n' +
                auditRows.map(r => `${r.time},${r.topic},${r.scope},${r.latency},${r.status}`).join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'cadence-dispatch-audit-trail.csv';
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#F0F5F6] hover:bg-[#dbebf1] text-[#003643] text-xs font-mono font-semibold transition flex items-center gap-1.5 border border-[#DCE5E7]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Audit Log</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="bg-[#F0F5F6] text-[#71787c] font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-lg">Timestamp</th>
                <th className="py-3 px-4">Event ID / Topic</th>
                <th className="py-3 px-4">Target Course / Scope</th>
                <th className="py-3 px-4">Channels Fanned Out</th>
                <th className="py-3 px-4">Pipeline Latency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE5E7]">
              {auditRows.map(row => (
                <tr key={row.id} className="hover:bg-[#F0F5F6]/60 transition">
                  <td className="py-3.5 px-4 font-mono text-[#71787c]">{row.time}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-[#003643]">{row.id}</span>
                      <span className="text-[11px] text-[#71787c]">{row.topic}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#F0F5F6] font-mono text-xs text-[#003643] font-semibold border border-[#DCE5E7]">
                      {row.scope}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-mono text-xs">
                      <span className="w-5 h-5 rounded bg-[#1b4d5c]/15 text-[#003643] flex items-center justify-center font-bold">
                        S
                      </span>
                      <span className="w-5 h-5 rounded bg-[#C2593F]/15 text-[#C2593F] flex items-center justify-center font-bold">
                        W
                      </span>
                      <span className="w-5 h-5 rounded bg-[#41484b]/15 text-[#41484b] flex items-center justify-center font-bold">
                        E
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#2E473B]">
                    {row.latency}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2E473B]/10 text-[#2E473B] font-mono text-xs font-semibold">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Inspecting Partition Trace for ${row.id}\n• Broker Offset: 42918\n• Cluster Ack: Leader + 2 ISR Replicas\n• Compression: Snappy`)}
                      className="px-2 py-1 rounded text-[#003643] hover:bg-[#F0F5F6] font-mono text-xs font-bold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. MICROSERVICES PORT STATUS & TELEMETRY GRID */}
      <section className="w-full rounded-2xl bg-white shadow-sm p-6 sm:p-8 border border-[#DCE5E7] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-editorial text-2xl font-bold text-[#003643]">
              Microservices Port Status &amp; Telemetry Grid
            </h2>
            <p className="text-xs text-[#71787c]">
              Live telemetry from Cadence node sub-daemons on localhost socket fabric.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#003643]">
            <span className="w-2 h-2 rounded-full bg-[#2E473B] animate-ping"></span>
            PING INTERVAL: 1000MS
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { port: ':4001', name: 'User Service', ping: '0.4ms', stat: '18/50 conn', cpu: '1.8%' },
            { port: ':4002', name: 'Class Service', ping: '0.6ms', stat: '24/50 conn', cpu: '2.4%' },
            { port: ':4003', name: 'Exam Service', ping: '0.5ms', stat: '12/50 conn', cpu: '1.1%' },
            { port: ':4004', name: 'Event Producer', ping: '0.2ms', stat: '4.2 MB/s Out', cpu: '3.6%' },
            { port: ':4005', name: 'Notification Engine', ping: '0.8ms', stat: '1,420 peers', cpu: '4.2%' },
          ].map(svc => (
            <div
              key={svc.port}
              className="p-4 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#003643]">{svc.port}</span>
                <span className="w-2 h-2 rounded-full bg-[#2E473B]"></span>
              </div>
              <span className="text-xs font-bold text-[#003643]">{svc.name}</span>
              <div className="mt-1 flex flex-col gap-0.5 font-mono text-[11px] text-[#71787c]">
                <div className="flex justify-between">
                  <span>Ping:</span> <strong className="text-[#2E473B]">{svc.ping}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Pool/Sockets:</span> <span>{svc.stat}</span>
                </div>
                <div className="flex justify-between">
                  <span>CPU:</span> <span>{svc.cpu}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
