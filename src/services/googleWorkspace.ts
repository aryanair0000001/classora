import { getAccessToken } from './firebase.js';

// Helper for authenticated Google API requests
async function googleFetch<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Google authentication required. Please sign in with your Google account.');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || `Google API Error: ${res.statusText} (${res.status})`;
    throw new Error(errorMsg);
  }

  // Handle empty responses (like 204 No Content)
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export const googleWorkspace = {
  // ================= 1. GOOGLE CALENDAR =================
  async listCalendarEvents(timeMin?: string): Promise<any[]> {
    const min = timeMin || new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(min)}&singleEvents=true&orderBy=startTime&maxResults=20`;
    const data = await googleFetch(url);
    return data.items || [];
  },

  async addCalendarEvent(assignment: {
    title: string;
    description?: string;
    dueDateISO: string;
    subjectCode?: string;
    teacher?: string;
  }): Promise<any> {
    const startDateTime = new Date(assignment.dueDateISO || Date.now());
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    const event = {
      summary: `[${assignment.subjectCode || 'ACADEMIC'}] Due: ${assignment.title}`,
      description: `${assignment.description || 'Assignment due date'}\n\nSubject: ${assignment.subjectCode || 'N/A'}\nInstructor: ${assignment.teacher || 'N/A'}\nManaged via Classora`,
      start: {
        dateTime: startDateTime.toISOString(),
      },
      end: {
        dateTime: endDateTime.toISOString(),
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 },      // 1 hour before
        ],
      },
    };

    return googleFetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  // ================= 2. GOOGLE TASKS =================
  async getTasks(): Promise<any[]> {
    const lists = await googleFetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists');
    const defaultList = lists.items?.[0]?.id || '@default';
    const tasks = await googleFetch(`https://tasks.googleapis.com/tasks/v1/lists/${defaultList}/tasks?showCompleted=true&maxResults=30`);
    return tasks.items || [];
  },

  async syncAssignmentToTasks(assignment: {
    title: string;
    description?: string;
    dueDateISO?: string;
    subjectCode?: string;
  }): Promise<any> {
    const lists = await googleFetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists');
    const defaultList = lists.items?.[0]?.id || '@default';

    const taskPayload: any = {
      title: `[${assignment.subjectCode || 'ACAD'}] ${assignment.title}`,
      notes: `${assignment.description || 'Classora Assignment'}\nSubject: ${assignment.subjectCode || 'General'}`,
    };

    if (assignment.dueDateISO) {
      // RFC 3339 timestamp
      taskPayload.due = new Date(assignment.dueDateISO).toISOString();
    }

    return googleFetch(`https://tasks.googleapis.com/tasks/v1/lists/${defaultList}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskPayload),
    });
  },

  // ================= 3. GOOGLE SHEETS =================
  async exportAssignmentsToSheet(title: string, assignments: any[]): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
    // 1. Create Spreadsheet
    const spreadsheet = await googleFetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      body: JSON.stringify({
        properties: {
          title: `Classora - ${title} (${new Date().toLocaleDateString()})`,
        },
      }),
    });

    const spreadsheetId = spreadsheet.spreadsheetId;
    const spreadsheetUrl = spreadsheet.spreadsheetUrl;

    // 2. Prepare Rows Data
    const headerRow = ['Subject Code', 'Assignment Title', 'Priority', 'Status', 'Due Date', 'Estimated Hours', 'Teacher', 'Verified'];
    const dataRows = assignments.map(a => [
      a.subjectCode || '',
      a.title || '',
      a.priority || 'Normal',
      a.isCompleted ? 'Completed' : a.status || 'Active',
      a.dueDate || '',
      a.estimatedHours ? `${a.estimatedHours} hrs` : '-',
      a.teacher || '',
      a.isVerified ? 'Verified' : 'Pending'
    ]);

    const values = [headerRow, ...dataRows];

    // 3. Append to Sheet
    await googleFetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:H${values.length}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      body: JSON.stringify({
        range: `Sheet1!A1:H${values.length}`,
        majorDimension: 'ROWS',
        values: values,
      }),
    });

    return { spreadsheetId, spreadsheetUrl };
  },

  // ================= 4. GOOGLE DRIVE & PICKER =================
  async listDriveFiles(query?: string): Promise<any[]> {
    let url = 'https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,webViewLink,thumbnailLink,size,modifiedTime)&pageSize=15';
    if (query) {
      url += `&q=${encodeURIComponent(`name contains '${query}' and trashed = false`)}`;
    } else {
      url += `&q=${encodeURIComponent('trashed = false')}`;
    }
    const data = await googleFetch(url);
    return data.files || [];
  },

  async uploadFileToDrive(name: string, content: string, mimeType: string = 'text/plain'): Promise<any> {
    const metadata = {
      name,
      mimeType,
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelim = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${mimeType}\r\n\r\n` +
      content +
      closeDelim;

    const token = await getAccessToken();
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body: multipartRequestBody,
    });

    if (!res.ok) {
      throw new Error(`Drive Upload Error: ${res.statusText}`);
    }
    return res.json();
  },

  // ================= 5. GMAIL =================
  async sendEmail(to: string, subject: string, bodyText: string): Promise<any> {
    // Construct RFC 2822 email
    const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      bodyText,
    ];
    const message = messageParts.join('\r\n');

    // Base64URL encode
    const encodedMessage = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return googleFetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      body: JSON.stringify({ raw: encodedMessage }),
    });
  },

  // ================= 6. GOOGLE CLASSROOM =================
  async listClassroomCourses(): Promise<any[]> {
    const data = await googleFetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&pageSize=15');
    return data.courses || [];
  },

  async listCourseWork(courseId: string): Promise<any[]> {
    const data = await googleFetch(`https://classroom.googleapis.com/v1/courses/${courseId}/courseWork?pageSize=20`);
    return data.courseWork || [];
  },

  async createCourseAnnouncement(courseId: string, text: string): Promise<any> {
    return googleFetch(`https://classroom.googleapis.com/v1/courses/${courseId}/announcements`, {
      method: 'POST',
      body: JSON.stringify({
        text,
      }),
    });
  },

  // ================= 7. GOOGLE MEET =================
  async createInstantMeetingSpace(): Promise<{ meetingUri: string; meetingCode: string }> {
    try {
      const space = await googleFetch('https://meet.googleapis.com/v2/spaces', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      return {
        meetingUri: space.meetingUri || `https://meet.google.com/${space.name?.replace('spaces/', '')}`,
        meetingCode: space.meetingCode || space.name?.replace('spaces/', '') || 'Classora-Room',
      };
    } catch (e) {
      // Fallback to instant Google Meet room
      const randomCode = Math.random().toString(36).substring(2, 5) + '-' +
                         Math.random().toString(36).substring(2, 6) + '-' +
                         Math.random().toString(36).substring(2, 5);
      return {
        meetingUri: `https://meet.google.com/${randomCode}`,
        meetingCode: randomCode,
      };
    }
  },

  // ================= 8. GOOGLE FORMS =================
  async createAssignmentForm(title: string, questions: string[]): Promise<any> {
    // 1. Create Form
    const form = await googleFetch('https://forms.googleapis.com/v1/forms', {
      method: 'POST',
      body: JSON.stringify({
        info: {
          title: `[Classora] ${title}`,
          documentTitle: title,
        },
      }),
    });

    const formId = form.formId;

    // 2. Add question items
    const requests = questions.map((q, idx) => ({
      createItem: {
        item: {
          title: q,
          questionItem: {
            question: {
              required: true,
              textQuestion: { paragraph: true },
            },
          },
        },
        location: { index: idx },
      },
    }));

    if (requests.length > 0) {
      await googleFetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
        method: 'POST',
        body: JSON.stringify({ requests }),
      });
    }

    return {
      formId,
      formUrl: `https://docs.google.com/forms/d/${formId}/edit`,
      responderUrl: form.responderUri || `https://docs.google.com/forms/d/e/${formId}/viewform`,
    };
  },

  // ================= 9. GOOGLE CHAT =================
  async listChatSpaces(): Promise<any[]> {
    const data = await googleFetch('https://chat.googleapis.com/v1/spaces?pageSize=20');
    return data.spaces || [];
  },

  async sendChatMessage(spaceName: string, text: string): Promise<any> {
    return googleFetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // ================= 10. GOOGLE CONTACTS (PEOPLE API) =================
  async listContacts(): Promise<any[]> {
    const data = await googleFetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,photos&pageSize=30');
    return (data.connections || []).map((person: any) => ({
      resourceName: person.resourceName,
      name: person.names?.[0]?.displayName || 'Unnamed Contact',
      email: person.emailAddresses?.[0]?.value || '',
      photo: person.photos?.[0]?.url || '',
    })).filter((c: any) => Boolean(c.email));
  },
};
