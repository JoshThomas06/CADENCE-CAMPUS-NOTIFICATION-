import React, { useState, useEffect } from 'react';
import { HeaderNav, ScreenId, UserRole, AuthenticatedUser } from './components/HeaderNav';
import { LiveStreamScreen } from './components/screens/LiveStreamScreen';
import { KafkaTelemetryScreen } from './components/screens/KafkaTelemetryScreen';
import { EventDispatcherScreen } from './components/screens/EventDispatcherScreen';
import { DatabaseScreen } from './components/screens/DatabaseScreen';
import { SubscribersScreen } from './components/screens/SubscribersScreen';
import { LandingScreen } from './components/screens/LandingScreen';
import { GuideScreen } from './components/screens/GuideScreen';
import { CalendarScreen } from './components/screens/CalendarScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { ProfileModal } from './components/ProfileModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { Footer } from './components/Footer';
import { playAlertChime } from './utils/sound';
import { io } from 'socket.io-client';
import { Shield, Lock } from 'lucide-react';

export default function App() {
  // Gating state: initially unauthenticated so only Landing and Login/Register work
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('landing');
  const [role, setRole] = useState<UserRole>('Faculty');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);

  // Modals state
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(3);

  // Navigation Guard: if not authenticated, only 'landing' and 'auth' are permitted
  const handleNavigate = (targetScreen: ScreenId) => {
    if (!isAuthenticated && targetScreen !== 'landing' && targetScreen !== 'auth') {
      if (soundEnabled) playAlertChime('warning');
      setCurrentScreen('auth');
      return;
    }
    setCurrentScreen(targetScreen);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'Student') {
      setCurrentUser({
        id: 'usr_student_003',
        email: 'student@campus.edu',
        name: 'Alex Rivera (Maya Lin)',
        role: 'Student',
        department: 'Computer Science & Architecture'
      });
    } else if (newRole === 'Faculty') {
      setCurrentUser({
        id: 'usr_faculty_002',
        email: 'faculty@campus.edu',
        name: 'Dr. Sarah Lin (Dr. Julian Vance)',
        role: 'Faculty',
        department: 'Department of Computer Science'
      });
    } else {
      setCurrentUser({
        id: 'usr_admin_001',
        email: 'admin@campus.edu',
        name: 'Dean Sterling',
        role: 'Admin',
        department: 'Senate Operations & Campus Safety'
      });
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentScreen('landing');
    setProfileModalOpen(false);
    if (soundEnabled) playAlertChime('info');
  };

  // Background Socket.IO listener for live campus events
  useEffect(() => {
    const socket = io('http://localhost:4005', {
      query: {
        userId: currentUser?.id || 'usr_anonymous',
        role: role
      },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('[Socket.IO] Connected to Notification Engine (:4005) as', role);
    });

    socket.on('cadence:alert', (payload) => {
      console.log('[Socket.IO] Live alert received:', payload);
      setUnreadCount(prev => prev + 1);
      if (soundEnabled) {
        if (payload.data?.priority === 'CRITICAL') {
          playAlertChime('urgent');
        } else {
          playAlertChime('info');
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [role, soundEnabled, currentUser]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F4] text-[#0f1e22] antialiased">
      {/* Persistent Navigation Bar with Role Access Control & Modal Triggers */}
      <HeaderNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        role={role}
        onRoleChange={handleRoleChange}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onOpenProfile={() => {
          if (isAuthenticated) {
            setProfileModalOpen(true);
          } else {
            setCurrentScreen('auth');
          }
        }}
        onOpenNotifications={() => setNotificationsModalOpen(true)}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 pt-20">
        {currentScreen === 'landing' && (
          <LandingScreen
            onNavigateToLive={() => handleNavigate('live-stream')}
            onNavigateToDispatcher={() => handleNavigate('event-dispatcher')}
            onNavigateToCalendar={() => handleNavigate('calendar')}
            soundEnabled={soundEnabled}
          />
        )}

        {currentScreen === 'live-stream' && isAuthenticated && (
          <LiveStreamScreen
            soundEnabled={soundEnabled}
            role={role}
            onNavigateToDispatcher={() => handleNavigate('event-dispatcher')}
            onNavigateToCalendar={() => handleNavigate('calendar')}
          />
        )}

        {currentScreen === 'calendar' && isAuthenticated && (
          <CalendarScreen
            soundEnabled={soundEnabled}
            onNavigateToLive={() => handleNavigate('live-stream')}
            onNavigateToDispatcher={() => handleNavigate('event-dispatcher')}
          />
        )}

        {currentScreen === 'event-dispatcher' && isAuthenticated && (
          role === 'Student' ? (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="font-editorial text-3xl font-bold text-[#003643]">
                Faculty &amp; Senate Access Restricted
              </h2>
              <p className="text-sm text-[#41484b] max-w-md leading-relaxed">
                As a Student (Maya Lin), you have read-only access to course alerts, iCal sync, and safety check-ins. Publishing alerts requires Faculty or Administrator credentials.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('Faculty')}
                  className="px-4 py-2 rounded-xl bg-[#C2593F] text-white text-xs font-bold hover:bg-[#a04028] transition active:scale-95 cursor-pointer shadow-sm"
                >
                  Switch to Faculty Role
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('live-stream')}
                  className="px-4 py-2 rounded-xl bg-[#F0F5F6] text-[#003643] text-xs font-semibold hover:bg-[#dbebf1] transition cursor-pointer"
                >
                  Return to Live Alerts
                </button>
              </div>
            </div>
          ) : (
            <EventDispatcherScreen
              soundEnabled={soundEnabled}
              role={role}
              onNavigateToDatabase={() => setCurrentScreen('database-crud')}
            />
          )
        )}

        {/* Database & CRUD Operations Screen */}
        {currentScreen === 'database-crud' && isAuthenticated && (
          <DatabaseScreen
            soundEnabled={soundEnabled}
          />
        )}

        {currentScreen === 'kafka-telemetry' && isAuthenticated && (
          role !== 'Admin' ? (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="font-editorial text-3xl font-bold text-[#003643]">
                Senate Operations Authority Required
              </h2>
              <p className="text-sm text-[#41484b] max-w-md leading-relaxed">
                Raw Apache Kafka cluster partition watermarks, consumer lag topologies, and commit-log inspectors are restricted to institutional administrators (Dean Sterling).
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('Admin')}
                  className="px-4 py-2 rounded-xl bg-[#A82A2A] text-white text-xs font-bold hover:bg-red-700 transition active:scale-95 cursor-pointer shadow-sm"
                >
                  Switch to Admin Role
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentScreen('live-stream')}
                  className="px-4 py-2 rounded-xl bg-[#F0F5F6] text-[#003643] text-xs font-semibold hover:bg-[#dbebf1] transition cursor-pointer"
                >
                  Return to Live Alerts
                </button>
              </div>
            </div>
          ) : (
            <KafkaTelemetryScreen
              soundEnabled={soundEnabled}
            />
          )
        )}

        {currentScreen === 'subscribers' && isAuthenticated && (
          <SubscribersScreen
            soundEnabled={soundEnabled}
          />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setRole(user.role);
              setIsAuthenticated(true);
              if (user.role === 'Student') {
                setCurrentScreen('live-stream');
              } else if (user.role === 'Faculty') {
                setCurrentScreen('event-dispatcher');
              } else {
                setCurrentScreen('database-crud');
              }
            }}
            onCancel={() => setCurrentScreen('landing')}
            soundEnabled={soundEnabled}
          />
        )}

        {currentScreen === 'guide' && isAuthenticated && (
          <GuideScreen
            soundEnabled={soundEnabled}
            onNavigateToLive={() => handleNavigate('live-stream')}
            onNavigateToDispatcher={() => handleNavigate('event-dispatcher')}
            onSetRole={handleRoleChange}
          />
        )}
      </div>

      {/* Profile & Settings Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          currentUser={currentUser}
          onUpdateUser={(updated) => {
            setCurrentUser(updated);
          }}
          onSwitchRole={(newRole) => {
            handleRoleChange(newRole);
          }}
          onSignOut={handleSignOut}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Live Notification Center Modal */}
      <NotificationCenterModal
        isOpen={notificationsModalOpen}
        onClose={() => {
          setNotificationsModalOpen(false);
          setUnreadCount(0);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
