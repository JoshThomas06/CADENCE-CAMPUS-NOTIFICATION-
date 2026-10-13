import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0E2D36] text-white py-6 border-t border-[#1b4d5c]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-editorial text-2xl text-[#ffdeae] font-bold">Ω</span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">
              CADENCE // Campus Pulse Dispatch &amp; Telemetry Infrastructure
            </span>
            <span className="font-mono text-[11px] text-[#8ebdce]">
              Institutional Resilience Core • High-Throughput Event Streaming Node #04
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-center md:text-right">
          <span className="font-mono text-xs text-[#8ebdce]">
            © 2025–2026 Office of Campus Safety • Academic Senate Protocol v4.2
          </span>
        </div>
      </div>
    </footer>
  );
};
