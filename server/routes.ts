import { Router, Request, Response } from 'express';
import { store } from './store.js';
import { Assignment, Announcement, Priority, Role, ClassCohort, Attachment } from '../src/types/index.js';

export const apiRouter = Router();

// 1. Health check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Universities API
apiRouter.get('/universities', (req: Request, res: Response) => {
  const data = store.get();
  res.json(data.universities);
});

apiRouter.post('/universities', (req: Request, res: Response) => {
  const { name, country, campus } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'University name is required' });
  }

  const data = store.get();
  const id = `univ-${Date.now()}`;
  const newUniv = { id, name: name.trim(), country: country || 'Global', campus: campus || 'Main Campus' };
  data.universities.push(newUniv);
  store.save();
  res.status(201).json(newUniv);
});

// 3. User Profile & Role API
apiRouter.get('/profile', (req: Request, res: Response) => {
  const data = store.get();
  const activeClass = store.getActiveCohort();
  res.json({
    ...data.profile,
    activeClass,
    enrolledClasses: data.classes.filter(c => data.profile.enrolledClassIds.includes(c.id))
  });
});

apiRouter.post('/profile/role', (req: Request, res: Response) => {
  const { role } = req.body;
  if (!['STUDENT', 'CR', 'FACULTY', 'ADMIN'].includes(role)) {
    return res.status(400).json({ error: 'Invalid academic role' });
  }

  const data = store.get();
  data.profile.role = role as Role;
  store.save();
  res.json({ success: true, role: data.profile.role });
});

apiRouter.post('/profile/switch-class', (req: Request, res: Response) => {
  const { classId } = req.body;
  const data = store.get();
  const target = data.classes.find(c => c.id === classId);
  if (!target) {
    return res.status(404).json({ error: 'Class cohort not found' });
  }

  data.profile.activeClassId = classId;
  if (!data.profile.enrolledClassIds.includes(classId)) {
    data.profile.enrolledClassIds.push(classId);
  }
  store.save();
  res.json({ success: true, activeClass: target });
});

// 4. Class Cohorts API
apiRouter.get('/classes', (req: Request, res: Response) => {
  const data = store.get();
  res.json(data.classes);
});

apiRouter.post('/classes', (req: Request, res: Response) => {
  const {
    code,
    name,
    universityName,
    program,
    branch,
    semester,
    section,
    academicYear,
    facultyInCharge
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Class name is required' });
  }

  const data = store.get();
  const classId = `cohort-${Date.now()}`;
  const generatedCode = (code || `${(program || 'CLS').slice(0, 3)}-${(section || 'A')}-${Math.floor(100 + Math.random() * 900)}`).toUpperCase();

  const newCohort: ClassCohort = {
    id: classId,
    code: generatedCode,
    name: name.trim(),
    universityId: 'univ-custom',
    universityName: universityName || data.profile.university || 'Global University Network',
    program: program || 'Bachelor of Science / Technology',
    branch: branch || 'Computer Science',
    semester: semester || 'Semester 4',
    section: section || 'Section A',
    academicYear: academicYear || '2025-2026',
    totalStudents: 1,
    crName: data.profile.name,
    crEmail: data.profile.email,
    facultyInCharge: facultyInCharge || 'Faculty Advisor',
    createdAt: new Date().toISOString()
  };

  data.classes.push(newCohort);
  data.profile.enrolledClassIds.push(classId);
  data.profile.activeClassId = classId;

  // Add initial member
  data.members[classId] = [
    {
      id: `mem-${Date.now()}`,
      name: data.profile.name,
      email: data.profile.email,
      role: data.profile.role,
      rollNo: 'CR-001',
      joinedAt: new Date().toISOString()
    }
  ];

  store.save();
  res.status(201).json(newCohort);
});

apiRouter.post('/classes/join', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Class code is required' });
  }

  const cleanCode = code.trim().toUpperCase();
  const data = store.get();
  const cohort = data.classes.find(c => c.code.toUpperCase() === cleanCode);

  if (!cohort) {
    return res.status(404).json({ error: `No class found with code "${cleanCode}". Please verify with your Class Representative.` });
  }

  if (!data.profile.enrolledClassIds.includes(cohort.id)) {
    data.profile.enrolledClassIds.push(cohort.id);
    cohort.totalStudents += 1;

    // Add to members list
    if (!data.members[cohort.id]) data.members[cohort.id] = [];
    data.members[cohort.id].push({
      id: `mem-${Date.now()}`,
      name: data.profile.name,
      email: data.profile.email,
      role: 'STUDENT',
      rollNo: `22CS${Math.floor(100 + Math.random() * 900)}`,
      joinedAt: new Date().toISOString()
    });
  }

  data.profile.activeClassId = cohort.id;
  store.save();
  res.json({ success: true, activeClass: cohort });
});

