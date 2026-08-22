import React from 'react';
import {
  Search,
  Bell,
  Plus,
  Send,
  Users,
  Calendar as CalendarIcon,
  ChevronDown,
  Sparkles,
  Download,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { ClassCohort, Role, AppNotification } from '../types/index.js';
import { api } from '../services/api.js';

interface HeaderProps {
  cohort: ClassCohort | null;
  enrolledClasses: ClassCohort[];
  userRole: Role;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: AppNotification[];
  pendingRequestsCount?: number;
  onOpenNotifications: () => void;
  onOpenCreateTask: () => void;
  onOpenBroadcastNotice: () => void;
  onOpenClassManager: () => void;
  onOpenClassHub: () => void;
  onOpenAIHub: () => void;
  onSwitchClass: (classId: string) => void;
  onOpenGoogleHub?: () => void;
  onOpenRoleModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cohort,
  enrolledClasses,
  userRole,
  searchQuery,
  setSearchQuery,
  notifications,
  pendingRequestsCount = 0,
  onOpenNotifications,
  onOpenCreateTask,
  onOpenBroadcastNotice,
  onOpenClassManager,
  onOpenClassHub,
  onOpenAIHub,
  onSwitchClass,
  onOpenGoogleHub,
  onOpenRoleModal
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20 sticky top-0">
      
      {/* Left: Brand + Class Cohort Dropdown */}
      <div className="flex items-center space-x-3 min-w-0">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mr-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
            C
          </div>
          <span className="text-base font-bold tracking-tight text-white hidden sm:inline">
            Classora
          </span>
        </div>

        {/* Class Selector / Hub Button */}
        <button
          onClick={onOpenClassHub}
          className="flex items-center space-x-2 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all text-left group"
          title="Open Class Hub (Roster, Chat, Notes & Code)"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-200 font-mono">
            {cohort?.code || 'CLASS'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
        </button>

        {/* Role Pill */}
        <button
          type="button"
          onClick={onOpenRoleModal}
          className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase transition-all ${
            userRole === 'CR'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30'
              : userRole === 'TEACHER' || userRole === 'FACULTY'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
          }`}
          title="Click to change academic role or switch institution"
        >
          {userRole === 'CR' ? (
            <>
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span>CR (Admin)</span>
            </>
          ) : userRole === 'TEACHER' || userRole === 'FACULTY' ? (
            <>
              <BookOpen className="w-3 h-3 text-emerald-400" />
              <span>Faculty</span>
            </>
          ) : (
            <>
              <GraduationCap className="w-3 h-3 text-slate-400" />
              <span>Student</span>
            </>
          )}
        </button>
      </div>

      {/* Right: Search, Actions, AI Hub, Workspace, Notifications */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        
        {/* Real-time Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subjects, assignments..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs border border-slate-700/80 rounded-xl w-44 lg:w-56 focus:outline-none focus:border-indigo-500 bg-slate-800/60 text-slate-200 placeholder-slate-400"
          />
        </div>

        {/* AI Study Hub Trigger */}
        <button
          onClick={onOpenAIHub}
          className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-violet-300 bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 rounded-xl transition-all active:scale-[0.98] shadow-sm"
          title="Open AI Study Hub (Summaries, Explanations, Quizzes)"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="hidden sm:inline">AI Tutor</span>
        </button>

        {/* Google Workspace & Classroom Sync */}
        <button
          onClick={onOpenGoogleHub}
          title="Google Workspace Hub: Calendar, Tasks, Classroom, Sheets & Meet Sync"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all active:scale-[0.98]"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span className="hidden md:inline">Workspace</span>
        </button>

        {/* Export Calendar iCal Button */}
        <a
          href={api.getCalendarExportUrl()}
          download
          title="Export class deadlines to Google / Apple Calendar (.ics)"
          className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-indigo-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">.ics</span>
        </a>

        {/* CR / Faculty Action Buttons */}
        {(userRole === 'CR' || userRole === 'TEACHER' || userRole === 'FACULTY') && (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={onOpenBroadcastNotice}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold rounded-xl flex items-center space-x-1 transition-colors"
              title="Broadcast Class Announcement"
            >
              <Send className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Notice</span>
            </button>

            <button
              onClick={onOpenCreateTask}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors shadow-md shadow-indigo-600/30"
              title="Publish New Assignment to Class"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assignment</span>
            </button>
          </div>
        )}

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-400 hover:text-white border border-slate-700/80 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors"
          title="Class Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

      </div>
    </header>
  );
};
