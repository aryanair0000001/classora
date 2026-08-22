import React, { useState, useEffect } from 'react';
import { Flame, Clock, CheckCircle2, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { Assignment } from '../types/index.js';

interface FireZoneBannerProps {
  urgentAssignment: Assignment | null;
  onOpenDetails: (assignment: Assignment) => void;
  onToggleComplete: (id: string) => void;
}

export const FireZoneBanner: React.FC<FireZoneBannerProps> = ({
  urgentAssignment,
  onOpenDetails,
  onToggleComplete
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isOverdue: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOverdue: false
  });

  useEffect(() => {
    if (!urgentAssignment) return;

    const calculateTime = () => {
      const target = new Date(urgentAssignment.dueDateISO).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        const overdueDiff = Math.abs(diff);
        const hours = Math.floor(overdueDiff / (1000 * 60 * 60));
        const minutes = Math.floor((overdueDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((overdueDiff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isOverdue: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isOverdue: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [urgentAssignment]);

  if (!urgentAssignment) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-indigo-950/70 border border-rose-500/40 p-4 sm:p-5 shadow-xl shadow-rose-950/30">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/30 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                🔥 Fire Zone
              </span>
              <span className="text-xs text-slate-400 font-mono font-medium">
                {urgentAssignment.subjectCode} • {urgentAssignment.subjectName}
              </span>
            </div>
            <h3
              onClick={() => onOpenDetails(urgentAssignment)}
              className="text-base sm:text-lg font-bold text-white hover:text-rose-200 transition-colors cursor-pointer mt-1 flex items-center gap-1.5"
            >
              {urgentAssignment.title}
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              Instructor: <span className="text-slate-300">{urgentAssignment.teacher}</span> • Estimated: {urgentAssignment.estimatedHours}h
            </p>
          </div>
        </div>

        {/* Right Timer & Quick Action */}
        <div className="flex items-center gap-3 sm:gap-4 self-end md:self-center shrink-0">
          
          <div className="text-right">
            <div className="text-[10px] uppercase font-semibold text-rose-300/80 tracking-wider flex items-center justify-end gap-1">
              <Clock className="w-3 h-3" />
              {timeLeft.isOverdue ? 'Overdue By' : 'Time Remaining'}
            </div>
            <div className="font-mono text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1">
              <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-rose-500/30 text-rose-300">
                {pad(timeLeft.hours)}h
              </span>
              <span className="text-rose-400">:</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-rose-500/30 text-rose-300">
                {pad(timeLeft.minutes)}m
              </span>
              <span className="text-rose-400">:</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-950/80 border border-rose-500/30 text-rose-300">
                {pad(timeLeft.seconds)}s
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleComplete(urgentAssignment.id)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            title="Mark as completed"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Done</span>
          </button>

        </div>

      </div>
    </div>
  );
};