// 5. Class Members API
apiRouter.get('/members', (req: Request, res: Response) => {
  const data = store.get();
  const activeClassId = data.profile.activeClassId;
  const list = data.members[activeClassId] || [];
  res.json(list);
});

// 6. Assignments API (CRUD with Filtering & Permissions)
apiRouter.get('/assignments', (req: Request, res: Response) => {
  const { priority, search, subject, status, classId } = req.query;
  const data = store.get();
  const targetClassId = (classId as string) || data.profile.activeClassId;

  let list = data.assignments.filter(a => a.classId === targetClassId);

  if (priority && priority !== 'ALL') {
    list = list.filter(a => a.priority === priority);
  }

  if (subject && subject !== 'ALL') {
    list = list.filter(a => a.subjectCode === subject);
  }

  if (status && status !== 'ALL') {
    if (status === 'COMPLETED') {
      list = list.filter(a => a.isCompleted);
    } else if (status === 'PENDING') {
      list = list.filter(a => !a.isCompleted);
    } else {
      list = list.filter(a => a.status === status);
    }
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.subjectCode.toLowerCase().includes(q) ||
      a.subjectName.toLowerCase().includes(q) ||
      a.teacher.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );
  }

  // Sort: Pinned first, then nearest deadline
  list.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(a.dueDateISO).getTime() - new Date(b.dueDateISO).getTime();
  });

  res.json(list);
});

