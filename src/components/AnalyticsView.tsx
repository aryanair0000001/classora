import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Award, 
  BarChart3, 
  BookOpen, 
  Calendar,
  AlertTriangle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { StudentAnalytics } from '../types/index.js';
import { api } from '../services/api.js';

export const AnalyticsView: React.FC = () => {
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await api.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-slate-900 rounded-2xl" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Academic Velocity & Performance
            </h1>
            <p className="text-xs text-slate-400">
              Real-time submission analytics, weekly study velocity, and subject proficiency
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Active Semester 4</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        {/* 1. Completion Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Completion Rate</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {analytics.completionRate}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${analytics.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. On-Time Submissions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">On-Time Submissions</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {analytics.onTimeSubmissionRate}%
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Zero late strikes recorded</p>
          </div>
        </div>

        {/* 3. Study Streak */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active Streak</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-orange-400 font-mono flex items-center gap-1.5">
              <span>{analytics.studyStreakDays}</span>
              <span className="text-xs text-slate-400 font-normal">days</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">Daily academic activity</p>
          </div>
        </div>

        {/* 4. Completed Tasks */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Tasks Resolved</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
              {analytics.totalCompletedTasks}
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              {analytics.totalPendingTasks} pending deadlines
            </p>
          </div>
        </div>

      </div>

      {/* Weekly Activity Chart & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Activity Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Weekly Study Velocity
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Hours logged</span>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
              {analytics.weeklyActivity.map((day) => {
                const maxHours = 10;
                const heightPercent = Math.min(100, Math.round((day.hours / maxHours) * 100));
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-mono text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.hours}h
                    </span>
                    <div className="w-full bg-slate-950 rounded-t-lg h-full max-h-32 flex items-end p-0.5">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-md transition-all duration-500 group-hover:brightness-125"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-medium">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Weekly Average: 5.5 hrs/day</span>
            <span className="text-indigo-400">Peak: Saturday (8.2h)</span>
          </div>
        </div>

        {/* Subject Proficiency */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Course Rubric Performance
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Score %</span>
            </div>

            <div className="space-y-4">
              {analytics.subjectPerformance.map((sub) => (
                <div key={sub.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 truncate">{sub.subject}</span>
                    <span className="font-mono font-bold text-white">{sub.score}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${sub.score}%`,
                        backgroundColor: sub.color || '#6366F1'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Highest standing in Design & Analysis of Algorithms (95%)</span>
          </div>
        </div>

      </div>

    </div>
  );
};
