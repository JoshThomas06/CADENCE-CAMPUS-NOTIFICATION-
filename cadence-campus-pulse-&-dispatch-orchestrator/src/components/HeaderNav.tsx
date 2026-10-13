import React from 'react';
import { Volume2, BellOff, User, Download, FileText } from 'lucide-react';
import { playAlertChime } from '../utils/sound';

export type ScreenId =
  | 'live-stream'
  | 'kafka-telemetry'
  | 'event-dispatcher'
  | 'subscribers'
  | 'landing'
  | 'markdown-center';

export type UserRole = 'Admin' | 'Faculty' | 'Student';

interface HeaderNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenMarkdownModal: (fileId?: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  onNavigate,
  role,
  onRoleChange,
  soundEnabled,
  onToggleSound,
  onOpenMarkdownModal,
}) => {
  const getRolePersona = () => {
    switch (role) {
      case 'Admin':
        return { name: 'Dean Sterling', title: 'Campus Safety / Admin' };
      case 'Student':
        return { name: 'Maya Lin', title: 'Student / CS & Studio Arts' };
      case 'Faculty':
      default:
        return { name: 'Dr. Julian Vance', title: 'Faculty / CS Dept' };
    }
  };

  const persona = getRolePersona();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(27,77,92,0.06)] border-b border-[#DCE5E7]">
      <div className="h-20 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Logo & Cluster Status */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => onNavigate('live-stream')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#003643] flex items-center justify-center text-[#ffdeae] shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-editorial text-xl font-bold">Ω</span>
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-lg text-[#003643] tracking-tight leading-none font-bold">
                CADENCE
              </span>
              <span className="font-mono text-[10px] text-[#C2593F] tracking-widest uppercase mt-0.5 font-semibold">
                Campus Pulse
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F5F6] border border-[#DCE5E7]">
            <div className="flex items-center gap-1.5 px-1">
              <span className="w-2 h-2 rounded-full bg-[#2E473B] animate-pulse"></span>
              <span className="font-mono text-[11px] text-[#003643] font-semibold">
                KAFKA: CONNECTED (3 TOPICS)
              </span>
            </div>
            <span className="text-[#c0c8cb] font-mono text-[11px]">|</span>
            <div className="flex items-center gap-1.5 px-1">
              <span className="material-symbols-outlined text-[#C2593F] text-[14px]">hub</span>
              <span className="font-mono text-[11px] text-[#41484b] font-medium">
                SOCKET.IO: 1,420 CLIENTS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7]">
          <button
            onClick={() => onNavigate('live-stream')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'live-stream'
                ? 'bg-[#003643] text-white shadow-sm font-semibold'
                : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
            }`}
          >
            Live Stream & Alerts
          </button>
          <button
            onClick={() => onNavigate('event-dispatcher')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'event-dispatcher'
                ? 'bg-[#003643] text-white shadow-sm font-semibold'
                : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
            }`}
          >
            Event Dispatcher
          </button>
          <button
            onClick={() => onNavigate('kafka-telemetry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'kafka-telemetry'
                ? 'bg-[#003643] text-white shadow-sm font-semibold'
                : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
            }`}
          >
            Kafka Topics & Telemetry
          </button>
          <button
            onClick={() => onNavigate('subscribers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'subscribers'
                ? 'bg-[#003643] text-white shadow-sm font-semibold'
                : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
            }`}
          >
            Subscribers & Preferences
          </button>
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentScreen === 'landing'
                ? 'bg-[#003643] text-white shadow-sm font-semibold'
                : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
            }`}
          >
            Landing
          </button>
          <button
            onClick={() => onNavigate('markdown-center')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentScreen === 'markdown-center'
                ? 'bg-[#C2593F] text-white shadow-sm font-semibold'
                : 'text-[#C2593F] hover:bg-[#F9ECE8]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>MD Files (6)</span>
          </button>
        </nav>

        {/* Right Action Suite */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Quick MD Download Button */}
          <button
            onClick={() => onOpenMarkdownModal()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D99B26]/15 hover:bg-[#D99B26]/25 text-[#003643] border border-[#D99B26]/40 text-xs font-semibold transition"
            title="Open Markdown screen files viewer and downloader"
          >
            <Download className="w-3.5 h-3.5 text-[#D99B26]" />
            <span>Download MDs</span>
          </button>

          {/* Role Pill Switcher */}
          <div className="hidden md:flex items-center p-0.5 rounded-full bg-[#F0F5F6] border border-[#DCE5E7]">
            {(['Admin', 'Faculty', 'Student'] as UserRole[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  onRoleChange(r);
                  if (soundEnabled) playAlertChime('info');
                }}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  role === r
                    ? 'bg-[#003643] text-white shadow-sm font-semibold'
                    : 'text-[#41484b] hover:text-[#0f1e22]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Audio Chime Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) playAlertChime('info');
              }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                soundEnabled
                  ? 'text-[#003643] hover:bg-[#F0F5F6]'
                  : 'text-[#71787c] hover:bg-[#F0F5F6]'
              }`}
              title={soundEnabled ? 'Sound Alerts: Active (click to mute)' : 'Sound Alerts: Muted'}
              type="button"
            >
              <Volume2 className={`w-4 h-4 ${!soundEnabled ? 'opacity-40' : ''}`} />
            </button>
            <button
              onClick={() => {
                onToggleSound();
                if (soundEnabled) playAlertChime('warning');
              }}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#41484b] hover:text-[#A82A2A] hover:bg-[#FDF0F0] transition-colors"
              title="Global Mute / DND"
              type="button"
            >
              <BellOff className="w-4 h-4" />
            </button>
          </div>

          {/* Persona Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#DCE5E7]">
            <div className="hidden 2xl:flex flex-col text-right">
              <span className="text-xs text-[#003643] font-semibold leading-tight">
                {persona.name}
              </span>
              <span className="font-mono text-[10px] text-[#41484b] leading-tight">
                {persona.title}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#003643] flex items-center justify-center shadow-sm ring-2 ring-[#ffdeae]">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
