/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeaderNav, ScreenId, UserRole } from './components/HeaderNav';
import { LiveStreamScreen } from './components/screens/LiveStreamScreen';
import { KafkaTelemetryScreen } from './components/screens/KafkaTelemetryScreen';
import { EventDispatcherScreen } from './components/screens/EventDispatcherScreen';
import { SubscribersScreen } from './components/screens/SubscribersScreen';
import { LandingScreen } from './components/screens/LandingScreen';
import { MarkdownCenterScreen } from './components/screens/MarkdownCenterScreen';
import { MarkdownViewerModal } from './components/MarkdownViewerModal';
import { Footer } from './components/Footer';
import { Download, FileText } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('live-stream');
  const [role, setRole] = useState<UserRole>('Faculty');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState<boolean>(false);
  const [modalFileId, setModalFileId] = useState<string>('01-live-stream-alerts.md');

  const handleOpenMarkdownModal = (fileId?: string) => {
    if (fileId) {
      setModalFileId(fileId);
    } else {
      // Default to matching the current screen
      if (currentScreen === 'live-stream') setModalFileId('01-live-stream-alerts.md');
      else if (currentScreen === 'kafka-telemetry') setModalFileId('02-kafka-topics-telemetry.md');
      else if (currentScreen === 'event-dispatcher') setModalFileId('03-event-dispatcher.md');
      else if (currentScreen === 'subscribers') setModalFileId('04-subscribers-preferences.md');
      else if (currentScreen === 'landing') setModalFileId('05-landing-page.md');
      else setModalFileId('00-design-system.md');
    }
    setIsMarkdownModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F4] text-[#0f1e22] antialiased">
      {/* Persistent Navigation Bar */}
      <HeaderNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        role={role}
        onRoleChange={setRole}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenMarkdownModal={handleOpenMarkdownModal}
      />

      {/* Main Content Area */}
      <div className="flex-1 pt-20">
        {currentScreen === 'live-stream' && (
          <LiveStreamScreen
            onOpenMarkdownModal={handleOpenMarkdownModal}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'kafka-telemetry' && (
          <KafkaTelemetryScreen
            onOpenMarkdownModal={handleOpenMarkdownModal}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'event-dispatcher' && (
          <EventDispatcherScreen
            onOpenMarkdownModal={handleOpenMarkdownModal}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'subscribers' && (
          <SubscribersScreen
            onOpenMarkdownModal={handleOpenMarkdownModal}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'landing' && (
          <LandingScreen
            onOpenMarkdownModal={handleOpenMarkdownModal}
            onNavigateToLive={() => setCurrentScreen('live-stream')}
            soundEnabled={soundEnabled}
          />
        )}
        {currentScreen === 'markdown-center' && (
          <MarkdownCenterScreen
            onOpenViewer={handleOpenMarkdownModal}
            soundEnabled={soundEnabled}
          />
        )}
      </div>

      {/* Bottom Floating Quick-Access MD Dock */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-2">
        <button
          onClick={() => handleOpenMarkdownModal()}
          className="px-3.5 py-2 rounded-full bg-[#003643]/90 hover:bg-[#003643] backdrop-blur-md text-white text-xs font-mono font-bold shadow-xl flex items-center gap-2 border border-white/20 transition hover:scale-105 active:scale-95"
          title="Open downloadable screen Markdown documentation"
        >
          <FileText className="w-3.5 h-3.5 text-[#ffdeae]" />
          <span>Screen MD Spec</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D99B26]"></span>
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Interactive Markdown Viewer & Downloader Modal */}
      <MarkdownViewerModal
        isOpen={isMarkdownModalOpen}
        onClose={() => setIsMarkdownModalOpen(false)}
        initialFileId={modalFileId}
      />
    </div>
  );
}