apiRouter.post('/assignments', (req: Request, res: Response) => {
  const data = store.get();
  const userRole = data.profile.role;

  // PRD Requirement: Students cannot publish without CR or Faculty privilege
  if (userRole === 'STUDENT') {
    return res.status(403).json({
      error: 'Permission Denied: Only verified Class Representatives (CR) or Faculty can publish assignments to the class cohort.'
    });
  }

  const {
    title,
    subjectCode,
    subjectName,
    teacher,
    owner,
    description,
    priority,
    estimatedHours,
    dueDate,
    dueDateISO,
    instructions,
    attachments
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Assignment title is required' });
  }

  const activeCohort = store.getActiveCohort();
  const newId = `CU-${(subjectCode || 'CS').replace(/[^a-zA-Z0-9]/g, '').slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;

  const calculatedDueDate = dueDateISO || new Date(Date.now() + 24 * 3600 * 1000).toISOString();

  const newAssignment: Assignment = {
    id: newId,
    classId: activeCohort.id,
    title: title.trim(),
    subjectCode: subjectCode || 'CST-241',
    subjectName: subjectName || 'Computer Science Core',
    teacher: teacher || (userRole === 'FACULTY' ? data.profile.name : activeCohort.facultyInCharge),
    owner: owner || data.profile.name,
    description: description || 'Complete the assignment according to standard lab rubric guidelines.',
    status: 'Active',
    priority: (priority as Priority) || 'High',
    estimatedHours: Number(estimatedHours) || 3.0,
    dueDate: dueDate || 'Tomorrow • 11:59 PM',
    dueDateISO: calculatedDueDate,
    relativeTime: 'Due Tomorrow',
    isCompleted: false,
    isPinned: false,
    isVerified: userRole === 'FACULTY',
    verifiedBy: userRole === 'FACULTY' ? data.profile.name : undefined,
    instructions: Array.isArray(instructions) && instructions.length > 0
      ? instructions
      : [
          'Read the problem statement and review course lecture materials.',
          'Verify code/document formatting before submitting.',
          'Submit the final file in LMS before the specified deadline.'
        ],
    attachments: Array.isArray(attachments) ? attachments : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.profile.name,
    createdByRole: userRole
  };

  data.assignments.unshift(newAssignment);

  // Send real notification
  data.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: `📝 New Assignment: ${newAssignment.id}`,
    message: `"${newAssignment.title}" (${newAssignment.subjectCode}) published by ${data.profile.name}.`,
    type: 'assignment',
    referenceId: newAssignment.id,
    timestamp: 'Just now',
    isRead: false
  });

  store.save();
  res.status(201).json(newAssignment);
});

apiRouter.put('/assignments/:id', (req: Request, res: Response) => {
  const data = store.get();
  const index = data.assignments.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  const existing = data.assignments[index];
  const updated: Assignment = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString()
  };

  data.assignments[index] = updated;
  store.save();
  res.json(updated);
});

apiRouter.post('/assignments/:id/toggle-complete', (req: Request, res: Response) => {
  const data = store.get();
  const target = data.assignments.find(a => a.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'Assignment not found' });

  target.isCompleted = !target.isCompleted;
  target.completedAt = target.isCompleted ? new Date().toISOString() : undefined;
  target.updatedAt = new Date().toISOString();
  store.save();
  res.json({ id: target.id, isCompleted: target.isCompleted, completedAt: target.completedAt });
});

apiRouter.post('/assignments/:id/pin', (req: Request, res: Response) => {
  const data = store.get();
  if (data.profile.role === 'STUDENT') {
    return res.status(403).json({ error: 'Only CRs or Faculty can pin assignments.' });
  }

  const target = data.assignments.find(a => a.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'Assignment not found' });

  target.isPinned = !target.isPinned;
  target.updatedAt = new Date().toISOString();
  store.save();
  res.json({ id: target.id, isPinned: target.isPinned });
});

apiRouter.post('/assignments/:id/verify', (req: Request, res: Response) => {
  const data = store.get();
  if (data.profile.role !== 'FACULTY' && data.profile.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only verified faculty members can grant official verification badges.' });
  }

  const target = data.assignments.find(a => a.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'Assignment not found' });

  target.isVerified = true;
  target.verifiedBy = data.profile.name;
  target.status = 'Verified';
  target.updatedAt = new Date().toISOString();

  data.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: `✓ Verified by Faculty: ${target.id}`,
    message: `${target.title} has been officially verified with rubric criteria by ${data.profile.name}.`,
    type: 'verification',
    referenceId: target.id,
    timestamp: 'Just now',
    isRead: false
  });

  store.save();
  res.json(target);
});

apiRouter.delete('/assignments/:id', (req: Request, res: Response) => {
  const data = store.get();
  if (data.profile.role === 'STUDENT') {
    return res.status(403).json({ error: 'Only CRs or Faculty can delete/archive assignments.' });
  }

  const index = data.assignments.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Assignment not found' });

  const removed = data.assignments.splice(index, 1)[0];
  store.save();
  res.json({ success: true, removedId: removed.id });
});

// 7. Announcements API
apiRouter.get('/announcements', (req: Request, res: Response) => {
  const data = store.get();
  const activeClassId = data.profile.activeClassId;
  const list = data.announcements.filter(a => a.classId === activeClassId);
  res.json(list);
});

apiRouter.post('/announcements', (req: Request, res: Response) => {
  const data = store.get();
  if (data.profile.role === 'STUDENT') {
    return res.status(403).json({ error: 'Only CRs and Faculty can broadcast notices to the class.' });
  }

  const { title, content, priority } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const activeCohort = store.getActiveCohort();
  const newAnn: Announcement = {
    id: `ann-${Date.now()}`,
    classId: activeCohort.id,
    title: title.trim(),
    content: content.trim(),
    author: `${data.profile.name} (${data.profile.role})`,
    authorRole: data.profile.role,
    priority: priority || 'Normal',
    createdAt: new Date().toISOString(),
    relativeTime: 'Just now'
  };

  data.announcements.unshift(newAnn);

  data.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: `📢 Class Notice: ${newAnn.title}`,
    message: newAnn.content.slice(0, 90) + '...',
    type: 'announcement',
    referenceId: newAnn.id,
    timestamp: 'Just now',
    isRead: false
  });

  store.save();
  res.status(201).json(newAnn);
});

// 8. Notifications API
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const data = store.get();
  res.json(data.notifications);
});

apiRouter.post('/notifications/read-all', (req: Request, res: Response) => {
  const data = store.get();
  data.notifications.forEach(n => (n.isRead = true));
  store.save();
  res.json({ success: true });
});

// 9. Real Calendar Export (.ics format per RFC 5545)
apiRouter.get('/export/calendar.ics', (req: Request, res: Response) => {
  const data = store.get();
  const activeClassId = data.profile.activeClassId;
  const activeCohort = store.getActiveCohort();
  const classAssignments = data.assignments.filter(a => a.classId === activeClassId);

  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AssignFlow//Classora Academic Deadlines//EN',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:AssignFlow - ${activeCohort.name}`,
    'X-WR-TIMEZONE:UTC'
  ];

  classAssignments.forEach(a => {
    const due = new Date(a.dueDateISO);
    const start = new Date(due.getTime() - 60 * 60 * 1000); // 1 hour block
    ics.push(
      'BEGIN:VEVENT',
      `UID:${a.id}@assignflow.app`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(due)}`,
      `SUMMARY:[${a.subjectCode}] ${a.title}`,
      `DESCRIPTION:${a.description.replace(/\n/g, ' ')}\\nTeacher: ${a.teacher}\\nPriority: ${a.priority}`,
      `LOCATION:${activeCohort.name}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  ics.push('END:VCALENDAR');

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="Classora_${activeCohort.code}_Deadlines.ics"`);
  res.send(ics.join('\r\n'));
});
