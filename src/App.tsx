import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Plus,
  Shield,
  Layers,
  Sparkles,
  Calendar as CalendarIcon,
  List,
  Users,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Download,
  Flame,
  UserCheck,
  BrainCircuit,
  Settings,
  ShieldCheck,
  GraduationCap,
  Trophy
} from 'lucide-react';

import {
  Assignment,
  Announcement,
  ClassCohort,
  ClassMember,
  Role,
  AppNotification,
  UserProfile,
  JoinRequest,
  MainNavigationTab
} from './types/index.js';
import { api } from './services/api.js';
import { sortAndEnrichAssignments, calculateAcademicMetrics } from './utils/deadlineEngine.js';

import { Header } from './components/Header.js';
import { FireZoneBanner } from './components/FireZoneBanner.js';
import { AssignmentCard } from './components/AssignmentCard.js';
import { AssignmentDetailModal } from './components/AssignmentDetailModal.js';
import { CreateAssignmentModal } from './components/CreateAssignmentModal.js';
import { ClassManagementModal } from './components/ClassManagementModal.js';
import { ClassHubModal } from './components/ClassHubModal.js';
import { AIStudyHubModal } from './components/AIStudyHubModal.js';
import { BroadcastNoticeModal } from './components/BroadcastNoticeModal.js';
import { NotificationsDrawer } from './components/NotificationsDrawer.js';
import { CalendarView } from './components/CalendarView.js';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal.js';
import { OnboardingModal } from './components/OnboardingModal.js';
import { LegalModal } from './components/LegalModals.js';
import { OfflineBanner } from './components/OfflineBanner.js';
import { BottomNav } from './components/BottomNav.js';
import { QuickActionSheet } from './components/QuickActionSheet.js';
import { NotesHubView } from './components/NotesHubView.js';
import { LeaderboardView } from './components/LeaderboardView.js';
import { AnalyticsView } from './components/AnalyticsView.js';
import { ProfileView } from './components/ProfileView.js';
import { TimetableWidget } from './components/TimetableWidget.js';
import { initAuth } from './services/firebase.js';
import { User } from 'firebase/auth';

