import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Volume2,
  CheckCheck,
  Trash2,
  Radio,
  Send,
  Smartphone,
  Mail,
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { playAlertChime } from '../utils/sound';

export interface CampusNotificationItem {
  id: string;
  title: string;
  message: string;
  priority: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: string;
  source: string;
  channels: {
    socket: boolean;
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  read: boolean;
  topic?: string;
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound?: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound
}) => {
  if (!isOpen) return null;

  const [filter, setFilter] = useState<'all' | 'critical' | 'unread'>('all');
  const [pushStatus, setPushStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [notifications, setNotifications] = useState<CampusNotificationItem[]>([
    {
      id: 'notif-101',
      title: 'Turing Hall Power Grid Transfer - Emergency Siren',
      message: 'Substation B transfer initiated. Backup generator active. All CS401 labs relocated to Olin 3B.',
      priority: 'CRITICAL',
      timestamp: 'Just now (11:42 AM)',
      source: 'Senate Safety Dispatch (Dean Sterling)',
      topic: 'campus-flash',
      channels: { socket: true, push: true, email: true, sms: true },
      read: false
    },
    {
      id: 'notif-102',
      title: 'CS401: Distributed Systems Midterm Rescheduled',
      message: 'Midterm Exam Block B rescheduled to Turing Hall Annex. Seating arrangements intact.',
      priority: 'WARNING',
      timestamp: '12m ago',
      source: 'Dr. Julian Vance (Faculty)',
      topic: 'class-updates',
      channels: { socket: true, push: true, email: true, sms: false },
      read: false
    },
    {
      id: 'notif-103',
      title: 'ARCH310: Classical Architecture Studio Relocation',
      message: 'Class relocated to North Quad Lawn • GeoZone #04 due to natural daylight requirements.',
      priority: 'INFO',
      timestamp: '45m ago',
      source: 'Prof. Victor Sterling (Faculty)',
      topic: 'class-updates',
      channels: { socket: true, push: false, email: true, sms: false },
      read: true
    },
    {
      id: 'notif-104',
      title: 'Severe Weather Warning: Wind Advisory Active',
      message: 'University Senate recommends utilizing indoor pedestrian skywalks across North Quad.',
      priority: 'WARNING',
      timestamp: '1h 20m ago',
      source: 'Campus Operations',
      topic: 'campus-flash',
      channels: { socket: true, push: true, email: true, sms: true },
      read: true
    }
  ]);

  const requestWebPush = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushStatus(perm);
        if (perm === 'granted') {
          if (soundEnabled) playAlertChime('success');
          new Notification('Cadence Campus Pulse', {
            body: 'Native OS Web Push notifications successfully linked!',
            icon: '/favicon.ico'
          });
        }
      } catch (err) {
        console.error('Push permission error:', err);
      }
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (soundEnabled) playAlertChime('info');
  };

  const clearAll = () => {
    setNotifications([]);
    if (soundEnabled) playAlertChime('info');
  };

  const markSingleAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const testAudioChime = (type: 'urgent' | 'info') => {
    playAlertChime(type);
  };

  const filteredList = notifications.filter(n => {
    if (filter === 'critical') return n.priority === 'CRITICAL';
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#0E2D36]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#DCE5E7] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#003643] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C2593F] text-white flex items-center justify-center shadow-md ring-2 ring-white/20 relative">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-2xl font-bold">Live Notification Center</h3>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1b4d5c] text-[#ffdeae] uppercase">
                  WSS + VAPID Active
                </span>
              </div>
              <p className="text-xs text-[#8ebdce] font-mono mt-0.5">
                Real-time multi-channel feed with desktop OS push &amp; audio alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar & Controls */}
        <div className="bg-[#F0F5F6] border-b border-[#DCE5E7] px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#003643] text-white shadow-xs'
                  : 'text-[#41484b] hover:bg-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'unread'
                  ? 'bg-[#003643] text-white shadow-xs'
                  : 'text-[#41484b] hover:bg-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === 'critical'
                  ? 'bg-[#A82A2A] text-white shadow-xs'
                  : 'text-[#41484b] hover:bg-white'
              }`}
            >
              Critical Flash
            </button>
          </div>

          {/* Test Sound & Permission Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => testAudioChime('urgent')}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#dbebf1] border border-[#DCE5E7] text-[#A82A2A] font-mono text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              title="Test Urgent Siren Chime"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Chime</span>
            </button>
            {pushStatus !== 'granted' ? (
              <button
                onClick={requestWebPush}
                className="px-2.5 py-1 rounded-lg bg-[#C2593F] hover:bg-[#a64830] text-white font-mono text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enable Web Push</span>
              </button>
            ) : (
              <span className="font-mono text-[10px] px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                Web Push: Enabled ✓
              </span>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-6 overflow-y-auto divide-y divide-[#DCE5E7] flex-1">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-[#71787c]">
              <Bell className="w-8 h-8 opacity-30" />
              <p className="text-sm font-semibold">No notifications match this filter.</p>
              <p className="text-xs">All campus channels are operating normally.</p>
            </div>
          ) : (
            filteredList.map(item => (
              <div
                key={item.id}
                onClick={() => markSingleAsRead(item.id)}
                className={`py-4 first:pt-0 last:pb-0 flex flex-col gap-2 transition cursor-pointer group ${
                  !item.read ? 'bg-[#F0F5F6]/40 -mx-6 px-6' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        item.priority === 'CRITICAL'
                          ? 'bg-[#A82A2A] animate-ping'
                          : item.priority === 'WARNING'
                          ? 'bg-[#C2593F]'
                          : 'bg-[#2E473B]'
                      }`}
                    ></span>
                    <h4 className="font-editorial text-base font-bold text-[#003643] group-hover:text-[#C2593F] transition-colors">
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px] text-[#71787c]">
                    <Clock className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-[#41484b] leading-relaxed pl-4">
                  {item.message}
                </p>

                <div className="flex items-center justify-between pl-4 pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#71787c] font-mono">
                    <span className="font-bold text-[#003643]">{item.source}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#2E473B]">Dispatched to:</span>
                      {item.channels.socket && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold" title="WebSocket Live Stream">
                          Sockets
                        </span>
                      )}
                      {item.channels.push && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold" title="VAPID Web Push">
                          WebPush
                        </span>
                      )}
                      {item.channels.email && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold" title="SMTP Mailer">
                          Email
                        </span>
                      )}
                      {item.channels.sms && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold" title="Carrier SMS Gateway">
                          SMS
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.priority === 'CRITICAL'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : item.priority === 'WARNING'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F0F5F6] border-t border-[#DCE5E7] p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#dbebf1] border border-[#DCE5E7] text-xs font-semibold text-[#003643] transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 border border-[#DCE5E7] text-xs font-semibold text-red-600 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Feed</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#003643] hover:bg-[#0E2D36] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            Close Center
          </button>
        </div>
      </div>
    </div>
  );
};
