export type Role = 'STUDENT' | 'CR' | 'TEACHER' | 'FACULTY' | 'ADMIN';

export type Priority = 'Critical' | 'High' | 'Normal' | 'Low';

export type AssignmentStatus = 'Active' | 'In Review' | 'Submitted' | 'Verified' | 'Archived';

export type SubmissionState = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'LATE' | 'RETURNED' | 'COMPLETED';

export type DeadlineUrgency = 'OVERDUE' | 'DUE_TODAY' | 'DUE_TOMORROW' | 'DUE_THIS_WEEK' | 'UPCOMING';

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl?: string; // base64 or file URL for real download
  uploadedAt: string;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentRollNo?: string;
  studentEmail: string;
  status: SubmissionState;
  submittedAt?: string;
  content?: string;
  attachments: Attachment[];
  grade?: string;
  feedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  isLate?: boolean;
}

export interface AssignmentCompletion {
  assignmentId: string;
  userId: string;
  isCompleted: boolean;
  completedAt?: string;
  notes?: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  teacher: string;
  owner: string;
  description: string;
  status: AssignmentStatus;
  priority: Priority;
  estimatedHours: number;
  dueDate: string;
  dueDateISO: string;
  dueTime?: string;
  timezone?: string;
  relativeTime: string;
  urgency?: DeadlineUrgency;
  isCompleted: boolean;
  completedAt?: string;
  isPinned: boolean;
  isImportant?: boolean;
  isVerified: boolean;
  verifiedBy?: string;
  instructions: string[];
  attachments: Attachment[];
  links?: { title: string; url: string }[];
  completionsCount?: number;
  totalEnrolled?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByRole: Role;
}

export interface Announcement {
  id: string;
  classId: string;
  title: string;
  content: string;
  author: string;
  authorRole: Role;
  priority: 'Urgent' | 'Normal' | 'Info';
  createdAt: string;
  relativeTime: string;
  isPinned?: boolean;
}

export interface University {
  id: string;
  name: string;
  country: string;
  campus?: string;
  code?: string;
  website?: string;
  isCustom?: boolean;
}

export interface ClassCohort {
  id: string;
  code: string;
  name: string;
  universityId: string;
  universityName: string;
  schoolOrFaculty?: string;
  department?: string;
  program: string;
  branch: string;
  semester: string;
  section: string;
  academicYear: string;
  totalStudents: number;
  crName: string;
  crEmail: string;
  facultyInCharge: string;
  createdAt: string;
}

export interface ClassMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  rollNo?: string;
  joinedAt: string;
  avatar?: string;
}

export interface JoinRequest {
  id: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  rollNo?: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ClassResource {
  id: string;
  classId: string;
  title: string;
  description?: string;
  type: 'PDF' | 'DOC' | 'PPT' | 'LINK' | 'IMAGE';
  fileUrl?: string;
  linkUrl?: string;
  uploadedBy: string;
  uploadedByRole: Role;
  uploadedAt: string;
  size?: string;
}

export interface ChatMessage {
  id: string;
  classId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  message: string;
  timestamp: string;
  isPinned?: boolean;
  isAnnouncement?: boolean;
  replyToId?: string;
  replyToText?: string;
}

export interface ClassSubject {
  id: string;
  code: string;
  name: string;
  teacherName: string;
  credits?: number;
  color?: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'assignment' | 'announcement' | 'reminder' | 'verification' | 'join_request' | 'approval';
  referenceId?: string;
  timestamp: string;
  isRead: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  activeClassId: string;
  enrolledClassIds: string[];
  university: string;
  department?: string;
  program?: string;
  branch?: string;
  semester?: string;
  section?: string;
  rollNo?: string;
  avatar?: string;
  pendingJoinRequests?: { classId: string; className: string; requestedAt: string }[];
  isOnboarded?: boolean;
}

export interface TimetableClass {
  id: string;
  subjectCode: string;
  subjectName: string;
  teacher: string;
  time: string;
  room: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
}

export interface StudyNote {
  id: string;
  classId: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  description?: string;
  type: 'PDF' | 'DOC' | 'PPT' | 'IMG' | 'NOTE';
  fileUrl?: string;
  author: string;
  authorRole: Role;
  uploadedAt: string;
  size: string;
  downloadsCount: number;
  isBookmarked?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  rollNo?: string;
  avatar?: string;
  xp: number;
  streakDays: number;
  completedAssignments: number;
  onTimeRate: number;
  badge?: string;
}

export interface StudentAnalytics {
  completionRate: number;
  onTimeSubmissionRate: number;
  studyStreakDays: number;
  totalCompletedTasks: number;
  totalPendingTasks: number;
  weeklyActivity: { day: string; hours: number; tasks: number }[];
  subjectPerformance: { subject: string; score: number; total: number; color: string }[];
}

export type MainNavigationTab = 
  | 'home'
  | 'assignments'
  | 'classes'
  | 'calendar'
  | 'ai'
  | 'notes'
  | 'analytics'
  | 'leaderboard'
  | 'profile'
  | 'cr-workspace'
  | 'faculty-workspace';
