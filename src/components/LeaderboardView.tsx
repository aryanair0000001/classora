import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  Star,
  Users,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { LeaderboardEntry } from '../types/index.js';
import { api } from '../services/api.js';

interface LeaderboardViewProps {
  currentUserId?: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUserId }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await api.getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [timeframe]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/40 border border-amber-500/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 rounded-xl text-slate-950 shadow-lg shadow-amber-500/30">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Academic Cohort Standings
            </h1>
            <p className="text-xs text-slate-400">
              Fair academic XP earned via on-time assignment completions, study streaks & peer notes
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              timeframe === 'weekly' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Sprint
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              timeframe === 'monthly' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('allTime')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              timeframe === 'allTime' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      {!isLoading && top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-6 pb-2">
          
          {/* 2nd Place (Silver) */}
          <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center shadow-lg relative order-1 h-[210px] justify-between">
            <div className="absolute -top-3.5 px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-200 text-[10px] font-bold font-mono border border-slate-600">
              #2 Silver
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 text-white flex items-center justify-center font-bold text-sm shadow-md mt-2">
              {top3[1].name[0]}
            </div>
            <div className="mt-1">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px] sm:max-w-full">
                {top3[1].name}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">{top3[1].rollNo}</p>
            </div>
            <div className="w-full bg-slate-950/60 rounded-xl py-1.5 px-2 border border-slate-800/80 mt-1">
              <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">{top3[1].xp} XP</span>
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-0.5">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>{top3[1].streakDays}d streak</span>
              </div>
            </div>
          </div>

          {/* 1st Place (Gold) */}
          <div className="bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-2xl p-3 sm:p-5 flex flex-col items-center text-center shadow-xl relative order-2 h-[240px] justify-between scale-105 z-10">
            <div className="absolute -top-4 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black font-mono shadow-md flex items-center gap-1">
              <CrownIcon className="w-3.5 h-3.5" /> #1 Champion
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-base shadow-lg shadow-amber-500/40 mt-3 ring-4 ring-amber-500/20">
              {top3[0].name[0]}
            </div>
            <div className="mt-1">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-full">
                {top3[0].name}
              </h3>
              <p className="text-[10px] text-amber-400/90 font-mono font-semibold">{top3[0].badge}</p>
            </div>
            <div className="w-full bg-slate-950/90 rounded-xl py-2 px-2 border border-amber-500/30 mt-1">
              <span className="text-sm sm:text-base font-black text-amber-400 font-mono">{top3[0].xp} XP</span>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-400 mt-0.5 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                <span>{top3[0].onTimeRate}% On-Time</span>
              </div>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="bg-slate-900/80 border border-amber-900/40 rounded-2xl p-3 sm:p-4 flex flex-col items-center text-center shadow-lg relative order-3 h-[195px] justify-between">
            <div className="absolute -top-3.5 px-2.5 py-0.5 rounded-full bg-amber-900/80 text-amber-300 text-[10px] font-bold font-mono border border-amber-800/40">
              #3 Bronze
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md mt-2">
              {top3[2].name[0]}
            </div>
            <div className="mt-1">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px] sm:max-w-full">
                {top3[2].name}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">{top3[2].rollNo}</p>
            </div>
            <div className="w-full bg-slate-950/60 rounded-xl py-1.5 px-2 border border-slate-800/80 mt-1">
              <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">{top3[2].xp} XP</span>
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-0.5">
                <Flame className="w-3 h-3 text-orange-400" />
                <span>{top3[2].streakDays}d streak</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Roster Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Cohort Roster Rankings
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {leaderboard.length} Enrolled Students
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {leaderboard.map((student) => {
            const isUser = student.userId === currentUserId || student.userId === 'user-default-01';
            return (
              <div
                key={student.userId}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  isUser ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black font-mono shrink-0 ${
                    student.rank === 1 ? 'bg-amber-500 text-slate-950' :
                    student.rank === 2 ? 'bg-slate-600 text-white' :
                    student.rank === 3 ? 'bg-amber-800 text-amber-100' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {student.rank}
                  </div>

                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-200 shrink-0">
                    {student.name[0]}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {student.name}
                      </span>
                      {isUser && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] font-bold border border-indigo-500/30">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{student.rollNo}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{student.onTimeRate}% on-time</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div className="hidden sm:block">
                    <span className="text-[11px] text-slate-400 font-mono block">Streak</span>
                    <span className="text-xs text-orange-400 font-mono font-bold flex items-center gap-1 justify-end">
                      <Flame className="w-3 h-3" /> {student.streakDays}d
                    </span>
                  </div>

                  <div>
                    <span className="text-xs sm:text-sm font-black text-amber-400 font-mono block">
                      {student.xp} XP
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {student.completedAssignments} tasks done
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Footer */}
      <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-white">How Academic XP is Awarded</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Students earn <strong className="text-amber-400">+100 XP</strong> for every assignment submitted before deadline, <strong className="text-amber-400">+50 XP</strong> for daily study streaks, and <strong className="text-amber-400">+30 XP</strong> when verified peer study notes are published.
          </p>
        </div>
      </div>

    </div>
  );
};

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}
