import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Fingerprint,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserRole } from '../HeaderNav';
import { playAlertChime } from '../../utils/sound';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  token?: string;
}

interface AuthScreenProps {
  onLoginSuccess: (user: AuthenticatedUser) => void;
  onCancel?: () => void;
  soundEnabled?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onCancel,
  soundEnabled = true,
}) => {
  const [activePortal, setActivePortal] = useState<UserRole>('Student');
  const [email, setEmail] = useState<string>('student@campus.edu');
  const [password, setPassword] = useState<string>('student123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Portal Configurations
  const portals: Record<
    UserRole,
    {
      title: string;
      subtitle: string;
      accentColor: string;
      badgeColor: string;
      icon: React.ReactNode;
      demoUser: {
        email: string;
        pass: string;
        name: string;
        id: string;
        dept: string;
        accessSummary: string;
      };
      perks: string[];
    }
  > = {
    Student: {
      title: 'Student Access Portal',
      subtitle: 'Undergraduate & Graduate Student Information System',
      accentColor: 'border-[#003643]',
      badgeColor: 'bg-[#003643] text-white',
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      demoUser: {
        email: 'student@campus.edu',
        pass: 'student123',
        name: 'Alex Rivera (Maya Lin)',
        id: 'STU-2026-881',
        dept: 'Computer Science & Architecture',
        accessSummary: 'Read-only Live Streams • iCal Sync • Wayfinding • Life-Safety Check-In'
      },
      perks: [
        'Personalized CS401 & ARCH310 live course mutation streams',
        'RFC 5545 iCalendar (.ics) one-click alarm export',
        'Offline SVG indoor architectural blueprints & wheelchair routing',
        'Emergency weather flash "I Am Safe" one-click check-in'
      ]
    },
    Faculty: {
      title: 'Faculty & Instructor Console',
      subtitle: 'Departmental Faculty, Lab Directors & Academic Chairs',
      accentColor: 'border-[#C2593F]',
      badgeColor: 'bg-[#C2593F] text-white',
      icon: <Briefcase className="w-6 h-6 text-white" />,
      demoUser: {
        email: 'faculty@campus.edu',
        pass: 'faculty123',
        name: 'Dr. Sarah Lin (Dr. Julian Vance)',
        id: 'FAC-104-VANCE',
        dept: 'Department of Computer Science',
        accessSummary: 'Course Alert Authoring • Kafka class-updates & exam-updates • Roster Reach'
      },
      perks: [
        'Cancel classes and dispatch instant venue relocations to Kafka (:9092)',
        'Reschedule examinations and reallocate auditorium seating',
        'Real-time enrolled student Blast Radius audience calculator',
        'Inspect enrolled subscriber device tokens and Web Push states'
      ]
    },
    Admin: {
      title: 'Senate Operations & SysAdmin',
      subtitle: 'University Provost, Campus Safety & Infrastructure Engineers',
      accentColor: 'border-[#A82A2A]',
      badgeColor: 'bg-[#A82A2A] text-white',
      icon: <ShieldAlert className="w-6 h-6 text-white" />,
      demoUser: {
        email: 'admin@campus.edu',
        pass: 'admin123',
        name: 'Dr. Dean Vance (Dean Sterling)',
        id: 'ADM-001-STERLING',
        dept: 'Campus Administration & Senate Ops',
        accessSummary: 'Emergency Flash Sirens • KRaft Broker Telemetry • Full Cluster Control'
      },
      perks: [
        'Broadcast university-wide CRITICAL_FLASH Emergency Sirens',
        'Direct Apache Kafka KRaft partition watermark & consumer lag inspect',
        'Execute dry-run dispatch simulations across Tri-Fanout channels',
        'Dead-letter queue inspection and dead message re-drive authority'
      ]
    }
  };

  const handlePortalSwitch = (portal: UserRole) => {
    setActivePortal(portal);
    setEmail(portals[portal].demoUser.email);
    setPassword(portals[portal].demoUser.pass);
    setErrorMessage(null);
    if (soundEnabled) playAlertChime('info');
  };

  const handleQuickFillAndLogin = (portal: UserRole) => {
    setActivePortal(portal);
    setEmail(portals[portal].demoUser.email);
    setPassword(portals[portal].demoUser.pass);
    executeLogin(portals[portal].demoUser.email, portals[portal].demoUser.pass, portal);
  };

  const executeLogin = async (loginEmail: string, loginPass: string, expectedRole: UserRole) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Try real backend API Gateway authentication endpoint
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });

      if (response.ok) {
        const data = await response.json();
        const authedUser: AuthenticatedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.full_name || portals[expectedRole].demoUser.name,
          role: data.user.role === 'ADMIN' ? 'Admin' : data.user.role === 'FACULTY' ? 'Faculty' : 'Student',
          department: data.user.department,
          token: data.token
        };

        if (soundEnabled) playAlertChime('info');
        onLoginSuccess(authedUser);
        return;
      }
    } catch (err) {
      console.warn('[Auth] Gateway offline, verifying against pre-seeded credentials fallback...');
    }

    // 2. Offline deterministic credential verification fallback
    const expectedDemo = portals[expectedRole].demoUser;
    if (loginEmail.toLowerCase() === expectedDemo.email.toLowerCase() && loginPass === expectedDemo.pass) {
      const authedUser: AuthenticatedUser = {
        id: expectedDemo.id,
        email: expectedDemo.email,
        name: expectedDemo.name,
        role: expectedRole,
        department: expectedDemo.dept,
        token: `jwt_mock_${expectedRole.toLowerCase()}_token_2026`
      };

      if (soundEnabled) playAlertChime('info');
      onLoginSuccess(authedUser);
    } else {
      setErrorMessage(`Invalid credentials for ${expectedRole} portal. Please check email and password or use the 1-Click Demo Login.`);
      if (soundEnabled) playAlertChime('urgent');
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin(email, password, activePortal);
  };

  const currentPortalConfig = portals[activePortal];

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
        {/* Top Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C2593F] animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#C2593F] font-bold">
              Identity &amp; Access Governance
            </span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-[#003643]">
            Cadence Campus Authentication Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#41484b] max-w-xl">
            Select your institutional affiliation below to authenticate into your dedicated role workspace.
          </p>
        </div>

        {/* 3 Portal Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['Student', 'Faculty', 'Admin'] as UserRole[]).map((portalKey) => {
            const p = portals[portalKey];
            const isSelected = activePortal === portalKey;
            return (
              <button
                key={portalKey}
                type="button"
                onClick={() => handlePortalSwitch(portalKey)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? `bg-white shadow-md ring-2 ring-[#003643] ${p.accentColor}`
                    : 'bg-[#F0F5F6]/70 border-[#DCE5E7] hover:bg-white text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${
                      portalKey === 'Admin'
                        ? 'bg-[#A82A2A]'
                        : portalKey === 'Faculty'
                        ? 'bg-[#C2593F]'
                        : 'bg-[#003643]'
                    }`}
                  >
                    {p.icon}
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      isSelected ? p.badgeColor : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {portalKey}
                  </span>
                </div>

                <div>
                  <span className="font-editorial text-base font-bold text-[#003643] block">
                    {p.title}
                  </span>
                  <span className="text-[11px] text-[#71787c] block mt-0.5 leading-snug">
                    {p.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Portal Login Container */}
        <div className="bg-white rounded-3xl border border-[#DCE5E7] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Role Details & Sample Account (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0E2D36] text-white p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#ffdeae] uppercase tracking-wider font-semibold">
                  Authorized Role Profile
                </span>
              </div>
              <h2 className="font-editorial text-2xl font-bold text-white">
                {currentPortalConfig.title}
              </h2>
              <p className="text-xs text-[#8ebdce] leading-relaxed">
                {currentPortalConfig.subtitle}
              </p>

              {/* Portal Perks List */}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <span className="text-[11px] font-mono text-[#ffdeae] font-bold">
                  Included Privileges:
                </span>
                {currentPortalConfig.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#dbebf1]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D99B26] shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pre-Seeded Sample Account Box */}
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#ffdeae] font-bold flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Sample Test Account</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  Pre-Configured
                </span>
              </div>

              <div className="font-mono text-xs space-y-1 text-[#dbebf1]">
                <div>Email: <strong className="text-white">{currentPortalConfig.demoUser.email}</strong></div>
                <div>Password: <strong className="text-white">{currentPortalConfig.demoUser.pass}</strong></div>
                <div>Persona: <strong className="text-white">{currentPortalConfig.demoUser.name}</strong></div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickFillAndLogin(activePortal)}
                className="w-full mt-1 py-2 px-3 rounded-xl bg-[#D99B26] text-[#001f28] font-mono text-xs font-bold hover:bg-[#e6a835] transition duration-200 active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>⚡ 1-Click Login as {activePortal}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Login Form (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#003643]">
                  Sign In to {activePortal} Console
                </h3>
                <p className="text-xs text-[#71787c] mt-0.5">
                  Institutional Single Sign-On • Zero-drop Kafka Session Verification
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-bold text-[#003643]">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={currentPortalConfig.demoUser.email}
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-mono rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003643] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-[#003643]">
                    Portal Password
                  </label>
                  <span className="text-[10px] font-mono text-[#71787c]">
                    Demo: <code>{currentPortalConfig.demoUser.pass}</code>
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs font-mono rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003643] bg-[#FAF7F2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl text-white font-mono text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 ${
                  activePortal === 'Admin'
                    ? 'bg-[#A82A2A] hover:bg-red-700'
                    : activePortal === 'Faculty'
                    ? 'bg-[#C2593F] hover:bg-[#a04028]'
                    : 'bg-[#003643] hover:bg-[#133945]'
                }`}
              >
                {isLoading ? (
                  <span>Authenticating via API Gateway (:4000)...</span>
                ) : (
                  <>
                    <span>Authenticate &amp; Launch {activePortal} Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Portal Switcher & Cancel Links */}
            <div className="pt-4 border-t border-[#DCE5E7] flex items-center justify-between text-xs font-mono text-[#71787c]">
              <span>Need another role?</span>
              <div className="flex items-center gap-2">
                {(['Student', 'Faculty', 'Admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handlePortalSwitch(r)}
                    className={`hover:underline cursor-pointer ${
                      activePortal === r ? 'font-bold text-[#003643]' : ''
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