export default function App() {
  // Application Data States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeCohort, setActiveCohort] = useState<ClassCohort | null>(null);
  const [enrolledClasses, setEnrolledClasses] = useState<ClassCohort[]>([]);
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // UI Filtering & Navigation States
  const [activeNavTab, setActiveNavTab] = useState<MainNavigationTab>('home');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Modals & Drawers
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isClassManagerOpen, setIsClassManagerOpen] = useState(false);
  const [isClassHubOpen, setIsClassHubOpen] = useState(false);
  const [isAIHubOpen, setIsAIHubOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isGoogleHubOpen, setIsGoogleHubOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = initAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load initial application data
  const loadData = async () => {
    try {
      const prof = await api.getProfile();
      setProfile(prof);
      setActiveCohort(prof.activeClass);
      setEnrolledClasses(prof.enrolledClasses || []);

      const [assns, anns, notifs, mems] = await Promise.all([
        api.getAssignments({
          priority: selectedPriority,
          subject: selectedSubject,
          status: selectedStatus,
          search: searchQuery
        }),
        api.getAnnouncements(),
        api.getNotifications(),
        api.getClassMembers()
      ]);

      setAssignments(sortAndEnrichAssignments(assns));
      setAnnouncements(anns);
      setNotifications(notifs);
      setMembers(mems);

      // If user is CR, load pending requests count
      if (prof.role === 'CR' || prof.role === 'ADMIN') {
        try {
          const reqs = await api.getJoinRequests();
          setPendingRequests(reqs);
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to load application state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedPriority, selectedSubject, selectedStatus, searchQuery]);

  // Dynamic Metrics calculation via deadline engine
  const metrics = calculateAcademicMetrics(assignments);
  const totalTasks = metrics.total;
  const completedTasks = metrics.completed;
  const criticalTasks = metrics.critical;
  const overdueTasks = metrics.overdue;
  const completionRate = metrics.completionPercentage;
  const verifiedCount = assignments.filter(a => a.isVerified).length;

  // Find most urgent uncompleted assignment for Fire Zone (< 24h or overdue)
  const urgentAssignment = assignments.find(
    a => !a.isCompleted && (
      a.priority === 'Critical' ||
      a.dueDate.toLowerCase().includes('today') ||
      new Date(a.dueDateISO).getTime() - Date.now() < 24 * 3600 * 1000
    )
  ) || null;

  const handleRoleChange = async (role: Role) => {
    try {
      await api.setRole(role);
      if (profile) setProfile({ ...profile, role });
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Class switching
  const handleSwitchClass = async (classId: string) => {
    try {
      const res = await api.switchClass(classId);
      setActiveCohort(res.activeClass);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Class joining by code
  const handleJoinClass = async (code: string) => {
    const res = await api.joinClassByCode(code);
    setActiveCohort(res.activeClass);
    await loadData();
  };

  // Create new class cohort
  const handleCreateClass = async (data: any) => {
    const newClass = await api.createClass(data);
    setActiveCohort(newClass);
    await loadData();
  };

  // Assignment actions
  const handleToggleComplete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const updated = await api.toggleComplete(id);
      setAssignments(prev =>
        prev.map(a => (a.id === id ? { ...a, isCompleted: updated.isCompleted } : a))
      );
      if (selectedAssignment && selectedAssignment.id === id) {
        setSelectedAssignment(prev =>
          prev ? { ...prev, isCompleted: updated.isCompleted } : null
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.togglePin(id);
      setAssignments(prev =>
        prev.map(a => (a.id === id ? { ...a, isPinned: res.isPinned } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Create Assignment
  const handleCreateAssignment = async (data: any) => {
    await api.createAssignment(data);
    await loadData();
  };

  // Broadcast Notice
  const handleBroadcastNotice = async (title: string, message: string, urgency: 'INFO' | 'URGENT' | 'CRITICAL') => {
    await api.createAnnouncement({
      title,
      content: message,
      priority: urgency === 'CRITICAL' ? 'Urgent' : urgency === 'URGENT' ? 'Normal' : 'Info'
    });
    await loadData();
  };

  // Mark all notifications read
  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // User role and course metadata
  const userRole = profile?.role || 'CR';

  // Get distinct subjects for filter pill
  const subjects = Array.from(new Set(assignments.map(a => a.subjectCode)));

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Offline Status Listener */}
      <OfflineBanner />

      {/* 1. Academic Sticky Header */}
      <Header
        cohort={activeCohort}
        enrolledClasses={enrolledClasses}
        userRole={userRole}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        notifications={notifications}
        pendingRequestsCount={pendingRequests.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onOpenBroadcastNotice={() => setIsBroadcastOpen(true)}
        onOpenClassManager={() => setIsClassManagerOpen(true)}
        onOpenClassHub={() => setIsClassHubOpen(true)}
        onOpenAIHub={() => setIsAIHubOpen(true)}
        onSwitchClass={handleSwitchClass}
        onOpenGoogleHub={() => setIsGoogleHubOpen(true)}
        onOpenRoleModal={() => setIsOnboardingOpen(true)}
      />

      {/* 2. Interactive Role Switcher & Navigation Tabs */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold uppercase font-mono text-slate-400">
            Role Mode:
          </span>
          <div className="inline-flex bg-slate-950 p-0.5 rounded-xl border border-slate-800">
            {(['STUDENT', 'CR', 'TEACHER'] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg font-mono transition-all ${
                  userRole === r
                    ? 'bg-indigo-600 text-white shadow font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'CR' ? 'Class Rep (CR)' : r === 'TEACHER' ? 'Faculty' : 'Student'}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'home', label: 'Dashboard', icon: BookOpen },
            { id: 'classes', label: 'Classes', icon: Layers },
            { id: 'notes', label: 'Notes Hub', icon: BookOpen },
            { id: 'leaderboard', label: 'Standings', icon: Trophy },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'ai', label: 'AI Hub', icon: BrainCircuit },
            { id: 'profile', label: 'Profile', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeNavTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'classes') {
                    setIsClassHubOpen(true);
                  } else if (tab.id === 'ai') {
                    setIsAIHubOpen(true);
                  } else {
                    setActiveNavTab(tab.id as any);
                  }
                }}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-medium text-xs transition-colors ${
                  isActive && tab.id !== 'classes' && tab.id !== 'ai'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Class Code & Hub Fast Trigger */}
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span>Cohort:</span>
          <button
            onClick={() => setIsClassHubOpen(true)}
            className="font-bold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 rounded-lg hover:bg-indigo-500/30 transition-colors flex items-center gap-1.5"
            title="Open Class Hub & Roster"
          >
            <span>{activeCohort?.code || 'SELECT'}</span>
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setIsClassHubOpen(true)}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{members.length} Classmates</span>
          </button>
        </div>

      </div>

      {/* 3. Main Dynamic View Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5 pb-24 md:pb-8">
        
        {/* Render Active View */}
        {activeNavTab === 'notes' && (
          <NotesHubView
            activeCohort={activeCohort}
            userRole={userRole}
            onAskAIAboutNote={(note) => setIsAIHubOpen(true)}
          />
        )}

        {activeNavTab === 'leaderboard' && (
          <LeaderboardView currentUserId={profile?.id} />
        )}

        {activeNavTab === 'analytics' && (
          <AnalyticsView />
        )}

        {activeNavTab === 'profile' && (
          <ProfileView
            profile={profile}
            activeCohort={activeCohort}
            enrolledClasses={enrolledClasses}
            onUpdateProfile={(p) => setProfile(p)}
            onSwitchClass={handleSwitchClass}
            onOpenPrivacy={() => setLegalModalType('privacy')}
            onOpenTerms={() => setLegalModalType('terms')}
            onOpenGoogleSync={() => setIsGoogleHubOpen(true)}
            onRoleChange={handleRoleChange}
          />
        )}

        {activeNavTab === 'home' && (
          <>
            {/* Timetable Schedule Strip */}
            <TimetableWidget />

            {/* Fire Zone Urgency Banner */}
            {urgentAssignment && (
              <FireZoneBanner
                urgentAssignment={urgentAssignment}
                onOpenDetails={setSelectedAssignment}
                onToggleComplete={handleToggleComplete}
              />
            )}

        {/* Metric Overview Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase font-bold">
              <span>Class Assignments</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-1.5 text-2xl font-bold font-mono text-white">
              {totalTasks}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {completedTasks} done • {totalTasks - completedTasks} active
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase font-bold">
              <span>Urgent Dues (&lt; 24h)</span>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-1.5 text-2xl font-bold font-mono text-rose-400">
              {criticalTasks}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Priority critical or today deadlines
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase font-bold">
              <span>Faculty Verified</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-1.5 text-2xl font-bold font-mono text-emerald-400">
              {verifiedCount}/{totalTasks}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Official rubric confirmed
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono uppercase font-bold">
              <span>Completion Rate</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-1.5 text-2xl font-bold font-mono text-indigo-300">
              {completionRate}%
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Content Section: 2 Columns (Left: Filters & Assignment Cards / Calendar, Right: Notice Board & Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          
          {/* Main 2-Column Left: Filters & Assignment Cards */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filter & View Switcher Toolbar */}
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 backdrop-blur-sm">
              
              {/* Quick Status / Priority Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                <button
                  onClick={() => {
                    setSelectedPriority('ALL');
                    setSelectedStatus('ALL');
                    setSelectedSubject('ALL');
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedPriority === 'ALL' && selectedStatus === 'ALL' && selectedSubject === 'ALL'
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  All ({totalTasks})
                </button>
                <button
                  onClick={() => setSelectedPriority(selectedPriority === 'Critical' ? 'ALL' : 'Critical')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedPriority === 'Critical'
                      ? 'bg-rose-600 text-white font-bold shadow'
                      : 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30'
                  }`}
                >
                  🔴 Critical
                </button>
                <button
                  onClick={() => setSelectedStatus(selectedStatus === 'PENDING' ? 'ALL' : 'PENDING')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedStatus === 'PENDING'
                      ? 'bg-indigo-600 text-white font-bold shadow'
                      : 'bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setSelectedStatus(selectedStatus === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    selectedStatus === 'COMPLETED'
                      ? 'bg-emerald-600 text-white font-bold shadow'
                      : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
                  }`}
                >
                  Done ({completedTasks})
                </button>
              </div>

              {/* View Mode Toggle (List vs 14-Day Calendar) */}
              <div className="inline-flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all ${
                    viewMode === 'list'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">List</span>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-all ${
                    viewMode === 'calendar'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">Agenda</span>
                </button>
              </div>
            </div>

            {/* Subject Filter Pills */}
            {subjects.length > 0 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-mono">
                <span className="text-slate-500 text-[10px] uppercase font-bold shrink-0">
                  Course:
                </span>
                {subjects.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubject(selectedSubject === s ? 'ALL' : s)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      selectedSubject === s
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* View Switcher Output */}
            {viewMode === 'calendar' ? (
              <CalendarView
                assignments={assignments}
                onSelectAssignment={setSelectedAssignment}
              />
            ) : (
              /* High-Density Assignment Cards List */
              <div className="space-y-3">
                {assignments.length === 0 ? (
                  <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center backdrop-blur-sm">
                    <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-white font-mono">
                      No assignments found
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      No assignments match your current filter parameters.
                    </p>
                    {(userRole === 'CR' || userRole === 'TEACHER' || userRole === 'FACULTY') && (
                      <button
                        onClick={() => setIsCreateTaskOpen(true)}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center space-x-1.5 shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Publish New Assignment</span>
                      </button>
                    )}
                  </div>
                ) : (
                  assignments.map(a => (
                    <AssignmentCard
                      key={a.id}
                      assignment={a}
                      userRole={userRole}
                      onSelect={setSelectedAssignment}
                      onToggleComplete={handleToggleComplete}
                      onTogglePin={handleTogglePin}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Column: Class Notice Board & Cohort Summary */}
          <div className="space-y-4">
            
            {/* Notice Board Card */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 shadow-sm overflow-hidden backdrop-blur-sm">
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Megaphone className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-white font-mono tracking-wide">
                    CLASS NOTICE BOARD
                  </h3>
                </div>
                {(userRole === 'CR' || userRole === 'TEACHER' || userRole === 'FACULTY') && (
                  <button
                    onClick={() => setIsBroadcastOpen(true)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 font-mono flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/80 max-h-[420px] overflow-y-auto">
                {announcements.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 font-mono">
                    No active class announcements.
                  </div>
                ) : (
                  announcements.map(ann => (
                    <div key={ann.id} className="p-4 space-y-1.5 hover:bg-slate-850/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            ann.priority === 'Urgent'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : ann.priority === 'Normal'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {ann.priority === 'Urgent' ? '🚨 URGENT' : ann.priority}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {ann.relativeTime}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-snug">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {ann.content}
                      </p>

                      <div className="text-[10px] text-slate-500 font-mono pt-1">
                        Posted by {ann.author}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Cohort Details Widget */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-sm space-y-3.5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono uppercase text-slate-400">
                  Cohort Information
                </span>
                <button
                  onClick={() => setIsClassHubOpen(true)}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 font-mono"
                >
                  Class Hub
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Program:</span>
                  <span className="font-semibold text-slate-200 text-right truncate max-w-[170px]">
                    {activeCohort?.branch}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">Term / Sec:</span>
                  <span className="font-semibold text-slate-200">
                    {activeCohort?.semester} • {activeCohort?.section}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">CR:</span>
                  <span className="font-semibold text-indigo-300">
                    {activeCohort?.crName}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Advisor:</span>
                  <span className="font-semibold text-slate-200">
                    {activeCohort?.facultyInCharge}
                  </span>
                </div>
              </div>

              <a
                href={api.getCalendarExportUrl()}
                download
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700/80 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5 font-mono shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Calendar (.ics)</span>
              </a>
            </div>

          </div>

        </div>
        </>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        activeTab={activeNavTab}
        onSelectTab={(tab) => {
          if (tab === 'classes') {
            setIsClassHubOpen(true);
          } else if (tab === 'ai') {
            setIsAIHubOpen(true);
          } else {
            setActiveNavTab(tab);
          }
        }}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
        userRole={userRole}
      />

      {/* Quick Action Floating Menu Sheet */}
      <QuickActionSheet
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        userRole={userRole}
        onAction={(action) => {
          if (action === 'assignment') setIsCreateTaskOpen(true);
          else if (action === 'note') {
            setActiveNavTab('notes');
          } else if (action === 'reminder') setIsGoogleHubOpen(true);
          else if (action === 'join') setIsClassManagerOpen(true);
          else if (action === 'ai') setIsAIHubOpen(true);
          else if (action === 'broadcast') setIsBroadcastOpen(true);
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Classora</span>
            <span>•</span>
            <span>Universal Academic Platform</span>
            <span>•</span>
            <span className="text-emerald-400">Systems Operational</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLegalModalType('privacy')}
              className="hover:text-indigo-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setLegalModalType('terms')}
              className="hover:text-indigo-300 transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <span>v2.4.0 (Play Store Ready)</span>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {selectedAssignment && (
        <AssignmentDetailModal
          assignment={selectedAssignment}
          userRole={userRole}
          isOpen={!!selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
          onToggleComplete={id => handleToggleComplete(id)}
          onAssignmentUpdated={loadData}
        />
      )}

      {isCreateTaskOpen && (
        <CreateAssignmentModal
          onClose={() => setIsCreateTaskOpen(false)}
          onSubmit={handleCreateAssignment}
          userRole={userRole}
        />
      )}

      {isBroadcastOpen && (
        <BroadcastNoticeModal
          onClose={() => setIsBroadcastOpen(false)}
          onSubmit={handleBroadcastNotice}
          userRole={userRole}
        />
      )}

      {isClassHubOpen && (
        <ClassHubModal
          isOpen={isClassHubOpen}
          onClose={() => setIsClassHubOpen(false)}
          activeCohort={activeCohort}
          userRole={userRole}
          profile={profile}
          onClassUpdated={loadData}
        />
      )}

      {isAIHubOpen && (
        <AIStudyHubModal
          isOpen={isAIHubOpen}
          onClose={() => setIsAIHubOpen(false)}
          assignments={assignments}
        />
      )}

      {isClassManagerOpen && (
        <ClassManagementModal
          activeCohort={activeCohort}
          enrolledClasses={enrolledClasses}
          members={members}
          userRole={userRole}
          onClose={() => setIsClassManagerOpen(false)}
          onSwitchClass={handleSwitchClass}
          onJoinClass={handleJoinClass}
          onCreateClass={handleCreateClass}
        />
      )}

      {isOnboardingOpen && (
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={loadData}
        />
      )}

      <NotificationsDrawer
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllAsRead={handleMarkAllRead}
        onClearNotifications={() => setNotifications([])}
      />

      <GoogleWorkspaceModal
        isOpen={isGoogleHubOpen}
        onClose={() => setIsGoogleHubOpen(false)}
        assignments={assignments}
        activeClass={activeCohort}
        currentUser={currentUser}
        onAuthChange={setCurrentUser}
        onImportClassroomAssignment={async (assignmentData) => {
          await api.createAssignment(assignmentData);
          await loadData();
        }}
      />

    </div>
  );
}
