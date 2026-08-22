import {
  Assignment,
  Announcement,
  ClassCohort,
  ClassMember,
  University,
  Role,
  Priority,
  UserProfile,
  Attachment,
  AppNotification,
  JoinRequest,
  ClassResource,
  ChatMessage,
  ClassSubject,
  StudentSubmission,
  TimetableClass,
  StudyNote,
  LeaderboardEntry,
  StudentAnalytics
} from '../types/index.js';

const API_BASE = '/api';

export const api = {
  // 1. Profile & Role Management
  async getProfile(): Promise<UserProfile & { activeClass: ClassCohort; enrolledClasses: ClassCohort[] }> {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async updateProfile(data: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile }> {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async setRole(role: Role): Promise<{ success: boolean; role: Role }> {
    const res = await fetch(`${API_BASE}/profile/role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  },

  async switchClass(classId: string): Promise<{ success: boolean; activeClass: ClassCohort }> {
    const res = await fetch(`${API_BASE}/profile/switch-class`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId })
    });
    if (!res.ok) throw new Error('Failed to switch class');
    return res.json();
  },

  // 2. Universities & Cohort Management
  async getUniversities(): Promise<University[]> {
    const res = await fetch(`${API_BASE}/universities`);
    if (!res.ok) throw new Error('Failed to fetch universities');
    return res.json();
  },

  async createUniversity(data: { name: string; country?: string; campus?: string; code?: string }): Promise<University> {
    const res = await fetch(`${API_BASE}/universities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create university');
    return res.json();
  },

  async getClasses(): Promise<ClassCohort[]> {
    const res = await fetch(`${API_BASE}/classes`);
    if (!res.ok) throw new Error('Failed to fetch classes');
    return res.json();
  },

  async createClass(data: Partial<ClassCohort>): Promise<ClassCohort> {
    const res = await fetch(`${API_BASE}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create class');
    }
    return res.json();
  },

  // 3. Join Request & Approval (CR Governed)
  async joinClassByCode(code: string): Promise<{ success: boolean; activeClass: ClassCohort }> {
    const res = await fetch(`${API_BASE}/classes/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to join class');
    }
    return res.json();
  },

  async joinClass(code: string): Promise<{ success: boolean; activeClass: ClassCohort }> {
    return this.joinClassByCode(code);
  },

  async sendJoinRequest(code: string): Promise<{ success: boolean; message: string; request: JoinRequest }> {
    const res = await fetch(`${API_BASE}/classes/join-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit join request');
    }
    return res.json();
  },

  async getJoinRequests(): Promise<JoinRequest[]> {
    const res = await fetch(`${API_BASE}/classes/requests`);
    if (!res.ok) throw new Error('Failed to fetch join requests');
    return res.json();
  },

  async approveJoinRequest(id: string): Promise<{ success: boolean; approvedRequest: JoinRequest }> {
    const res = await fetch(`${API_BASE}/classes/requests/${id}/approve`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to approve student');
    }
    return res.json();
  },

  async rejectJoinRequest(id: string): Promise<{ success: boolean; rejectedRequest: JoinRequest }> {
    const res = await fetch(`${API_BASE}/classes/requests/${id}/reject`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reject request');
    }
    return res.json();
  },

  async regenerateClassCode(): Promise<{ success: boolean; newCode: string }> {
    const res = await fetch(`${API_BASE}/classes/regenerate-code`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to regenerate code');
    }
    return res.json();
  },

  // 4. Class Members
  async getClassMembers(): Promise<ClassMember[]> {
    const res = await fetch(`${API_BASE}/members`);
    if (!res.ok) throw new Error('Failed to fetch class members');
    return res.json();
  },

  async removeMember(id: string): Promise<{ success: boolean; removed: ClassMember }> {
    const res = await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to remove student');
    }
    return res.json();
  },

  // 5. Assignments API
  async getAssignments(params?: {
    priority?: string;
    search?: string;
    subject?: string;
    status?: string;
  }): Promise<Assignment[]> {
    const query = new URLSearchParams();
    if (params?.priority && params.priority !== 'ALL') query.set('priority', params.priority);
    if (params?.subject && params.subject !== 'ALL') query.set('subject', params.subject);
    if (params?.status && params.status !== 'ALL') query.set('status', params.status);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/assignments?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  },

  async createAssignment(data: {
    title: string;
    subjectCode: string;
    subjectName?: string;
    teacher?: string;
    owner?: string;
    description?: string;
    priority: Priority;
    estimatedHours: number;
    dueDate: string;
    dueDateISO?: string;
    instructions?: string[];
    attachments?: Attachment[];
  }): Promise<Assignment> {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create assignment');
    }
    return res.json();
  },

  async toggleComplete(id: string): Promise<{ id: string; isCompleted: boolean; completedAt?: string }> {
    const res = await fetch(`${API_BASE}/assignments/${id}/toggle-complete`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle completion');
    return res.json();
  },

  async togglePin(id: string): Promise<{ id: string; isPinned: boolean }> {
    const res = await fetch(`${API_BASE}/assignments/${id}/pin`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to pin assignment');
    return res.json();
  },

  async verifyAssignment(id: string): Promise<Assignment> {
    const res = await fetch(`${API_BASE}/assignments/${id}/verify`, { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to verify assignment');
    }
    return res.json();
  },

  async deleteAssignment(id: string): Promise<{ success: boolean; removedId: string }> {
    const res = await fetch(`${API_BASE}/assignments/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete assignment');
    }
    return res.json();
  },

  // 5b. Submissions & Grading API
  async getSubmissions(assignmentId: string): Promise<StudentSubmission[]> {
    const res = await fetch(`${API_BASE}/assignments/${assignmentId}/submissions`);
    if (!res.ok) throw new Error('Failed to fetch submissions');
    return res.json();
  },

  async getMySubmission(assignmentId: string): Promise<StudentSubmission> {
    const res = await fetch(`${API_BASE}/assignments/${assignmentId}/my-submission`);
    if (!res.ok) throw new Error('Failed to fetch submission status');
    return res.json();
  },

  async submitAssignment(assignmentId: string, data: { content?: string; attachments?: Attachment[] }): Promise<StudentSubmission> {
    const res = await fetch(`${API_BASE}/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit assignment');
    }
    return res.json();
  },

  async reviewSubmission(submissionId: string, data: { grade?: string; feedback?: string; status?: string }): Promise<StudentSubmission> {
    const res = await fetch(`${API_BASE}/submissions/${submissionId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to grade submission');
    }
    return res.json();
  },

  async transferCR(classId: string, newCrEmail: string, newCrName: string): Promise<{ success: boolean; updatedClass: ClassCohort }> {
    const res = await fetch(`${API_BASE}/classes/transfer-cr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId, newCrEmail, newCrName })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to transfer CR ownership');
    }
    return res.json();
  },

  // 6. Announcements API
  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch(`${API_BASE}/announcements`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  async createAnnouncement(data: {
    title: string;
    content: string;
    priority: 'Urgent' | 'Normal' | 'Info';
    isPinned?: boolean;
  }): Promise<Announcement> {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to broadcast announcement');
    }
    return res.json();
  },

  // 7. Class Chat Messages
  async getMessages(): Promise<ChatMessage[]> {
    const res = await fetch(`${API_BASE}/classes/messages`);
    if (!res.ok) throw new Error('Failed to fetch chat messages');
    return res.json();
  },

  async sendMessage(data: { message: string; replyToId?: string; replyToText?: string }): Promise<ChatMessage> {
    const res = await fetch(`${API_BASE}/classes/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to send message');
    }
    return res.json();
  },

  async togglePinMessage(id: string): Promise<{ id: string; isPinned: boolean }> {
    const res = await fetch(`${API_BASE}/classes/messages/${id}/pin`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to pin message');
    return res.json();
  },

  // 8. Class Resources
  async getResources(): Promise<ClassResource[]> {
    const res = await fetch(`${API_BASE}/classes/resources`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },

  async createResource(data: {
    title: string;
    description?: string;
    type: 'PDF' | 'DOC' | 'PPT' | 'LINK' | 'IMAGE';
    fileUrl?: string;
    linkUrl?: string;
    size?: string;
  }): Promise<ClassResource> {
    const res = await fetch(`${API_BASE}/classes/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create resource');
    }
    return res.json();
  },

  async deleteResource(id: string): Promise<{ success: boolean; removed: ClassResource }> {
    const res = await fetch(`${API_BASE}/classes/resources/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete resource');
    return res.json();
  },

  // 9. Class Subjects
  async getSubjects(): Promise<ClassSubject[]> {
    const res = await fetch(`${API_BASE}/classes/subjects`);
    if (!res.ok) throw new Error('Failed to fetch subjects');
    return res.json();
  },

  async createSubject(data: { code: string; name: string; teacherName?: string; credits?: number; color?: string }): Promise<ClassSubject> {
    const res = await fetch(`${API_BASE}/classes/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create subject');
    return res.json();
  },

  // 10. AI Study Hub (Modular AIService)
  async summarizeNotes(notes: string, topic?: string): Promise<{ summary: string }> {
    const res = await fetch(`${API_BASE}/api/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, topic })
    });
    if (!res.ok) throw new Error('AI summary generation failed');
    return res.json();
  },

  async generateQuiz(topic: string): Promise<{ quiz: any[] }> {
    const res = await fetch(`${API_BASE}/api/ai/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    if (!res.ok) throw new Error('AI quiz generation failed');
    return res.json();
  },

  // 11. Notifications
  async getNotifications(): Promise<AppNotification[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, { method: 'POST' });
  },

  // 12. Calendar Export
  getCalendarExportUrl(): string {
    return `${API_BASE}/export/calendar.ics`;
  },

  // 13. Timetable
  async getTimetable(): Promise<TimetableClass[]> {
    const res = await fetch(`${API_BASE}/timetable`);
    if (!res.ok) throw new Error('Failed to fetch timetable');
    return res.json();
  },

  // 14. Notes Hub
  async getNotes(params?: { subject?: string; search?: string }): Promise<StudyNote[]> {
    const url = new URL(`${window.location.origin}${API_BASE}/notes`);
    if (params?.subject && params.subject !== 'ALL') url.searchParams.set('subject', params.subject);
    if (params?.search) url.searchParams.set('search', params.search);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch study notes');
    return res.json();
  },

  async uploadNote(data: Partial<StudyNote>): Promise<StudyNote> {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload note');
    }
    return res.json();
  },

  async toggleNoteBookmark(id: string): Promise<{ success: boolean; isBookmarked: boolean }> {
    const res = await fetch(`${API_BASE}/notes/${id}/bookmark`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to bookmark note');
    return res.json();
  },

  // 15. Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const res = await fetch(`${API_BASE}/leaderboard`);
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
  },

  // 16. Analytics
  async getAnalytics(): Promise<StudentAnalytics> {
    const res = await fetch(`${API_BASE}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // 17. AI Doubt Solver & Homework Explainer
  async askAIDoubt(data: { question: string; subject?: string; codeSnippet?: string }): Promise<{ answer: string; source: string }> {
    const res = await fetch(`${API_BASE}/ai/doubt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'AI request failed');
    }
    return res.json();
  }
};
