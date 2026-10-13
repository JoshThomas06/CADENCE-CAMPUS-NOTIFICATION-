import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, X, CheckCircle2, Info } from 'lucide-react';

interface IndoorMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName?: string;
  courseCode?: string;
}

export const IndoorMapModal: React.FC<IndoorMapModalProps> = ({
  isOpen,
  onClose,
  venueName = 'Tudor Hall 3B (Drafting Suite)',
  courseCode = 'ARCH310'
}) => {
  const [activeFloor, setActiveFloor] = useState<number>(3);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2D36]/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#DCE5E7] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCE5E7] bg-[#F0F5F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003643] text-[#ffdeae] flex items-center justify-center shadow-sm">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-xl font-bold text-[#003643]">
                  Interactive Campus &amp; Indoor Venue Map
                </h3>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#1b4d5c] text-white font-bold">
                  {courseCode}
                </span>
              </div>
              <p className="text-xs font-mono text-[#71787c]">
                Beacon ID: BCN-QUAD-3B • Floor Level {activeFloor}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Target Venue Banner */}
          <div className="p-4 rounded-xl bg-[#F9ECE8] border border-[#ffdad2] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-[#C2593F] tracking-wider">
                Current Relocation Destination
              </span>
              <h4 className="font-editorial text-lg font-bold text-[#003643] mt-0.5">
                {venueName}
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Relocated from North Quad Lawn due to weather protocols. Drafting easels allocated.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white text-[#C2593F] border border-[#C2593F]/30 font-mono text-xs font-bold shadow-xs">
                ETA: 2 MIN WALK
              </span>
            </div>
          </div>

          {/* Interactive Floor Plan Rendering */}
          <div className="relative rounded-2xl border-2 border-[#DCE5E7] overflow-hidden bg-[#0c242e] h-72 sm:h-80 shadow-inner flex items-center justify-center">
            {/* Background Architectural Blueprint Grid */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#dfa64f 1px, transparent 1px), radial-gradient(#d95c3a 1px, #0c242e 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            ></div>

            {/* Simulated Architectural Floorplan Canvas */}
            <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between">
              {/* Floor Switcher Floating Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                  {[1, 2, 3].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setActiveFloor(lvl)}
                      className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition ${
                        activeFloor === lvl
                          ? 'bg-[#dfa64f] text-[#0a1d23] shadow-md'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Floor {lvl}
                    </button>
                  ))}
                </div>

                <span className="text-xs font-mono text-emerald-400 bg-black/40 px-2.5 py-1 rounded-md border border-emerald-500/30">
                  ● BEACON CALIBRATED
                </span>
              </div>

              {/* Blueprint Center Graphics */}
              <div className="relative w-full flex-1 flex items-center justify-center">
                {/* Rooms Outline */}
                <div className="w-4/5 h-4/5 border-2 border-dashed border-[#dfa64f]/40 rounded-xl relative flex items-center justify-center">
                  <div className="absolute top-2 left-3 text-[10px] font-mono text-[#dfa64f]/80">
                    WING B — ARCHITECTURE LABS
                  </div>
                  <div className="absolute bottom-2 right-3 text-[10px] font-mono text-sky-400/80">
                    ELEVATOR &amp; STAIRWELL 2
                  </div>

                  {/* Pulsing Target Pin */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#d95c3a]/40 animate-ping absolute"></div>
                    <div className="w-6 h-6 rounded-full bg-[#d95c3a] border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold relative z-10">
                      ★
                    </div>
                    <div className="mt-2 bg-white/95 px-3 py-1 rounded-md text-[11px] font-mono font-bold text-[#003643] shadow-lg border border-[#DCE5E7]">
                      {venueName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Waypoint Breadcrumbs */}
              <div className="flex items-center justify-between text-xs font-mono text-[#f4eee2]/80 pt-2 border-t border-white/10">
                <span>Waypoint 01: Historic Archway Gate</span>
                <span>➔</span>
                <span>Waypoint 02: East Arcade Hall</span>
                <span>➔</span>
                <span className="text-[#dfa64f] font-bold">Suite 3B</span>
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Directions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-1">
              <span className="font-mono text-[10px] text-[#C2593F] font-bold uppercase">Step 01</span>
              <span className="text-xs font-bold text-[#003643]">Depart North Quad</span>
              <p className="text-[11px] text-gray-600">Walk past the stone fountain towards Tudor Hall West Entry.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-1">
              <span className="font-mono text-[10px] text-[#C2593F] font-bold uppercase">Step 02</span>
              <span className="text-xs font-bold text-[#003643]">Ascend to Floor 3</span>
              <p className="text-[11px] text-gray-600">Take Elevator B or West Spiral Staircase to Level 3.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] flex flex-col gap-1">
              <span className="font-mono text-[10px] text-[#C2593F] font-bold uppercase">Step 03</span>
              <span className="text-xs font-bold text-[#003643]">Enter Studio 3B</span>
              <p className="text-[11px] text-gray-600">Badge tap unlocked for ARCH310 enrolled student IDs.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#DCE5E7] bg-gray-50 flex items-center justify-between">
          <span className="text-xs font-mono text-gray-500">
            Acoustic Testing Sync Active • Campus GeoZone #04
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#003643] hover:bg-[#1b4d5c] text-white text-xs font-mono font-bold transition shadow-sm"
          >
            Close Map View
          </button>
        </div>
      </div>
    </div>
  );
};
