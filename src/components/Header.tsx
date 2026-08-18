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
  Download
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
  onOpenNotifications: () => void;
  onOpenCreateTask: () => void;
  onOpenBroadcastNotice: () => void;
  onOpenClassManager: () => void;
  onSwitchClass: (classId: string) => void;
  onOpenGoogleHub?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cohort,
  enrolledClasses,
  userRole,
  searchQuery,
  setSearchQuery,
  notifications,
  onOpenNotifications,
  onOpenCreateTask,
  onOpenBroadcastNotice,
  onOpenClassManager,
  onSwitchClass,
  onOpenGoogleHub
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10">
      {/* Left: Class Cohort Dropdown & Breadcrumb */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="flex items-center space-x-2">
          {/* Class Switcher Button */}
          <button
            onClick={onOpenClassManager}
            className="flex items-center space-x-2 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors text-left group"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            <span className="text-xs font-bold text-gray-900 font-mono">
              {cohort?.code || 'SELECT CLASS'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <span className="hidden sm:inline text-xs text-gray-400 font-mono">•</span>
          <span className="hidden sm:inline text-xs font-medium text-gray-600 truncate max-w-[200px] lg:max-w-[320px]">
            {cohort?.name || 'Class Cohort'}
          </span>
        </div>

        {/* Role Tag */}
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wide ${
            userRole === 'CR'
              ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
              : userRole === 'FACULTY'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-gray-100 text-gray-700 border border-gray-200'
          }`}
        >
          {userRole === 'CR' ? 'Class Rep (CR)' : userRole}
        </span>
      </div>

      {/* Right: Search, Actions, Notifications */}
      <div className="flex items-center space-x-2.5">
        {/* Real-time Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subjects, assignments, faculty..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1 text-xs border border-gray-200 rounded-md w-52 lg:w-64 focus:outline-indigo-500 bg-gray-50/60"
          />
        </div>

        {/* Google Workspace & Classroom Hub Button */}
        <button
          onClick={onOpenGoogleHub}
          title="Google Workspace Hub: Calendar, Tasks, Classroom, Sheets & Meet Sync"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 rounded-md transition-all active:scale-[0.98]"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span className="hidden sm:inline">Workspace</span>
        </button>

        {/* Export Calendar iCal Button */}
        <a
          href={api.getCalendarExportUrl()}
          download
          title="Export class deadlines to Google / Apple Calendar (.ics)"
          className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 text-xs text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">.ics</span>
        </a>

        {/* CR / Faculty Action Buttons */}
        {(userRole === 'CR' || userRole === 'FACULTY') && (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={onOpenBroadcastNotice}
              className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-md flex items-center space-x-1 transition-colors"
              title="Broadcast Class Announcement"
            >
              <Send className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden sm:inline">Notice</span>
            </button>

            <button
              onClick={onOpenCreateTask}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md flex items-center space-x-1.5 transition-colors shadow-xs"
              title="Publish New Assignment to Class"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Assignment</span>
            </button>
          </div>
        )}

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md bg-white hover:bg-gray-50 transition-colors"
          title="Class Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
