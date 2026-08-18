import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  CheckSquare,
  FileSpreadsheet,
  HardDrive,
  Mail,
  GraduationCap,
  Video,
  FileText,
  MessageSquare,
  Users,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  Send,
  Plus,
  RefreshCw
} from 'lucide-react';
import { googleWorkspace } from '../services/googleWorkspace.js';
import { googleSignIn, logout, getAccessToken, auth } from '../services/firebase.js';
import { User } from 'firebase/auth';
import { Assignment, ClassCohort } from '../types/index.js';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  activeClass: ClassCohort | null;
  currentUser: User | null;
  onAuthChange: (user: User | null) => void;
  onImportClassroomAssignment?: (assignment: any) => void;
}

type TabType =
  | 'overview'
  | 'calendar'
  | 'tasks'
  | 'sheets'
  | 'classroom'
  | 'drive'
  | 'gmail'
  | 'meet'
  | 'forms'
  | 'chat'
  | 'contacts';

export const GoogleWorkspaceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  assignments,
  activeClass,
  currentUser,
  onAuthChange,
  onImportClassroomAssignment,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tab Data States
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [classroomCourses, setClassroomCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courseWork, setCourseWork] = useState<any[]>([]);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [contactsList, setContactsList] = useState<any[]>([]);
  const [chatSpaces, setChatSpaces] = useState<any[]>([]);
  const [selectedChatSpace, setSelectedChatSpace] = useState<string>('');
  const [chatMessageText, setChatMessageText] = useState<string>('');

  // Gmail State
  const [gmailTo, setGmailTo] = useState<string>('');
  const [gmailSubject, setGmailSubject] = useState<string>('');
  const [gmailBody, setGmailBody] = useState<string>('');

  // Generated Links
  const [generatedSheetUrl, setGeneratedSheetUrl] = useState<string | null>(null);
  const [generatedMeetUrl, setGeneratedMeetUrl] = useState<string | null>(null);
  const [generatedFormUrl, setGeneratedFormUrl] = useState<string | null>(null);

  // Load contextual data when tab changes
  useEffect(() => {
    if (!isOpen || !currentUser) return;
    setError(null);
    setSuccessMessage(null);

    if (activeTab === 'calendar') loadCalendar();
    if (activeTab === 'tasks') loadTasks();
    if (activeTab === 'classroom') loadClassroom();
    if (activeTab === 'drive') loadDrive();
    if (activeTab === 'contacts') loadContacts();
    if (activeTab === 'chat') loadChatSpaces();
  }, [activeTab, isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await googleSignIn();
      if (res) {
        onAuthChange(res.user);
        setSuccessMessage('Successfully connected Google Workspace!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const confirmed = window.confirm('Are you sure you want to disconnect your Google account?');
    if (!confirmed) return;
    try {
      setLoading(true);
      await logout();
      onAuthChange(null);
      setSuccessMessage('Signed out successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  // Google Calendar Operations
  const loadCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await googleWorkspace.listCalendarEvents();
      setCalendarEvents(events);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAllToCalendar = async () => {
    const confirmed = window.confirm(
      `Confirm adding ${assignments.length} deadline(s) from Classora to your primary Google Calendar?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      let count = 0;
      for (const a of assignments) {
        await googleWorkspace.addCalendarEvent({
          title: a.title,
          description: a.description,
          dueDateISO: a.dueDateISO,
          subjectCode: a.subjectCode,
          teacher: a.teacher,
        });
        count++;
      }
      setSuccessMessage(`Successfully synced ${count} assignment deadlines to Google Calendar!`);
      loadCalendar();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Tasks Operations
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await googleWorkspace.getTasks();
      setTasksList(tasks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAllToTasks = async () => {
    const activeAssignments = assignments.filter((a) => !a.isCompleted);
    const confirmed = window.confirm(
      `Confirm syncing ${activeAssignments.length} pending assignment(s) to your Google Tasks?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      for (const a of activeAssignments) {
        await googleWorkspace.syncAssignmentToTasks({
          title: a.title,
          description: a.description,
          dueDateISO: a.dueDateISO,
          subjectCode: a.subjectCode,
        });
      }
      setSuccessMessage(`Exported ${activeAssignments.length} assignments to Google Tasks!`);
      loadTasks();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Sheets Export
  const handleExportToSheets = async () => {
    const confirmed = window.confirm(
      `Confirm creating a new Google Spreadsheet with ${assignments.length} assignment entries?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      const res = await googleWorkspace.exportAssignmentsToSheet(
        activeClass?.name || 'Classora Assignments',
        assignments
      );
      setGeneratedSheetUrl(res.spreadsheetUrl);
      setSuccessMessage('Successfully generated Google Sheet with real-time assignment data!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Drive
  const loadDrive = async () => {
    try {
      setLoading(true);
      setError(null);
      const files = await googleWorkspace.listDriveFiles();
      setDriveFiles(files);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackupToDrive = async () => {
    const confirmed = window.confirm(
      'Export and backup complete Classora schedule and assignments report JSON to your Google Drive?'
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      const data = {
        class: activeClass,
        assignments,
        exportedAt: new Date().toISOString(),
      };
      await googleWorkspace.uploadFileToDrive(
        `Classora_Backup_${new Date().toISOString().split('T')[0]}.json`,
        JSON.stringify(data, null, 2),
        'application/json'
      );
      setSuccessMessage('Successfully saved Classora backup JSON to Google Drive!');
      loadDrive();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gmail Operations
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmailTo || !gmailSubject || !gmailBody) {
      setError('Please provide recipient, subject, and email body.');
      return;
    }

    const confirmed = window.confirm(
      `Confirm sending email to "${gmailTo}" with subject "${gmailSubject}" from your Gmail account?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      await googleWorkspace.sendEmail(gmailTo, gmailSubject, gmailBody);
      setSuccessMessage(`Email sent successfully to ${gmailTo}!`);
      setGmailTo('');
      setGmailSubject('');
      setGmailBody('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Classroom Operations
  const loadClassroom = async () => {
    try {
      setLoading(true);
      setError(null);
      const courses = await googleWorkspace.listClassroomCourses();
      setClassroomCourses(courses);
      if (courses.length > 0) {
        setSelectedCourse(courses[0].id);
        loadCourseWork(courses[0].id);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseWork = async (courseId: string) => {
    try {
      setLoading(true);
      const work = await googleWorkspace.listCourseWork(courseId);
      setCourseWork(work);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Meet Study Room
  const handleCreateMeet = async () => {
    try {
      setLoading(true);
      setError(null);
      const space = await googleWorkspace.createInstantMeetingSpace();
      setGeneratedMeetUrl(space.meetingUri);
      setSuccessMessage(`Generated Instant Google Meet Room (${space.meetingCode})!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Forms Creator
  const handleCreateForm = async () => {
    const confirmed = window.confirm(
      'Create a standardized Google Form for student assignment submissions & doubt queries?'
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      const form = await googleWorkspace.createAssignmentForm(
        `${activeClass?.name || 'Classora'} - Assignment Submissions & Feedback`,
        [
          'Student Full Name & Roll Number',
          'Select Subject / Assignment',
          'Submission Link / Drive URL',
          'Queries or Comments for Faculty/CR',
        ]
      );
      setGeneratedFormUrl(form.formUrl);
      setSuccessMessage('Created Google Form for class submissions!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Chat
  const loadChatSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const spaces = await googleWorkspace.listChatSpaces();
      setChatSpaces(spaces);
      if (spaces.length > 0) {
        setSelectedChatSpace(spaces[0].name);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!selectedChatSpace || !chatMessageText) {
      setError('Please select a space and enter a message.');
      return;
    }
    const confirmed = window.confirm(
      `Confirm broadcasting this message to Google Chat Space "${selectedChatSpace}"?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError(null);
      await googleWorkspace.sendChatMessage(selectedChatSpace, chatMessageText);
      setSuccessMessage('Broadcast sent to Google Chat space!');
      setChatMessageText('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Contacts
  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const contacts = await googleWorkspace.listContacts();
      setContactsList(contacts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Google Workspace & Classroom Hub
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                  Universal Academic Sync
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Seamlessly sync deadlines, courses, tasks, sheets, emails, and meetings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Banner */}
        <div className="px-6 py-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
          {currentUser ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={currentUser.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-slate-300"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    {currentUser.displayName || 'Google Account'}
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  </p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="text-xs px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-medium rounded-lg border border-rose-200 transition-colors"
              >
                Disconnect Account
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Connect your Google account with authorized Workspace permissions to unlock 1-click sync.</span>
              </div>
              {/* Google Sign In Button */}
              <button
                onClick={handleSignIn}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Body with Sidebar & Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-56 bg-slate-50 border-r border-slate-200 p-3 flex flex-col space-y-1 overflow-y-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Overview & Quick Sync</span>
            </button>

            <div className="pt-2 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Integrations
            </div>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              <span>Google Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-indigo-500" />
              <span>Google Tasks</span>
            </button>

            <button
              onClick={() => setActiveTab('classroom')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'classroom'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span>Google Classroom</span>
            </button>

            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'sheets'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Google Sheets</span>
            </button>

            <button
              onClick={() => setActiveTab('drive')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'drive'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <HardDrive className="w-4 h-4 text-amber-500" />
              <span>Google Drive</span>
            </button>

            <button
              onClick={() => setActiveTab('gmail')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'gmail'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Mail className="w-4 h-4 text-red-500" />
              <span>Gmail Broadcast</span>
            </button>

            <button
              onClick={() => setActiveTab('meet')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'meet'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Video className="w-4 h-4 text-teal-500" />
              <span>Google Meet</span>
            </button>

            <button
              onClick={() => setActiveTab('forms')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'forms'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-4 h-4 text-purple-500" />
              <span>Google Forms</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              <span>Google Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'contacts'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Google Contacts</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50/40">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold">Classora + Google Workspace Synergy</h3>
                    <p className="text-sm text-blue-200 mt-1 max-w-xl">
                      Centralize your academic life. Export assignment deadlines to Calendar & Tasks, publish grades to Google Sheets, send broadcast notifications via Gmail, and create instant Google Meet study rooms.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs px-3 py-1 bg-white/10 rounded-full font-medium backdrop-blur-sm">
                        📅 Calendar Auto-Sync
                      </span>
                      <span className="text-xs px-3 py-1 bg-white/10 rounded-full font-medium backdrop-blur-sm">
                        📊 Realtime Sheets Export
                      </span>
                      <span className="text-xs px-3 py-1 bg-white/10 rounded-full font-medium backdrop-blur-sm">
                        🎓 Google Classroom Import
                      </span>
                      <span className="text-xs px-3 py-1 bg-white/10 rounded-full font-medium backdrop-blur-sm">
                        📹 1-Click Meet Rooms
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Calendar Sync Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Sync to Google Calendar</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Push all {assignments.length} deadline(s) with automated 24h & 1h pop-up reminders.
                      </p>
                    </div>
                    <button
                      onClick={handleSyncAllToCalendar}
                      disabled={loading || !currentUser}
                      className="mt-4 w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      Sync Deadlines Now
                    </button>
                  </div>

                  {/* Tasks Sync Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Sync to Google Tasks</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Add active assignments to your personal Google Tasks list with due dates.
                      </p>
                    </div>
                    <button
                      onClick={handleSyncAllToTasks}
                      disabled={loading || !currentUser}
                      className="mt-4 w-full py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      Export to Tasks
                    </button>
                  </div>

                  {/* Google Sheets Export Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Export to Google Sheets</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Generate a live spreadsheet tracking submission statuses, priorities, and teachers.
                      </p>
                    </div>
                    <button
                      onClick={handleExportToSheets}
                      disabled={loading || !currentUser}
                      className="mt-4 w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      Create Google Sheet
                    </button>
                  </div>

                  {/* Instant Meet Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-teal-300 transition-all">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                        <Video className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Study Room Google Meet</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Spin up an instant video study session or faculty doubt clearance room.
                      </p>
                    </div>
                    <button
                      onClick={handleCreateMeet}
                      disabled={loading || !currentUser}
                      className="mt-4 w-full py-2 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      Generate Meet Link
                    </button>
                  </div>

                  {/* Classroom Sync Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Google Classroom</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        View enrolled courses and import assignments directly into your Classora dashboard.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('classroom')}
                      disabled={loading || !currentUser}
                      className="mt-4 w-full py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      Browse Courses
                    </button>
                  </div>

                  {/* Google Forms Creator */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-300 transition-all">
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Submissions Google Form</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        1-Click generate Google Form to collect student homework and project links.
                      </p>
                    </div>
                    <button
                      onClick={handleCreateForm}
                      disabled={loading || !currentUser}
                      className="mt-4 w-full py-2 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      Create Submission Form
                    </button>
                  </div>
                </div>

                {/* Generated Links Banner */}
                {(generatedSheetUrl || generatedMeetUrl || generatedFormUrl) && (
                  <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Recently Generated Google Links
                    </h4>
                    <div className="space-y-2">
                      {generatedSheetUrl && (
                        <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                          <div className="flex items-center space-x-2 text-xs text-emerald-900">
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold">Google Sheet Generated</span>
                          </div>
                          <a
                            href={generatedSheetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-1 text-xs px-3 py-1 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                          >
                            <span>Open Sheet</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {generatedMeetUrl && (
                        <div className="flex items-center justify-between p-3 bg-teal-50 rounded-xl border border-teal-200">
                          <div className="flex items-center space-x-2 text-xs text-teal-900">
                            <Video className="w-4 h-4 text-teal-600" />
                            <span className="font-semibold">Study Session Google Meet</span>
                          </div>
                          <a
                            href={generatedMeetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-1 text-xs px-3 py-1 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                          >
                            <span>Join Meeting</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {generatedFormUrl && (
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
                          <div className="flex items-center space-x-2 text-xs text-purple-900">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold">Assignment Submissions Form</span>
                          </div>
                          <a
                            href={generatedFormUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center space-x-1 text-xs px-3 py-1 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                          >
                            <span>Edit Form</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* GOOGLE CALENDAR TAB */}
            {activeTab === 'calendar' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                      Google Calendar Events
                    </h3>
                    <p className="text-xs text-slate-500">
                      View your synced academic deadlines and scheduled calendar events
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={loadCalendar}
                      disabled={loading}
                      className="p-2 text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      onClick={handleSyncAllToCalendar}
                      disabled={loading}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Sync All Deadlines
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {calendarEvents.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                      <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-medium">No upcoming Google Calendar events found</p>
                    </div>
                  ) : (
                    calendarEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{evt.summary}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {evt.start?.dateTime
                              ? new Date(evt.start.dateTime).toLocaleString()
                              : evt.start?.date || 'All Day'}
                          </p>
                        </div>
                        {evt.htmlLink && (
                          <a
                            href={evt.htmlLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* GOOGLE TASKS TAB */}
            {activeTab === 'tasks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-indigo-600" />
                      Google Tasks Manager
                    </h3>
                    <p className="text-xs text-slate-500">Personal to-do tasks linked with Classora</p>
                  </div>
                  <button
                    onClick={handleSyncAllToTasks}
                    disabled={loading}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Sync Active Tasks
                  </button>
                </div>

                <div className="space-y-2">
                  {tasksList.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                      <CheckSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-medium">No tasks found in default Google Tasks list</p>
                    </div>
                  ) : (
                    tasksList.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            readOnly
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <p className={`text-xs font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                              {task.title}
                            </p>
                            {task.due && (
                              <p className="text-[11px] text-slate-500">
                                Due: {new Date(task.due).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          task.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* GOOGLE CLASSROOM TAB */}
            {activeTab === 'classroom' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-600" />
                    Google Classroom Courses & Coursework
                  </h3>
                  <p className="text-xs text-slate-500">Import course assignments directly into Classora</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Courses List */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Enrolled Courses</h4>
                    {classroomCourses.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCourse(c.id);
                          loadCourseWork(c.id);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-colors ${
                          selectedCourse === c.id
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <p className="font-bold">{c.name}</p>
                        <p className="text-[10px] text-slate-500">{c.section || 'General'}</p>
                      </button>
                    ))}
                    {classroomCourses.length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center">No Classroom courses found</p>
                    )}
                  </div>

                  {/* Coursework List */}
                  <div className="md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Coursework & Assignments</h4>
                    {courseWork.length === 0 ? (
                      <p className="text-xs text-slate-400 py-8 text-center">No assignments in this course</p>
                    ) : (
                      courseWork.map((cw) => (
                        <div
                          key={cw.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">{cw.title}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{cw.description || 'No description'}</p>
                          </div>
                          {onImportClassroomAssignment && (
                            <button
                              onClick={() => {
                                onImportClassroomAssignment({
                                  title: cw.title,
                                  description: cw.description || '',
                                  subjectCode: 'CLASSROOM',
                                  dueDate: cw.dueDate ? `${cw.dueDate.year}-${cw.dueDate.month}-${cw.dueDate.day}` : 'Next Week',
                                  priority: 'High',
                                  estimatedHours: 3,
                                });
                                setSuccessMessage(`Imported "${cw.title}" into Classora!`);
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Import</span>
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* GMAIL BROADCAST TAB */}
            {activeTab === 'gmail' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-red-600" />
                    Gmail Direct Broadcast & Reminders
                  </h3>
                  <p className="text-xs text-slate-500">
                    Send real email notifications and deadline alerts from your authorized Gmail account
                  </p>
                </div>

                <form onSubmit={handleSendEmail} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Email</label>
                    <input
                      type="email"
                      value={gmailTo}
                      onChange={(e) => setGmailTo(e.target.value)}
                      placeholder="student@university.edu or cohort-list@groups.edu"
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={gmailSubject}
                      onChange={(e) => setGmailSubject(e.target.value)}
                      placeholder="[Classora Alert] Urgent Assignment Submission Reminder"
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
                    <textarea
                      rows={5}
                      value={gmailBody}
                      onChange={(e) => setGmailBody(e.target.value)}
                      placeholder="Hello Classmates, this is an automated reminder regarding the upcoming deadline..."
                      required
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-slate-400">
                      Requires explicit confirmation before email transmission.
                    </p>
                    <button
                      type="submit"
                      disabled={loading || !currentUser}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Email Broadcast</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* GOOGLE DRIVE TAB */}
            {activeTab === 'drive' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <HardDrive className="w-5 h-5 text-amber-500" />
                      Google Drive Files & Backup
                    </h3>
                    <p className="text-xs text-slate-500">Access Drive resources and backup class schedules</p>
                  </div>
                  <button
                    onClick={handleBackupToDrive}
                    disabled={loading}
                    className="px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-xl hover:bg-amber-700 transition-colors"
                  >
                    Backup Class to Drive
                  </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Drive Files</h4>
                  {driveFiles.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No Drive files found</p>
                  ) : (
                    driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <HardDrive className="w-4 h-4 text-amber-500" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{file.name}</p>
                            <p className="text-[10px] text-slate-400">{file.mimeType}</p>
                          </div>
                        </div>
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* GOOGLE CONTACTS TAB */}
            {activeTab === 'contacts' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Google Contacts (People API)
                  </h3>
                  <p className="text-xs text-slate-500">Your Google Contacts for quick cohort roster invites</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contactsList.length === 0 ? (
                    <div className="col-span-2 bg-white p-8 rounded-2xl border border-slate-200 text-center">
                      <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-medium">No contacts with email addresses found</p>
                    </div>
                  ) : (
                    contactsList.map((contact, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {contact.name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{contact.name}</p>
                            <p className="text-[11px] text-slate-500">{contact.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setGmailTo(contact.email);
                            setActiveTab('gmail');
                          }}
                          className="px-2 py-1 text-[11px] text-blue-600 hover:bg-blue-50 rounded-lg font-semibold"
                        >
                          Email
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* GOOGLE CHAT TAB */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-600" />
                    Google Chat Space Broadcasts
                  </h3>
                  <p className="text-xs text-slate-500">Send assignment notifications directly to Google Chat</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Space</label>
                    <select
                      value={selectedChatSpace}
                      onChange={(e) => setSelectedChatSpace(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      {chatSpaces.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.displayName || s.name}
                        </option>
                      ))}
                      {chatSpaces.length === 0 && <option value="">No Chat spaces found</option>}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                    <textarea
                      rows={3}
                      value={chatMessageText}
                      onChange={(e) => setChatMessageText(e.target.value)}
                      placeholder="🚨 [Classora Alert] New CS401 assignment posted with due date Friday..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSendChatMessage}
                      disabled={loading || !selectedChatSpace || !chatMessageText}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post to Space</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
