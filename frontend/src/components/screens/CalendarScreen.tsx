import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Layers,
  MapPin,
  AlertTriangle,
  Info,
  CheckCircle,
  Radio,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Filter,
  Activity,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { MonthlyAlertCalendar, AlertCategory } from '../MonthlyAlertCalendar';
import { playAlertChime } from '../../utils/sound';

interface CalendarScreenProps {
  soundEnabled?: boolean;
  onNavigateToLive: () => void;
  onNavigateToDispatcher?: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  soundEnabled = true,
  onNavigateToLive,
  onNavigateToDispatcher,
}) => {
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<'all' | 'class-updates' | 'exam-updates' | 'general-events'>('all');

  // Simulated metrics for the extensive analytics view
  const categoryStats = [
    {
      title: 'Class Mutations',
      topic: 'class-updates',
      count: 182,
      share: '52.3%',
      color: '#C2593F',
      bgLight: 'bg-[#C2593F]/10',
      border: 'border-[#C2593F]/30',
      description: 'Room relocations, cancellations & lab shifts'
    },
    {
      title: 'Exam Shifts',
      topic: 'exam-updates',
      count: 114,
      share: '32.8%',
      color: '#D99B26',
      bgLight: 'bg-[#D99B26]/10',
      border: 'border-[#D99B26]/30',
      description: 'Auditorium reallocations & midterm updates'
    },
    {
      title: 'Safety Flashes',
      topic: 'general-events',
      count: 52,
      share: '14.9%',
      color: '#A82A2A',
      bgLight: 'bg-[#A82A2A]/10',
      border: 'border-[#A82A2A]/30',
      description: 'Severe weather warnings & safety directives'
    }
  ];

  // Hourly timeline distribution
  const hourlyThroughput = [
    { hour: '08:00', count: 18, peak: false },
    { hour: '09:00', count: 42, peak: true },
    { hour: '10:00', count: 38, peak: false },
    { hour: '11:00', count: 56, peak: true },
    { hour: '12:00', count: 24, peak: false },
    { hour: '13:00', count: 31, peak: false },
    { hour: '14:00', count: 49, peak: true },
    { hour: '15:00', count: 45, peak: false },
    { hour: '16:00', count: 29, peak: false },
    { hour: '17:00', count: 16, peak: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 animate-fadeIn">
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DCE5E7]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#71787c]">
            <button
              type="button"
              onClick={onNavigateToLive}
              className="hover:text-[#003643] flex items-center gap-1 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Live Alerts Feed</span>
            </button>
            <span>/</span>
            <span className="text-[#003643] font-semibold">Extensive Calendar &amp; Statistics</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#003643] text-white flex items-center justify-center shadow-sm">
              <CalendarIcon className="w-5 h-5 text-[#ffdeae]" />
            </span>
            <div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#003643]">
                Academic Incident &amp; Dispatch Calendar
              </h1>
              <p className="text-xs sm:text-sm text-[#41484b] mt-0.5">
                Comprehensive multi-month incident density, Kafka event velocity, and daily chronological timeline records.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            type="button"
            onClick={onNavigateToLive}
            className="px-4 py-2 rounded-xl bg-[#F0F5F6] border border-[#DCE5E7] text-xs font-mono font-bold text-[#003643] hover:bg-[#dbebf1] transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>Live Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {onNavigateToDispatcher && (
            <button
              type="button"
              onClick={onNavigateToDispatcher}
              className="px-4 py-2 rounded-xl bg-[#C2593F] text-white text-xs font-mono font-bold hover:bg-[#a04028] transition active:scale-95 cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>+ Push Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Dispatches */}
        <div className="p-5 rounded-2xl bg-white border border-[#DCE5E7] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE5E7]">
            <span className="text-xs font-mono text-[#71787c]">Monthly Total</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#003643] animate-pulse"></span>
          </div>
          <div className="pt-3">
            <span className="font-editorial text-3xl font-bold text-[#003643]">348</span>
            <span className="text-xs text-[#71787c] block mt-0.5">Dispatched Events (October 2026)</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#DCE5E7] text-[11px] font-mono text-[#2E473B] flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>100% Zero-Drop Delivery</span>
          </div>
        </div>

        {/* Dynamic Category Cards */}
        {categoryStats.map(stat => (
          <div
            key={stat.topic}
            className={`p-5 rounded-2xl bg-white border ${stat.border} shadow-sm flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE5E7]">
              <span className="text-xs font-mono font-bold" style={{ color: stat.color }}>
                {stat.title}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${stat.bgLight}`} style={{ color: stat.color }}>
                {stat.share}
              </span>
            </div>
            <div className="pt-3">
              <span className="font-editorial text-3xl font-bold" style={{ color: stat.color }}>
                {stat.count}
              </span>
              <span className="text-xs text-[#71787c] block mt-0.5">{stat.description}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-[#DCE5E7] text-[11px] font-mono text-[#71787c]">
              Topic: <code>{stat.topic}</code>
            </div>
          </div>
        ))}
      </div>

      {/* 3. EXTENSIVE CALENDAR CONTAINER */}
      <div className="w-full">
        <MonthlyAlertCalendar
          soundEnabled={soundEnabled}
          isExtensiveView={true}
        />
      </div>

      {/* 4. HOURLY DISPATCH THROUGHPUT VELOCITY */}
      <div className="p-6 rounded-2xl bg-white border border-[#DCE5E7] shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#DCE5E7]">
          <div>
            <h3 className="font-editorial text-xl font-bold text-[#003643]">
              Hourly Broker Dispatch Throughput (Average Day Profile)
            </h3>
            <p className="text-xs text-[#71787c]">
              Distribution of event commits to Kafka topic partitions throughout academic instructional hours.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#71787c]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#C2593F]"></span>
            <span>Peak Broadcast Slots: 09:00, 11:00, 14:00</span>
          </div>
        </div>

        {/* Bar chart representation */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 pt-2">
          {hourlyThroughput.map(slot => {
            const heightPercent = Math.min(100, Math.max(15, (slot.count / 60) * 100));
            return (
              <div key={slot.hour} className="flex flex-col items-center gap-2">
                <div className="w-full h-28 bg-[#F0F5F6] rounded-xl relative flex flex-col justify-end p-1 border border-[#DCE5E7]">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-lg transition-all duration-300 ${
                      slot.peak ? 'bg-[#C2593F]' : 'bg-[#003643]'
                    }`}
                  ></div>
                </div>
                <div className="text-center font-mono">
                  <span className="text-[11px] font-bold text-[#003643] block">{slot.count}</span>
                  <span className="text-[10px] text-[#71787c] block">{slot.hour}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
