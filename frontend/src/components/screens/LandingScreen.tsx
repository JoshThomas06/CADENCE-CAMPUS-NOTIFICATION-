import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Radio,
  Cpu,
  Layers,
  CheckCircle2,
  Calendar,
  MapPin,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Terminal,
  Copy,
  Check,
  Share2
} from 'lucide-react';
import { ThreeHeroCanvas } from '../ThreeHeroCanvas';
import { IndoorMapModal } from '../IndoorMapModal';
import { MonthlyAlertCalendar } from '../MonthlyAlertCalendar';
import { downloadIcsCalendarEvent } from '../../utils/calendar';
import { playAlertChime } from '../../utils/sound';

interface LandingScreenProps {
  onNavigateToLive: () => void;
  onNavigateToDispatcher?: () => void;
  onNavigateToCalendar?: () => void;
  soundEnabled: boolean;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onNavigateToLive,
  onNavigateToDispatcher,
  onNavigateToCalendar,
  soundEnabled
}) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [heroMode, setHeroMode] = useState<'painting' | 'mesh' | 'split'>('painting');
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // Map Modal State
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [mapVenue, setMapVenue] = useState<string>('North Quad Lawn • GeoZone #04');
  const [mapCourse, setMapCourse] = useState<string>('ARCH310');

  // Button States
  const [icalAdded, setIcalAdded] = useState<boolean>(false);
  const [isSafeCheckedIn, setIsSafeCheckedIn] = useState<boolean>(false);
  const [quickToast, setQuickToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setQuickToast(msg);
    setTimeout(() => setQuickToast(null), 3500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('docker compose -f docker-compose.yml up -d --build');
    setCopiedCmd(true);
    if (soundEnabled) playAlertChime('info');
    triggerToast('Docker launch command copied to clipboard!');
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleDownloadIcal = () => {
    if (soundEnabled) playAlertChime('success');
    downloadIcsCalendarEvent(
      'CS401: Distributed Systems Midterm Exam',
      'Postponed Exam Block B in Turing Hall Annex. Seating arrangements intact.',
      'Turing Hall Annex Block B',
      new Date(Date.now() + 3600 * 1000 * 48),
      new Date(Date.now() + 3600 * 1000 * 50)
    );
    setIcalAdded(true);
    triggerToast('Downloaded CS401 exam calendar event (.ics)!');
    setTimeout(() => setIcalAdded(false), 3500);
  };

  const handleOpenIndoorMap = (venue: string, course: string) => {
    if (soundEnabled) playAlertChime('info');
    setMapVenue(venue);
    setMapCourse(course);
    setIsMapOpen(true);
  };

  const handleToggleSafeCheckIn = () => {
    if (soundEnabled) playAlertChime('urgent');
    setIsSafeCheckedIn(!isSafeCheckedIn);
    triggerToast(
      !isSafeCheckedIn
        ? 'Verified Safe check-in confirmed and logged to Senate Safety topic.'
        : 'Safety check-in status cleared.'
    );
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF7F2] text-[#111b1e] relative">
      {/* Toast Notification */}
      {quickToast && (
        <div className="fixed top-24 right-8 z-50 bg-[#003643] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#ffdeae]/40 text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{quickToast}</span>
        </div>
      )}

      {/* 1. HERO SECTION WITH DYNAMIC CAMPUS PAINTING & 3D WEBGL CORE */}
      <section className="relative pt-10 pb-20 overflow-hidden bg-gradient-to-b from-[#133945] via-[#1b4d5c] to-[#FAF7F2] text-[#f4eee2] border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-8 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#dfa64f]/20 border border-[#dfa64f]/40 text-[#dfa64f] font-mono text-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-[#dfa64f] animate-ping"></span>
              <span>0-Latency Self-Hosted Collegiate Fabric • Zero External Cloud Fees</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-5">
              The Sovereign Event Backbone for <span className="italic text-[#dfa64f] font-medium">Campus Life</span> &amp; Safety.
            </h1>

            <p className="text-base sm:text-lg text-[#f4eee2]/90 font-light leading-relaxed max-w-2xl mb-8">
              A decoupled, microservices-driven event streaming platform broadcasting critical class cancellations, venue migrations, exam updates, and emergency alerts across Socket.IO, native Web Push, and SMTP in under <strong className="text-white font-mono font-medium underline decoration-[#d95c3a] decoration-2">&lt; 1.4 milliseconds</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playAlertChime('info');
                  onNavigateToLive();
                }}
                className="px-6 py-3 rounded-xl bg-[#d95c3a] hover:bg-[#c04b2c] active:scale-95 text-white font-medium text-sm tracking-wide shadow-lg shadow-[#d95c3a]/30 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Explore Live Dispatch Stream</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (soundEnabled) playAlertChime('info');
                  if (onNavigateToDispatcher) onNavigateToDispatcher();
                  else onNavigateToLive();
                }}
                className="px-6 py-3 rounded-xl bg-[#133945]/70 hover:bg-[#133945] active:scale-95 border border-[#dfa64f]/40 text-[#dfa64f] font-mono text-sm transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Activity className="w-4 h-4 text-[#dfa64f]" />
                <span>Launch Event Studio</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#1b4d5c]/40 max-w-2xl">
              <div className="bg-[#0a1d23]/40 backdrop-blur-sm p-3.5 rounded-xl border border-[#1b4d5c]/30">
                <div className="font-mono text-2xl font-bold text-[#dfa64f]">1,420</div>
                <div className="text-[11px] font-mono text-[#f4eee2]/70 uppercase">Active Sockets</div>
              </div>
              <div className="bg-[#0a1d23]/40 backdrop-blur-sm p-3.5 rounded-xl border border-[#1b4d5c]/30">
                <div className="font-mono text-2xl font-bold text-white">3,890</div>
                <div className="text-[11px] font-mono text-[#f4eee2]/70 uppercase">Push Workers</div>
              </div>
              <div className="bg-[#0a1d23]/40 backdrop-blur-sm p-3.5 rounded-xl border border-[#1b4d5c]/30">
                <div className="font-mono text-2xl font-bold text-emerald-400">&lt;1.4ms</div>
                <div className="text-[11px] font-mono text-[#f4eee2]/70 uppercase">Broker Lag</div>
              </div>
              <div className="bg-[#0a1d23]/40 backdrop-blur-sm p-3.5 rounded-xl border border-[#1b4d5c]/30">
                <div className="font-mono text-2xl font-bold text-[#d95c3a]">$0.00</div>
                <div className="text-[11px] font-mono text-[#f4eee2]/70 uppercase">Vendor Costs</div>
              </div>
            </div>
          </div>

          {/* DYNAMIC HERO VISUAL SHOWCASE: CAMPUS PAINTING & 3D WEBGL MESH */}
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 px-1 gap-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#111b1e]">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#d95c3a]"></span>
                <strong className="font-bold text-[#133945]">Spatial Campus Orchestrator:</strong>
                <span className="text-gray-600">Physical Quad Beacons &amp; 3D Kafka Event Lattice</span>
              </div>

              {/* View Switcher Pills */}
              <div className="flex items-center p-1 rounded-lg bg-[#0a1d23]/80 border border-[#1b4d5c] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playAlertChime('info');
                    setHeroMode('painting');
                  }}
                  className={`px-3 py-1 rounded transition active:scale-95 cursor-pointer ${heroMode === 'painting' ? 'bg-[#dfa64f] text-[#0a1d23] font-bold shadow' : 'text-[#f4eee2]/80 hover:text-white'}`}
                >
                  Campus Quad Live View
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playAlertChime('info');
                    setHeroMode('mesh');
                  }}
                  className={`px-3 py-1 rounded transition active:scale-95 cursor-pointer ${heroMode === 'mesh' ? 'bg-[#dfa64f] text-[#0a1d23] font-bold shadow' : 'text-[#f4eee2]/80 hover:text-white'}`}
                >
                  3D Event Lattice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (soundEnabled) playAlertChime('info');
                    setHeroMode('split');
                  }}
                  className={`px-3 py-1 rounded transition active:scale-95 cursor-pointer ${heroMode === 'split' ? 'bg-[#dfa64f] text-[#0a1d23] font-bold shadow' : 'text-[#f4eee2]/80 hover:text-white'}`}
                >
                  Unified Split View
                </button>
              </div>
            </div>

            {/* Display Frame */}
            <div className="relative w-full rounded-2xl border-2 border-[#1b4d5c]/40 shadow-2xl overflow-hidden bg-[#0c242e]" style={{ minHeight: '520px' }}>
              
              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 z-30 bg-[#0a1d23]/90 border border-[#dfa64f]/40 text-[#f4eee2] text-[11px] font-mono py-1 px-3 rounded-md backdrop-blur flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[#dfa64f]">TOPOLOGY:</span>
                <span>Quad-Core Event Ring • 28 Active Shards</span>
              </div>

              <div className="absolute top-4 right-4 z-30 bg-[#0a1d23]/90 border border-[#1b4d5c]/70 text-[#f4eee2] text-[11px] font-mono py-1 px-3 rounded-md backdrop-blur flex items-center space-x-2">
                <span className="text-xs font-mono text-emerald-400">● LIVE</span>
                <span>LISTENER: socket.on('cadence:fanout')</span>
              </div>

              {/* 1. CAMPUS PAINTING CONTAINER WITH INTERACTIVE BEACON PINS */}
              {heroMode === 'painting' && (
                <div className="relative w-full h-[520px] block transition-all duration-500">
                  <img
                    src="/campus_painting.jpg"
                    alt="Collegiate Impressionistic Painting - Historic Quadrangle Lawn and Cathedral"
                    className="w-full h-full object-cover object-center filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1d23]/90 via-transparent to-[#0a1d23]/30"></div>

                  {/* BEACON 1: NORTH QUAD LAWN (ARCH310) */}
                  <div
                    className="absolute top-[48%] left-[34%] z-20 group cursor-pointer"
                    onClick={() => {
                      if (soundEnabled) playAlertChime('info');
                      handleOpenIndoorMap('North Quad Courtyard (Old Elm)', 'ARCH310');
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-8 h-8 rounded-full bg-sky-400 opacity-75 animate-ping"></div>
                      <div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-lg"></div>
                    </div>
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#0a1d23]/95 border border-sky-400/60 text-white rounded-lg p-2.5 shadow-xl w-60 backdrop-blur-md opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                      <div className="flex items-center justify-between text-[10px] font-mono text-sky-400 font-bold mb-0.5">
                        <span>VENUE SHIFT</span>
                        <span>CLICK TO MAP</span>
                      </div>
                      <div className="font-editorial text-sm font-bold text-white leading-tight">ARCH310: Relocated to Lawn</div>
                      <div className="text-[11px] text-gray-300 font-sans mt-1">Sunlit courtyard under Old Elm Tree. Bring drawing boards.</div>
                    </div>
                  </div>

                  {/* BEACON 2: TURING HALL ANNEX (CS401 EXAM) */}
                  <div
                    className="absolute top-[28%] left-[68%] z-20 group cursor-pointer"
                    onClick={() => {
                      if (soundEnabled) playAlertChime('info');
                      handleDownloadIcal();
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-8 h-8 rounded-full bg-[#dfa64f] opacity-75 animate-ping"></div>
                      <div className="w-4 h-4 rounded-full bg-[#dfa64f] border-2 border-white shadow-lg"></div>
                    </div>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#0a1d23]/95 border border-[#dfa64f]/60 text-white rounded-lg p-2.5 shadow-xl w-64 backdrop-blur-md opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#dfa64f] font-bold mb-0.5">
                        <span>HIGH PRIORITY</span>
                        <span>CLICK FOR ICAL</span>
                      </div>
                      <div className="font-editorial text-sm font-bold text-white leading-tight">CS401 Exam Rescheduled</div>
                      <div className="text-[11px] text-gray-300 font-sans mt-1">Transformer overhaul. Postponed to Friday at 15:30.</div>
                    </div>
                  </div>

                  {/* BEACON 3: SOUTH RIDGE (EMERGENCY) */}
                  <div
                    className="absolute top-[16%] left-[18%] z-20 group cursor-pointer"
                    onClick={() => {
                      if (soundEnabled) playAlertChime('urgent');
                      handleToggleSafeCheckIn();
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-8 h-8 rounded-full bg-red-500 opacity-75 animate-ping"></div>
                      <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-lg"></div>
                    </div>
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#0a1d23]/95 border border-red-500/60 text-white rounded-lg p-2.5 shadow-xl w-60 backdrop-blur-md opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                      <div className="flex items-center justify-between text-[10px] font-mono text-red-400 font-bold mb-0.5">
                        <span>CRITICAL FLASH</span>
                        <span>CLICK CHECK-IN</span>
                      </div>
                      <div className="font-editorial text-sm font-bold text-white leading-tight">Severe Gale Flash Alert</div>
                      <div className="text-[11px] text-gray-300 font-sans mt-1">Seek stone shelter. Outdoor walks restricted.</div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 z-20 bg-[#0a1d23]/80 border border-[#1b4d5c]/60 text-[#f4eee2] text-xs font-mono py-1.5 px-3 rounded-md backdrop-blur">
                    <span className="text-[#dfa64f]">HISTORIC QUADRANGLE:</span> Fall Semester • 1,420 Enrolled Students Active on North Lawn
                  </div>
                </div>
              )}

              {/* 2. THREE.JS 3D MESH CANVAS */}
              {heroMode === 'mesh' && (
                <div className="w-full h-[520px]">
                  <ThreeHeroCanvas height={520} />
                </div>
              )}

              {/* 3. SPLIT VIEW */}
              {heroMode === 'split' && (
                <div className="w-full h-[520px] grid grid-cols-1 md:grid-cols-2">
                  <div className="relative w-full h-full border-r border-[#1b4d5c]/60 overflow-hidden">
                    <img
                      src="/campus_painting.jpg"
                      alt="Collegiate Painting"
                      className="w-full h-full object-cover filter contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1d23]/80 to-transparent flex items-end p-4">
                      <span className="font-mono text-xs text-[#dfa64f]">Physical Campus Quadrangle</span>
                    </div>
                  </div>
                  <div className="relative w-full h-full bg-[#0c242e]">
                    <ThreeHeroCanvas height={520} />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE COLLEGIATE FEED */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#d95c3a] font-semibold mb-2">
              Real-Time Socket Stream
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#133945]">
              Live Collegiate Incident &amp; Broadcast Feed
            </h2>
            <p className="text-gray-600 mt-2 max-w-xl text-sm">
              Event triggers dispatched straight from Registrar databases, campus facility beacons, and Weather Service feeds in CloudEvents JSON-LD envelope format.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 font-mono text-xs text-[#1b4d5c]">
            <span className="animate-ping inline-block w-2 h-2 rounded-full bg-[#dfa64f]"></span>
            <span>Polling frequency: 0s (Pure WebSockets)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <article className="bg-white rounded-2xl p-6 border border-[#e8ded0] shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#dfa64f] rounded-t-2xl"></div>
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-3">
                <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                  HIGH PRIORITY
                </span>
                <span>12 seconds ago</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#111b1e] mb-2 leading-snug">
                CS401 Distributed Systems: Midterm Rescheduled
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Due to power transformer overhaul in Turing Hall Annex, Exam Block B is postponed to Friday at 15:30. Seating arrangements remain synchronized with Hall 4.
              </p>
              <div className="bg-[#f4eee2]/60 p-3 rounded-lg border border-[#e8ded0] text-xs font-mono text-[#133945] mb-4 space-y-1">
                <div><strong>EVENT_ID:</strong> evt_cs401_exam_m3</div>
                <div><strong>TARGET:</strong> Section 01, Section 02 (412 students)</div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDownloadIcal}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition active:scale-95 cursor-pointer ${
                  icalAdded ? 'bg-emerald-600 text-white' : 'bg-[#F0F5F6] text-[#1b4d5c] hover:bg-[#dbebf1]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>{icalAdded ? 'Downloaded (.ics) ✓' : 'Add to iCal (.ics)'}</span>
              </button>
              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                ACK 408/412
              </span>
            </div>
          </article>

          {/* Card 2 - WITH PROMINENT CAMPUS PAINTING */}
          <article className="bg-white rounded-2xl p-6 border border-[#e8ded0] shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#133945] rounded-t-2xl"></div>
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-3">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                  VENUE SHIFT
                </span>
                <span>1 min ago</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#111b1e] mb-2 leading-snug">
                ARCH310 Classical Studio Relocated to North Quad
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Acoustic performance review moved from Studio 202 to the Sunlit Courtyard under Old Elm Tree. Bring drawing boards and sun shades.
              </p>
              <div className="relative overflow-hidden rounded-xl border border-[#e8ded0] mb-4 h-32 bg-[#133945]">
                <img
                  src="/campus_painting.jpg"
                  alt="North Lawn Courtyard"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[11px] font-mono text-white">North Lawn • GeoZone #04</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenIndoorMap('North Lawn Courtyard • GeoZone #04', 'ARCH310')}
                className="text-xs font-mono text-[#d95c3a] hover:underline flex items-center space-x-1 active:scale-95 cursor-pointer font-bold"
              >
                <MapPin className="w-4 h-4" />
                <span>View Route Trigger</span>
              </button>
              <span className="text-[11px] font-mono text-[#133945] bg-[#e8ded0]/50 px-2 py-0.5 rounded">
                68 Enrolled
              </span>
            </div>
          </article>

          {/* Card 3 */}
          <article className="bg-white rounded-2xl p-6 border border-[#d95c3a]/40 shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#d95c3a] rounded-t-2xl"></div>
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-3">
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                  <span>CRITICAL FLASH</span>
                </span>
                <span>4 mins ago</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#111b1e] mb-2 leading-snug">
                Severe Gale &amp; Hail Storm Warning for South Ridge
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                National Weather Service severe thunderstorm alert. All outdoor botanical facilities and Observatory trail walks are restricted until 21:00 UTC. Seek stone shelter.
              </p>
              <div className="bg-red-50/70 p-3 rounded-lg border border-red-200 text-xs font-mono text-red-900 mb-4 space-y-1">
                <div><strong>FANOUT_STATUS:</strong> 12,490 SMS / 18,200 WebPushes</div>
                <div><strong>ACTION_REQUIRED:</strong> Safe Acknowledgement Check-in</div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleToggleSafeCheckIn}
                className={`px-3 py-1.5 rounded-lg text-white text-xs font-mono font-medium transition active:scale-95 cursor-pointer flex items-center space-x-1 ${
                  isSafeCheckedIn ? 'bg-[#2E473B]' : 'bg-[#d95c3a] hover:bg-[#b84222]'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isSafeCheckedIn ? 'Verified Safe ✓' : 'I Am Safe (Check-in)'}</span>
              </button>
              <span className="text-[11px] font-mono text-gray-500">Tier 0 Safety</span>
            </div>
          </article>
        </div>
      </section>

      {/* 3. ZERO-COST MULTI-CHANNEL FANOUT GRID */}
      <section className="py-20 bg-[#f4eee2]/60 border-y border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#dfa64f] font-bold bg-[#133945] px-3 py-1 rounded-full inline-block mb-3">
              Zero External Fees
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#133945] mb-4">
              Self-Hosted Tri-Channel Broadcast Architecture
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Decoupled Kafka consumer groups orchestrate sub-second delivery pipelines across campus networks without third-party vendor lock-in or recurring cloud licensing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-7 border border-[#e8ded0] shadow-sm hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#133945]/10 text-[#133945] flex items-center justify-center mb-6">
                <Radio className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs font-bold text-[#dfa64f] uppercase tracking-wider mb-1">
                Channel 01 • In-App
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#133945] mb-3">
                Socket.IO WebSockets
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Direct stateful socket streams maintain duplex communication with active student/faculty browser sessions with sub-millisecond propagation latency.
              </p>
              <div className="space-y-2 pt-4 border-t border-gray-100 text-xs font-mono text-[#133945]">
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-bold text-emerald-600">&lt; 0.4ms</span>
                </div>
                <div className="flex justify-between">
                  <span>External Cost:</span>
                  <span className="font-bold text-emerald-600">$0.00 / mo</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 border-2 border-[#dfa64f] shadow-md relative hover:shadow-lg transition">
              <div className="absolute -top-3 right-6 bg-[#dfa64f] text-[#0a1d23] text-[11px] font-mono font-bold px-3 py-0.5 rounded-full uppercase">
                Battery-Conscious
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#dfa64f]/20 text-[#003643] flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs font-bold text-[#d95c3a] uppercase tracking-wider mb-1">
                Channel 02 • Native PWA
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#133945] mb-3">
                Web Push (VAPID / RFC 8291)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Cryptographically signed Web Push notifications wake background Service Workers even when tabs and browsers are completely closed.
              </p>
              <div className="space-y-2 pt-4 border-t border-gray-100 text-xs font-mono text-[#133945]">
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="font-bold text-sky-700">ECDSA P-256</span>
                </div>
                <div className="flex justify-between">
                  <span>External Cost:</span>
                  <span className="font-bold text-emerald-600">$0.00 / mo</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-[#e8ded0] shadow-sm hover:shadow-lg transition">
              <div className="w-12 h-12 rounded-xl bg-[#d95c3a]/10 text-[#d95c3a] flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <div className="font-mono text-xs font-bold text-[#133945] uppercase tracking-wider mb-1">
                Channel 03 • Telecom SMS
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#133945] mb-3">
                Nodemailer Carrier Gateways
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Institutional mail relays route emergency dispatch digests to US mobile carriers without commercial per-SMS metering fees.
              </p>
              <div className="space-y-2 pt-4 border-t border-gray-100 text-xs font-mono text-[#133945]">
                <div className="flex justify-between">
                  <span>Throughput:</span>
                  <span className="font-bold text-sky-700">1,200 msg/sec</span>
                </div>
                <div className="flex justify-between">
                  <span>External Cost:</span>
                  <span className="font-bold text-emerald-600">$0.00 / mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL-TIME MONTHLY ALERT CALENDAR & TIMELINE */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MonthlyAlertCalendar
          soundEnabled={soundEnabled}
          onNavigateToExtensive={onNavigateToCalendar}
        />
      </section>

      {/* 5. DEPLOYMENT CTA */}
      <section className="py-20 bg-[#0a1d23] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold mb-4">
            Zero-Cost Campus Resilience In Production
          </h2>
          <p className="text-[#f4eee2]/70 max-w-2xl mx-auto text-sm sm:text-base mb-8">
            Production Docker Compose cluster with Kafka KRaft, Redis Cache, Socket.IO Relay nodes, and Registrar WebHook ingress daemons.
          </p>

          <div className="bg-[#051114] border border-[#1b4d5c] rounded-2xl p-4 max-w-xl mx-auto flex items-center justify-between mb-8 text-left">
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono text-emerald-400">
              <Terminal className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span>docker compose -f docker-compose.yml up -d --build</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="ml-4 px-3 py-1.5 bg-[#1b4d5c] text-white rounded-lg text-xs hover:bg-[#d95c3a] active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (soundEnabled) playAlertChime('info');
                onNavigateToLive();
              }}
              className="px-6 py-3 rounded-xl bg-[#d95c3a] hover:bg-[#c04b2c] active:scale-95 text-white font-medium text-sm transition flex items-center gap-2 shadow-lg shadow-[#d95c3a]/20 cursor-pointer"
            >
              <span>Enter Operational Console</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* INDOOR MAP MODAL */}
      <IndoorMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        venueName={mapVenue}
        courseCode={mapCourse}
      />
    </div>
  );
};
