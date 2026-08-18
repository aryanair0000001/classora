export type Role = 'STUDENT' | 'CR' | 'FACULTY' | 'ADMIN';

export type Priority = 'Critical' | 'High' | 'Normal' | 'Low';

export type AssignmentStatus = 'Active' | 'In Review' | 'Submitted' | 'Verified' | 'Archived';

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl?: string; // base64 or file URL for real download
  uploadedAt: string;
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
  relativeTime: string;
  isCompleted: boolean;
  completedAt?: string;
  isPinned: boolean;
  isVerified: boolean;
  verifiedBy?: string;
  instructions: string[];
  attachments: Attachment[];
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
}

export interface University {
  id: string;
  name: string;
  country: string;
  campus?: string;
}

export interface ClassCohort {
  id: string;
  code: string;
  name: string;
  universityId: string;
  universityName: string;
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
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'announcement' | 'reminder' | 'verification';
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
}
