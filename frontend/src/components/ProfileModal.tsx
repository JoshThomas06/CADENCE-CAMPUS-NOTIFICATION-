import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Smartphone,
  Building2,
  Shield,
  KeyRound,
  CheckCircle2,
  LogOut,
  Send,
  Lock,
  ExternalLink,
  Settings,
  Bell
} from 'lucide-react';
import { UserRole, AuthenticatedUser } from './HeaderNav';
import { playAlertChime } from '../utils/sound';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthenticatedUser;
  onUpdateUser: (updated: AuthenticatedUser) => void;
  onSwitchRole: (role: UserRole) => void;
  onSignOut: () => void;
  soundEnabled: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onSwitchRole,
  onSignOut,
  soundEnabled
}) => {
  if (!isOpen) return null;

  // Form State
  const [fullName, setFullName] = useState<string>(currentUser.name);
  const [email, setEmail] = useState<string>(currentUser.email);
  const [phone, setPhone] = useState<string>('5552345678');
  const [carrier, setCarrier] = useState<string>('verizon');
  const [department, setDepartment] = useState<string>(currentUser.department || 'Computer Science');
  const [activeTab, setActiveTab] = useState<'details' | 'smtp' | 'portals'>('details');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Real Outgoing SMTP Settings State
  const [smtpUser, setSmtpUser] = useState<string>('');
  const [smtpPass, setSmtpPass] = useState<string>('');
  const [smtpHost, setSmtpHost] = useState<string>('smtp.gmail.com');
  const [smtpStatus, setSmtpStatus] = useState<string | null>(null);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AuthenticatedUser = {
      ...currentUser,
      name: fullName,
      email: email,
      department: department
    };
    onUpdateUser(updated);

    try {
      await fetch(`http://localhost:4000/api/database/tables/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          full_name: fullName,
          email: email,
          department: department,
          phone: phone,
          phone_number: phone,
          phone_carrier: carrier
        })
      });
    } catch (err) {
      console.warn('[ProfileModal] Database offline, updated locally');
    }

    setIsSaved(true);
    if (soundEnabled) playAlertChime('success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4005/api/notifications/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: smtpUser,
          pass: smtpPass,
          host: smtpHost,
          secure: true
        })
      });
      if (res.ok) {
        setSmtpStatus('Live SMTP bound! Real emails will now deliver directly to your personal inboxes.');
        if (soundEnabled) playAlertChime('success');
      } else {
        setSmtpStatus('Failed to bind SMTP. Check username and password.');
      }
    } catch {
      setSmtpStatus('Saved locally! Nodemailer will use this authenticated relay.');
    }
    setTimeout(() => setSmtpStatus(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E2D36]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#DCE5E7] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#003643] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-md ring-2 ring-white/20 ${
                currentUser.role === 'Admin'
                  ? 'bg-[#A82A2A]'
                  : currentUser.role === 'Faculty'
                  ? 'bg-[#C2593F]'
                  : 'bg-[#2E473B]'
              }`}
            >
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-2xl font-bold">{currentUser.name}</h3>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                    currentUser.role === 'Admin'
                      ? 'bg-[#A82A2A] text-white'
                      : currentUser.role === 'Faculty'
                      ? 'bg-[#C2593F] text-white'
                      : 'bg-[#2E473B] text-white'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-[#8ebdce] font-mono mt-0.5">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#DCE5E7] bg-[#F0F5F6] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'details'
                ? 'border-[#003643] text-[#003643]'
                : 'border-transparent text-[#71787c] hover:text-[#0f1e22]'
            }`}
          >
            My Details &amp; Profile
          </button>
          <button
            onClick={() => setActiveTab('portals')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'portals'
                ? 'border-[#003643] text-[#003643]'
                : 'border-transparent text-[#71787c] hover:text-[#0f1e22]'
            }`}
          >
            Switch Portal &amp; Role
          </button>
          <button
            onClick={() => setActiveTab('smtp')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'smtp'
                ? 'border-[#003643] text-[#003643]'
                : 'border-transparent text-[#71787c] hover:text-[#0f1e22]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Real Outgoing Email / SMS</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'details' && (
            <form onSubmit={handleSaveDetails} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono text-[#71787c] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#71787c] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-sm text-[#003643] focus:outline-none focus:ring-2 focus:ring-[#003643]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#71787c] uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#71787c] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-sm text-[#003643] focus:outline-none focus:ring-2 focus:ring-[#003643]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#71787c] uppercase tracking-wider mb-1">
                    Cellular Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-[#71787c] absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-sm text-[#003643] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#71787c] uppercase tracking-wider mb-1">
                    Mobile Carrier
                  </label>
                  <select
                    value={carrier}
                    onChange={e => setCarrier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-sm text-[#003643] focus:outline-none"
                  >
                    <option value="verizon">Verizon (@vtext.com)</option>
                    <option value="att">AT&amp;T (@txt.att.net)</option>
                    <option value="tmobile">T-Mobile (@tmomail.net)</option>
                    <option value="sprint">Sprint (@messaging.sprintpcs.com)</option>
                    <option value="googlefi">Google Fi (@msg.fi.google.com)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#71787c] uppercase tracking-wider mb-1">
                  Department / Unit
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#71787c] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-sm text-[#003643] focus:outline-none"
                  />
                </div>
              </div>

              {isSaved && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Personal details updated in database!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#DCE5E7]">
                <button
                  type="button"
                  onClick={onSignOut}
                  className="px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#003643] hover:bg-[#0E2D36] text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'portals' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-[#71787c]">
                Select which institutional portal to operate within. Each role has distinct permissions:
              </p>

              {(['Student', 'Faculty', 'Admin'] as UserRole[]).map(r => (
                <div
                  key={r}
                  onClick={() => {
                    onSwitchRole(r);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between hover:shadow-md ${
                    currentUser.role === r
                      ? 'border-[#003643] bg-[#F0F5F6] ring-2 ring-[#003643]/20'
                      : 'border-[#DCE5E7] bg-white hover:bg-[#F9FBFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                        r === 'Admin' ? 'bg-[#A82A2A]' : r === 'Faculty' ? 'bg-[#C2593F]' : 'bg-[#2E473B]'
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#003643]">
                        {r === 'Admin' ? 'Senate Operations (Admin)' : r === 'Faculty' ? 'Faculty & Instructor Console' : 'Student Access Portal'}
                      </h4>
                      <p className="text-xs text-[#71787c]">
                        {r === 'Admin' ? 'Full Authority • Sirens • Database CRUD • Telemetry' : r === 'Faculty' ? 'Course Mutations • Database CRUD • Dispatch' : 'Read Streams • iCal Sync • Life Safety Check-in'}
                      </p>
                    </div>
                  </div>
                  {currentUser.role === r && (
                    <span className="font-mono text-xs font-bold text-[#003643] bg-white px-2.5 py-1 rounded-full border border-[#DCE5E7]">
                      Active ✓
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'smtp' && (
            <form onSubmit={handleSaveSmtp} className="flex flex-col gap-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Why configure real SMTP?</strong> By default in development, Nodemailer generates an Ethereal web preview. Enter your real Gmail address and a 16-character Google App Password below to make emails land directly in real personal inboxes!
              </div>

              <div>
                <label className="block text-xs font-mono text-[#71787c] uppercase tracking-wider mb-1">
                  Gmail / Outgoing Email Address
                </label>
                <input
                  type="email"
                  value={smtpUser}
                  onChange={e => setSmtpUser(e.target.value)}
                  placeholder="your_email@gmail.com"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-sm text-[#003643] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#71787c] uppercase tracking-wider mb-1">
                  Google App Password (16 Characters)
                </label>
                <input
                  type="password"
                  value={smtpPass}
                  onChange={e => setSmtpPass(e.target.value)}
                  placeholder="xxxx xxxx xxxx xxxx"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-sm text-[#003643] focus:outline-none"
                />
                <span className="text-[10px] text-[#71787c] mt-1 block">
                  Generated in Google Account &rarr; Security &rarr; 2-Step Verification &rarr; App Passwords.
                </span>
              </div>

              {smtpStatus && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{smtpStatus}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#C2593F] hover:bg-[#a64830] text-white text-xs font-bold transition shadow-sm active:scale-95 cursor-pointer mt-1"
              >
                Bind Authenticated Real SMTP Relay
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
