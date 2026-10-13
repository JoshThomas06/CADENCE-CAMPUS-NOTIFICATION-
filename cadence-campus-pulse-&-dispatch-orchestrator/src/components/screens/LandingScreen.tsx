import React, { useState } from 'react';
import { ThreeHeroCanvas } from '../ThreeHeroCanvas';
import {
  Download,
  Copy,
  Check,
  Calendar,
  MapPin,
  AlertTriangle,
  Radio,
  Bell,
  Mail,
  Zap,
  Shield,
  Layers,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { playAlertChime } from '../../utils/sound';

interface LandingScreenProps {
  onOpenMarkdownModal: (fileId?: string) => void;
  onNavigateToLive: () => void;
  soundEnabled: boolean;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onOpenMarkdownModal,
  onNavigateToLive,
  soundEnabled
}) => {
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [safeChecked, setSafeChecked] = useState<boolean>(false);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('git clone https://git.cadence-campus.edu/core.git && cd core && docker compose up -d');
    setCopiedCmd(true);
    if (soundEnabled) playAlertChime('info');
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="w-full flex flex-col bg-[#faf7f2] text-[#111b1e]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-20 overflow-hidden bg-gradient-to-b from-[#133945] via-[#1b4d5c] to-[#faf7f2] text-[#f4eee2] border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8 text-left">
            {/* Subtitle Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#dfa64f]/20 border border-[#dfa64f]/40 text-[#dfa64f] font-mono text-xs mb-4">
              <span className="w-2 h-2 rounded-full bg-[#dfa64f] animate-ping"></span>
              <span>0-Latency Self-Hosted Collegiate Fabric • Zero External Cloud Fees</span>
            </div>

            {/* Headline */}
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-5">
              The Sovereign Event Backbone for <span className="italic text-[#dfa64f] font-medium">Campus Life</span> &amp; Safety.
            </h1>

            <p className="text-base sm:text-lg text-[#f4eee2]/90 font-light leading-relaxed max-w-2xl mb-8">
              A decoupled, microservices-driven event streaming platform broadcasting critical class cancellations, venue migrations, exam updates, and emergency alerts across Socket.IO, native Web Push, and SMTP in under <strong className="text-white font-mono font-medium underline decoration-[#d95c3a] decoration-2">1.4 milliseconds</strong>.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onNavigateToLive}
                className="px-6 py-3 rounded-xl bg-[#d95c3a] hover:bg-[#c04b2c] text-white font-medium text-sm tracking-wide shadow-lg shadow-[#d95c3a]/30 transition transform hover:-translate-y-0.5 flex items-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Explore Live Dispatch Stream</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenMarkdownModal('05-landing-page.md')}
                className="px-6 py-3 rounded-xl bg-[#133945]/70 hover:bg-[#133945] border border-[#dfa64f]/40 text-[#dfa64f] font-mono text-sm transition flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Landing MD Spec</span>
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

          {/* 3D Visualizer Canvas Section */}
          <div className="mt-4 relative">
            <div className="flex items-center justify-between pb-3 px-1 text-xs font-mono text-[#111b1e]">
              <span className="flex items-center space-x-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#d95c3a]"></span>
                <strong className="font-bold text-[#133945]">Real-Time Cluster Orchestrator:</strong>
                <span className="text-gray-600">Event Fanout Mesh Visualizer</span>
              </span>
              <span className="hidden sm:inline text-gray-500 italic">Drag to Orbit / Interactive WebGL Canvas</span>
            </div>

            <div className="w-full h-[500px] rounded-2xl border border-[#1b4d5c]/40 shadow-2xl relative overflow-hidden bg-[#0c242e]">
              <ThreeHeroCanvas height={500} />
              <div className="absolute top-4 left-4 z-10 bg-[#0a1d23]/80 border border-[#dfa64f]/30 text-[#f4eee2] text-[11px] font-mono py-1 px-3 rounded-md backdrop-blur">
                <span className="text-[#dfa64f]">TOPOLOGY:</span> Quad-Core Event Ring • 28 Active Shards
              </div>
              <div className="absolute bottom-4 right-4 z-10 bg-[#0a1d23]/80 border border-[#1b4d5c]/60 text-[#f4eee2] text-[11px] font-mono py-1 px-3 rounded-md backdrop-blur flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>LISTENER: socket.on('cadence:fanout')</span>
              </div>
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
              Event triggers dispatched straight from Registrar databases, campus facility beacons, and Weather Service feeds in JSON-LD envelope format.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2 font-mono text-xs text-[#1b4d5c]">
            <span className="animate-ping inline-block w-2 h-2 rounded-full bg-[#dfa64f]"></span>
            <span>Polling frequency: 0s (Pure WebSockets)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <article className="bg-white rounded-2xl p-6 border border-[#e8ded0] shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group">
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
              <button className="text-xs font-mono text-[#1b4d5c] hover:text-[#d95c3a] flex items-center space-x-1.5">
                <Calendar className="w-4 h-4" />
                <span>Add to iCal (.ics)</span>
              </button>
              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                ACK 408/412
              </span>
            </div>
          </article>

          {/* Card 2 */}
          <article className="bg-white rounded-2xl p-6 border border-[#e8ded0] shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group">
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
              <div className="relative overflow-hidden rounded-xl border border-[#e8ded0] mb-4 h-28 bg-[#133945]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyeJA4zYFuqVUwMEhPIvZAjiPwzVcwoDWMLFn4O8n2REdYvssZRT3vMNOYUtTzlgE7ltX_QdpRnJq9YTK6e9mCHMBXbdBNRPBi-ydq_Iq7Nhe7p-F7o_Auezd2IDDuKRHYD0z-81NfvM6C5sznk_8N5x_8UJf6RfGSqSJzj_Pxdpd4leruSnfFV1xZLWaXPWTchpQQt2WGfWjbr1jCgLilMiKD3PVdU3rVp5SdYVzQq4onvqXXj_Ck2mIyceBymogXyBQ"
                  alt="North Lawn Courtyard"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[11px] font-mono text-white">North Lawn • GeoZone #04</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button className="text-xs font-mono text-[#d95c3a] hover:underline flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>View Route Trigger</span>
              </button>
              <span className="text-[11px] font-mono text-[#133945] bg-[#e8ded0]/50 px-2 py-0.5 rounded">
                68 Enrolled
              </span>
            </div>
          </article>

          {/* Card 3 */}
          <article className="bg-white rounded-2xl p-6 border border-[#d95c3a]/40 shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#d95c3a] rounded-t-2xl"></div>
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-3">
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold flex items-center space-x-1">
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
                onClick={() => setSafeChecked(true)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition flex items-center space-x-1 ${
                  safeChecked
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#d95c3a] hover:bg-[#b84222] text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{safeChecked ? 'Checked In Safe ✓' : 'I Am Safe (Check-in)'}</span>
              </button>
              <span className="text-[11px] font-mono text-gray-500">Escalation tier: 0</span>
            </div>
          </article>
        </div>
      </section>

      {/* 3. ZERO-COST MULTI-CHANNEL RELAY GRID */}
      <section className="py-20 bg-[#f4eee2]/60 border-y border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#dfa64f] font-bold bg-[#133945] px-3 py-1 rounded-full inline-block mb-3">
              Decoupled Architecture
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#133945] mb-4">
              The Zero-Cost Multi-Channel Relay Grid
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Commercial notification platforms charge thousands in recurring SaaS tier fees. Cadence orchestrates self-hosted pipelines that trigger students and faculty anywhere on campus without paying a cent to third-party brokers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-7 border border-[#e8ded0] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#133945]/10 text-[#133945] flex items-center justify-center mb-6">
                <Radio className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-[#d95c3a] font-semibold mb-1">
                LATENCY: ~0.4MS • SOCKET.IO CLUSTER
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#111b1e] mb-3">
                In-App Realtime WebSockets
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Instant in-viewport toasts, sound chime alerts, and state diffing for active students using the campus web portal.
              </p>
              <ul className="space-y-3 font-mono text-xs text-gray-700 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Room partition by Course Code &amp; Quad Zone</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Redis Pub/Sub adapter across multiple nodes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Binary heartbeat checking to prevent stale connections</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-7 border-2 border-[#dfa64f] shadow-md relative">
              <div className="absolute -top-3 right-6 bg-[#dfa64f] text-[#0a1d23] text-[11px] font-mono font-bold px-3 py-0.5 rounded-full uppercase">
                Battery-Conscious
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#dfa64f]/15 text-[#0a1d23] flex items-center justify-center mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-[#133945] font-semibold mb-1">
                W3C STANDARD • RFC 8291 / VAPID
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#111b1e] mb-3">
                Native Web Push (PWA)
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Triggers lock-screen banners on iOS 16.4+, Android, macOS, and Windows even when the browser is completely closed.
              </p>
              <ul className="space-y-3 font-mono text-xs text-gray-700 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Zero Firebase / Google FCM vendor lock-in</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Elliptic Curve cryptography key pairs (ECDSA)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Silent background service worker payload decryption</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-[#e8ded0] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#d95c3a]/10 text-[#d95c3a] flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-[#d95c3a] font-semibold mb-1">
                ZERO BILLS • CARRIER SMS GATEWAY
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#111b1e] mb-3">
                SMTP &amp; Carrier SMS Relay
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Bypasses costly commercial SMS services (saving ~$450/month) by leveraging telecom carrier free email gateways.
              </p>
              <ul className="space-y-3 font-mono text-xs text-gray-700 border-t border-gray-100 pt-5">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Postfix / OpenSMTPD campus cluster integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Automatic SPF, DKIM, and DMARC 10/10 deliverability</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Responsive campus newsletter styling with dark mode support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEPLOYMENT CLI SECTION */}
      <section className="py-20 bg-[#0a1d23] text-[#f4eee2] border-t border-[#1b4d5c]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#dfa64f]/20 border border-[#dfa64f]/40 text-[#dfa64f] flex items-center justify-center mx-auto mb-6">
            <Terminal className="w-8 h-8" />
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-white mb-4">
            Ready to Deploy Cadence on Your Campus?
          </h2>
          <p className="text-[#f4eee2]/70 max-w-2xl mx-auto text-sm sm:text-base mb-8">
            Download the production Docker Compose cluster including Kafka KRaft, Redis Cache, Socket.IO Relay nodes, and the Registrar WebHook ingress daemon.
          </p>

          <div className="max-w-xl mx-auto bg-black/60 rounded-xl p-4 border border-[#1b4d5c]/60 font-mono text-xs text-left mb-8 flex items-center justify-between">
            <span className="text-emerald-400 select-all">
              git clone https://git.cadence-campus.edu/core.git &amp;&amp; docker compose up -d
            </span>
            <button
              type="button"
              onClick={handleCopyCommand}
              className="ml-4 px-3 py-1 bg-[#1b4d5c] text-white rounded text-[11px] hover:bg-[#d95c3a] transition flex items-center gap-1"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={onNavigateToLive}
              className="px-6 py-3 rounded-xl bg-[#d95c3a] hover:bg-[#c44e2e] text-white font-medium text-sm transition"
            >
              Access Administrative Dashboard
            </button>
            <button
              type="button"
              onClick={() => onOpenMarkdownModal()}
              className="px-6 py-3 rounded-xl bg-[#133945] hover:bg-[#133945]/80 border border-[#e8ded0]/30 text-white font-mono text-sm transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download All MD Specs</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
