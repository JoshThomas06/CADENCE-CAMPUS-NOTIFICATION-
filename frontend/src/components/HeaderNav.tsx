import React from 'react';
import {
  Volume2,
  Bell,
  BellOff,
  User,
  Shield,
  BookOpen,
  Layers,
  Send,
  Database,
  LogIn,
  Lock
} from 'lucide-react';
import { playAlertChime } from '../utils/sound';

export type ScreenId =
  | 'landing'
  | 'live-stream'
  | 'calendar'
  | 'event-dispatcher'
  | 'database-crud'
  | 'kafka-telemetry'
  | 'subscribers'
  | 'auth'
  | 'guide';

export type UserRole = 'Admin' | 'Faculty' | 'Student';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  token?: string;
}

interface HeaderNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentUser?: AuthenticatedUser | null;
  isAuthenticated: boolean;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  onNavigate,
  role,
  onRoleChange,
  soundEnabled,
  onToggleSound,
  currentUser,
  isAuthenticated,
  onOpenProfile,
  onOpenNotifications,
  unreadNotificationsCount = 2
}) => {
  const getRolePersona = () => {
    switch (role) {
      case 'Admin':
        return {
          name: 'Dean Sterling',
          title: 'Senate Operations • Full Admin Access',
          badgeColor: 'bg-[#A82A2A] text-white',
          desc: 'Full Broadcast, Siren Override & Kafka Telemetry'
        };
      case 'Student':
        return {
          name: 'Maya Lin',
          title: 'Student • Enrolled CS & Studio Arts',
          badgeColor: 'bg-[#2E473B] text-white',
          desc: 'Read-Only Alerts, iCal Sync & Safety Check-ins'
        };
      case 'Faculty':
      default:
        return {
          name: 'Dr. Julian Vance',
          title: 'Faculty • CS Department Chair',
          badgeColor: 'bg-[#C2593F] text-white',
          desc: 'Create, Edit & Push Course Mutation Alerts'
        };
    }
  };

  const persona = getRolePersona();

  // Role permissions
  const canAccessDispatcher = role === 'Admin' || role === 'Faculty';
  const canAccessDatabase = role === 'Admin' || role === 'Faculty';
  const canAccessKafka = role === 'Admin';

  const handleProtectedNavigate = (screen: ScreenId) => {
    if (!isAuthenticated && screen !== 'landing' && screen !== 'auth') {
      if (soundEnabled) playAlertChime('warning');
      onNavigate('auth');
      return;
    }
    onNavigate(screen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(27,77,92,0.06)] border-b border-[#DCE5E7]">
      <div className="h-20 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Logo & Cluster Status */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#003643] flex items-center justify-center text-[#ffdeae] shadow-sm group-hover:scale-105 transition-transform">
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
                KAFKA: 9092 ONLINE
              </span>
            </div>
            <span className="text-[#c0c8cb] font-mono text-[11px]">|</span>
            <div className="flex items-center gap-1.5 px-1">
              <span className="w-2 h-2 rounded-full bg-[#C2593F]"></span>
              <span className="font-mono text-[11px] text-[#41484b] font-medium">
                SOCKETS: 1,420
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7]">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentScreen === 'landing'
                ? 'bg-[#003643] text-white shadow-sm font-semibold'
                : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
            }`}
          >
            Landing
          </button>

          {/* Internal Tabs: Only visible / active when authenticated */}
          {isAuthenticated ? (
            <>
              <button
                onClick={() => onNavigate('live-stream')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  currentScreen === 'live-stream'
                    ? 'bg-[#003643] text-white shadow-sm font-semibold'
                    : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
                }`}
              >
                Live Alerts
              </button>

              <button
                onClick={() => onNavigate('calendar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  currentScreen === 'calendar'
                    ? 'bg-[#003643] text-white shadow-sm font-semibold'
                    : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
                }`}
              >
                Calendar &amp; Stats
              </button>

              {canAccessDispatcher && (
                <button
                  onClick={() => onNavigate('event-dispatcher')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    currentScreen === 'event-dispatcher'
                      ? 'bg-[#003643] text-white shadow-sm font-semibold'
                      : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
                  }`}
                >
                  Event Dispatcher
                </button>
              )}

              {canAccessDatabase && (
                <button
                  onClick={() => onNavigate('database-crud')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                    currentScreen === 'database-crud'
                      ? 'bg-[#003643] text-white shadow-sm font-semibold'
                      : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Database &amp; CRUD</span>
                </button>
              )}

              {canAccessKafka && (
                <button
                  onClick={() => onNavigate('kafka-telemetry')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    currentScreen === 'kafka-telemetry'
                      ? 'bg-[#003643] text-white shadow-sm font-semibold'
                      : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
                  }`}
                >
                  Kafka Telemetry
                </button>
              )}

              <button
                onClick={() => onNavigate('subscribers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  currentScreen === 'subscribers'
                    ? 'bg-[#003643] text-white shadow-sm font-semibold'
                    : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
                }`}
              >
                {role === 'Student' ? 'My Subscriptions' : 'Subscribers & Hub'}
              </button>

              <button
                onClick={() => onNavigate('guide')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentScreen === 'guide'
                    ? 'bg-[#D99B26] text-[#001f28] shadow-sm font-bold'
                    : 'text-[#41484b] hover:text-[#0f1e22] hover:bg-[#dbebf1]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Platform Guide</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 px-2 text-[11px] font-mono text-[#71787c]">
              <Lock className="w-3.5 h-3.5 text-[#C2593F]" />
              <span>Sign in to unlock Live Alerts, Dispatcher &amp; Database</span>
            </div>
          )}
        </nav>

        {/* Right Action Suite */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isAuthenticated ? (
            <>
              {/* Notification Center Bell Button */}
              <button
                onClick={onOpenNotifications}
                className="relative w-9 h-9 rounded-xl bg-[#F0F5F6] hover:bg-[#dbebf1] border border-[#DCE5E7] flex items-center justify-center text-[#003643] transition cursor-pointer active:scale-95"
                title="Open Campus Pulse Notification Center"
                type="button"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C2593F] text-white font-mono text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Audio Chime Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onToggleSound();
                    if (!soundEnabled) playAlertChime('info');
                  }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
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
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-[#41484b] hover:text-[#A82A2A] hover:bg-[#FDF0F0] transition-all duration-200 active:scale-95 cursor-pointer"
                  title="Global Mute / DND"
                  type="button"
                >
                  <BellOff className="w-4 h-4" />
                </button>
              </div>

              {/* Active User Persona Pill */}
              <div
                onClick={onOpenProfile}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0F5F6] hover:bg-[#e1edf2] border border-[#DCE5E7] cursor-pointer transition"
                title="Click to view details, switch portal, or edit settings"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    role === 'Admin'
                      ? 'bg-[#A82A2A]'
                      : role === 'Faculty'
                      ? 'bg-[#C2593F]'
                      : 'bg-[#2E473B]'
                  }`}
                ></span>
                <span className="text-xs font-bold text-[#003643]">
                  {currentUser?.name || persona.name}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                    role === 'Admin'
                      ? 'bg-[#A82A2A] text-white'
                      : role === 'Faculty'
                      ? 'bg-[#C2593F] text-white'
                      : 'bg-[#2E473B] text-white'
                  }`}
                >
                  {role}
                </span>
              </div>

              {/* User Persona Profile Avatar - Clicking opens ProfileModal */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 pl-2 border-l border-[#DCE5E7] cursor-pointer group text-left"
                title="Profile & Settings: Update details, switch portal, SMTP settings"
                type="button"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ring-2 group-hover:scale-105 transition-transform ${
                    role === 'Admin'
                      ? 'bg-[#A82A2A] ring-red-200'
                      : role === 'Faculty'
                      ? 'bg-[#C2593F] ring-orange-200'
                      : 'bg-[#003643] ring-[#ffdeae]/60'
                  }`}
                >
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>
            </>
          ) : (
            /* Unauthenticated Action: Sign In / Register Button */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('auth')}
                className="px-4 py-2 rounded-xl bg-[#003643] hover:bg-[#0E2D36] text-white text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
