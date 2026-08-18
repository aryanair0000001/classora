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
  AppNotification
} from '../types/index.js';

const API_BASE = '/api';

export const api = {
  // 1. Profile & Role Management
  async getProfile(): Promise<UserProfile & { activeClass: ClassCohort; enrolledClasses: ClassCohort[] }> {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
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

  async createUniversity(data: { name: string; country?: string; campus?: string }): Promise<University> {
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

  async getClassMembers(): Promise<ClassMember[]> {
    const res = await fetch(`${API_BASE}/members`);
    if (!res.ok) throw new Error('Failed to fetch class members');
    return res.json();
  },

  // 3. Assignments API
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

  // 4. Announcements API
  async getAnnouncements(): Promise<Announcement[]> {
    const res = await fetch(`${API_BASE}/announcements`);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  async createAnnouncement(data: {
    title: string;
    content: string;
    priority: 'Urgent' | 'Normal' | 'Info';
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

  // 5. Notifications
  async getNotifications(): Promise<AppNotification[]> {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, { method: 'POST' });
  },

  // 6. Calendar Export
  getCalendarExportUrl(): string {
    return `${API_BASE}/export/calendar.ics`;
  }
};
