import fs from 'fs';
import path from 'path';
import {
  Assignment,
  Announcement,
  ClassCohort,
  ClassMember,
  AppNotification,
  University,
  UserProfile,
  JoinRequest,
  ClassResource,
  ChatMessage,
  ClassSubject,
  StudentSubmission,
  TimetableClass,
  StudyNote,
  LeaderboardEntry
} from '../src/types/index.js';

export interface DatabaseSchema {
  profiles: Record<string, UserProfile>;
  activeUserId: string;
  universities: University[];
  classes: ClassCohort[];
  members: Record<string, ClassMember[]>; // classId -> members
  joinRequests: JoinRequest[];
  resources: Record<string, ClassResource[]>; // classId -> resources
  notes: Record<string, StudyNote[]>; // classId -> study notes
  timetable: Record<string, TimetableClass[]>; // classId -> schedule
  leaderboards: Record<string, LeaderboardEntry[]>; // classId -> leaderboard
  messages: Record<string, ChatMessage[]>; // classId -> chat messages
  subjects: Record<string, ClassSubject[]>; // classId -> subjects
  assignments: Assignment[];
  submissions: Record<string, StudentSubmission[]>; // assignmentId -> submissions
  completions: Record<string, Record<string, boolean>>; // userId -> { assignmentId: boolean }
  announcements: Announcement[];
  notifications: AppNotification[];
}

const DB_FILE = path.join(process.cwd(), 'server', 'db.json');

const defaultData: DatabaseSchema = {
  activeUserId: 'user-default-01',
  profiles: {
    'user-default-01': {
      id: 'user-default-01',
      name: 'Aryan Nair',
      email: 'aryanair0000001@gmail.com',
      role: 'CR',
      activeClassId: 'cohort-cu-cse4-a',
      enrolledClassIds: ['cohort-cu-cse4-a', 'cohort-stan-cs301', 'cohort-mit-6004'],
      university: 'Chandigarh University',
      program: 'B.Tech CSE',
      branch: 'Computer Science & Engineering',
      semester: 'Semester 4',
      section: 'Section A',
      rollNo: '22CS0142',
      isOnboarded: true
    }
  },
  universities: [
    { id: 'univ-cu', name: 'Chandigarh University', country: 'India', campus: 'Gharuan Main Campus', code: 'CU' },
    { id: 'univ-iitd', name: 'Indian Institute of Technology (IIT) Delhi', country: 'India', campus: 'Hauz Khas', code: 'IITD' },
    { id: 'univ-stanford', name: 'Stanford University', country: 'United States', campus: 'Main Quad', code: 'STANFORD' },
    { id: 'univ-mit', name: 'Massachusetts Institute of Technology (MIT)', country: 'United States', campus: 'Cambridge', code: 'MIT' },
    { id: 'univ-oxford', name: 'University of Oxford', country: 'United Kingdom', campus: 'Oxford Campus', code: 'OXON' },
    { id: 'univ-nus', name: 'National University of Singapore (NUS)', country: 'Singapore', campus: 'Kent Ridge', code: 'NUS' },
    { id: 'univ-toronto', name: 'University of Toronto', country: 'Canada', campus: 'St. George', code: 'UofT' },
    { id: 'univ-melbourne', name: 'University of Melbourne', country: 'Australia', campus: 'Parkville', code: 'UNIMELB' }
  ],
  classes: [
    {
      id: 'cohort-cu-cse4-a',
      code: 'CU-CSE2-A-7K4P',
      name: 'B.Tech CSE 2nd Year - Section A',
      universityId: 'univ-cu',
      universityName: 'Chandigarh University',
      schoolOrFaculty: 'University Institute of Engineering (UIE)',
      department: 'Computer Science & Engineering',
      program: 'B.Tech Computer Science & Engineering',
      branch: 'Computer Science & Engineering',
      semester: 'Semester 4 (2nd Year)',
      section: 'Section A',
      academicYear: '2025-2026',
      totalStudents: 74,
      crName: 'Aryan Nair',
      crEmail: 'aryanair0000001@gmail.com',
      facultyInCharge: 'Dr. Rajiv Kumar',
      createdAt: '2026-01-15T08:00:00.000Z'
    },
    {
      id: 'cohort-stan-cs301',
      code: 'STAN-CS301-8X2M',
      name: 'CS-301 Distributed Systems & OS Lab',
      universityId: 'univ-stanford',
      universityName: 'Stanford University',
      schoolOrFaculty: 'School of Engineering',
      department: 'Computer Science Department',
      program: 'B.S. Computer Science',
      branch: 'Systems & Architecture',
      semester: 'Spring Term',
      section: 'Section B',
      academicYear: '2025-2026',
      totalStudents: 65,
      crName: 'Sarah Jenkins',
      crEmail: 'sarah.j@stanford.edu',
      facultyInCharge: 'Prof. David Malan',
      createdAt: '2026-02-01T08:00:00.000Z'
    },
    {
      id: 'cohort-mit-6004',
      code: 'MIT-6004-3F9W',
      name: '6.004 Computation Structures Sprint',
      universityId: 'univ-mit',
      universityName: 'Massachusetts Institute of Technology (MIT)',
      schoolOrFaculty: 'EECS Department',
      department: 'Electrical Engineering & Computer Science',
      program: 'Bachelor of Science (SB)',
      branch: 'Computer Science',
      semester: 'Fall Term',
      section: 'Section 01',
      academicYear: '2025-2026',
      totalStudents: 120,
      crName: 'Alex Mercer',
      crEmail: 'alex.m@mit.edu',
      facultyInCharge: 'Prof. Chris Terman',
      createdAt: '2026-02-10T08:00:00.000Z'
    }
  ],
  joinRequests: [
    {
      id: 'req-101',
      classId: 'cohort-cu-cse4-a',
      className: 'B.Tech CSE 2nd Year - Section A',
      studentId: 'user-riya-02',
      studentName: 'Riya Singh',
      studentEmail: 'riya.singh@cumail.in',
      rollNo: '22CS0155',
      requestedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'PENDING'
    },
    {
      id: 'req-102',
      classId: 'cohort-cu-cse4-a',
      className: 'B.Tech CSE 2nd Year - Section A',
      studentId: 'user-karan-03',
      studentName: 'Karan Mehra',
      studentEmail: 'karan.22cs@cumail.in',
      rollNo: '22CS0178',
      requestedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'PENDING'
    },
    {
      id: 'req-103',
      classId: 'cohort-cu-cse4-a',
      className: 'B.Tech CSE 2nd Year - Section A',
      studentId: 'user-tanvi-04',
      studentName: 'Tanvi Sharma',
      studentEmail: 'tanvi.sharma@cumail.in',
      rollNo: '22CS0182',
      requestedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      status: 'PENDING'
    }
  ],
  members: {
    'cohort-cu-cse4-a': [
      { id: 'mem-1', name: 'Aryan Nair (CR)', email: 'aryanair0000001@gmail.com', role: 'CR', rollNo: '22CS0142', joinedAt: '2026-01-15' },
      { id: 'mem-2', name: 'Dr. Rajiv Kumar', email: 'rajiv.cse@cumail.in', role: 'TEACHER', joinedAt: '2026-01-10' },
      { id: 'mem-3', name: 'Ayush Sharma', email: 'ayush.22cs@cumail.in', role: 'STUDENT', rollNo: '22CS0104', joinedAt: '2026-01-16' },
      { id: 'mem-4', name: 'Priya Patel', email: 'priya.22cs@cumail.in', role: 'STUDENT', rollNo: '22CS0118', joinedAt: '2026-01-16' },
      { id: 'mem-5', name: 'Rohan Gupta', email: 'rohan.22cs@cumail.in', role: 'STUDENT', rollNo: '22CS0122', joinedAt: '2026-01-17' },
      { id: 'mem-6', name: 'Ananya Verma', email: 'ananya.22cs@cumail.in', role: 'STUDENT', rollNo: '22CS0135', joinedAt: '2026-01-17' }
    ]
  },
  resources: {
    'cohort-cu-cse4-a': [
      {
        id: 'res-1',
        classId: 'cohort-cu-cse4-a',
        title: 'DBMS Unit 3 & 4 B+ Tree Indexing Lecture Notes',
        description: 'Complete slide deck and handwritten tree splitting formulas explained by Dr. Rajiv Kumar.',
        type: 'PDF',
        fileUrl: '#',
        uploadedBy: 'Dr. Rajiv Kumar',
        uploadedByRole: 'TEACHER',
        uploadedAt: '2026-08-16T11:00:00.000Z',
        size: '4.2 MB'
      },
      {
        id: 'res-2',
        classId: 'cohort-cu-cse4-a',
        title: 'Operating Systems Semaphores & Concurrency Lab Kit',
        description: 'Starter code repositories and POSIX thread guidelines for lab practical evaluation.',
        type: 'DOC',
        fileUrl: '#',
        uploadedBy: 'Aryan Nair (CR)',
        uploadedByRole: 'CR',
        uploadedAt: '2026-08-17T09:30:00.000Z',
        size: '1.8 MB'
      },
      {
        id: 'res-3',
        classId: 'cohort-cu-cse4-a',
        title: 'Design & Analysis of Algorithms Tutorial Solution Sheet',
        description: 'Detailed solutions for DP and Graph questions with asymptotic analysis.',
        type: 'PDF',
        fileUrl: '#',
        uploadedBy: 'Aryan Nair (CR)',
        uploadedByRole: 'CR',
        uploadedAt: '2026-08-17T14:15:00.000Z',
        size: '2.4 MB'
      }
    ]
  },
  notes: {
    'cohort-cu-cse4-a': [
      {
        id: 'note-1',
        classId: 'cohort-cu-cse4-a',
        title: 'B+ Tree Complete Implementation Notes & Memory Diagrams',
        subjectCode: 'CST-241',
        subjectName: 'Database Management Systems',
        description: 'Comprehensive handwritten & typed summary of insertion splits, leaf node pointer linking, and range scan queries.',
        type: 'PDF',
        author: 'Aryan Nair (CR)',
        authorRole: 'CR',
        uploadedAt: '2026-08-16T10:00:00.000Z',
        size: '3.1 MB',
        downloadsCount: 58,
        isBookmarked: true
      },
      {
        id: 'note-2',
        classId: 'cohort-cu-cse4-a',
        title: 'POSIX Multithreading & Semaphores Lab Guide with Code Recipes',
        subjectCode: 'CST-242',
        subjectName: 'Operating Systems',
        description: 'Includes thread creation, pthread_mutex, sem_wait/sem_post routines, and starvation prevention mechanisms.',
        type: 'PDF',
        author: 'Prof. Neha Sundaram',
        authorRole: 'TEACHER',
        uploadedAt: '2026-08-15T14:30:00.000Z',
        size: '2.4 MB',
        downloadsCount: 71,
        isBookmarked: false
      },
      {
        id: 'note-3',
        classId: 'cohort-cu-cse4-a',
        title: 'Graph Theory & DP Asymptotic Proofs (Mid-Term Review)',
        subjectCode: 'CST-243',
        subjectName: 'Design & Analysis of Algorithms',
        description: 'Complete proofs for Bellman-Ford negative cycle detection and Kruskal MST using Union-Find.',
        type: 'PDF',
        author: 'Priya Sharma',
        authorRole: 'STUDENT',
        uploadedAt: '2026-08-17T09:15:00.000Z',
        size: '4.8 MB',
        downloadsCount: 43,
        isBookmarked: true
      }
    ]
  },
  timetable: {
    'cohort-cu-cse4-a': [
      {
        id: 'tt-1',
        subjectCode: 'CST-241',
        subjectName: 'Database Management Systems',
        teacher: 'Dr. Rajiv Kumar',
        time: '09:00 AM - 10:30 AM',
        room: 'Lecture Hall B-302',
        status: 'Completed',
        day: 'Monday'
      },
      {
        id: 'tt-2',
        subjectCode: 'CST-242',
        subjectName: 'Operating Systems & System Programming',
        teacher: 'Prof. Neha Sundaram',
        time: '11:00 AM - 12:30 PM',
        room: 'Lab Complex 4 (Room 408)',
        status: 'In Progress',
        day: 'Monday'
      },
      {
        id: 'tt-3',
        subjectCode: 'CST-243',
        subjectName: 'Design & Analysis of Algorithms',
        teacher: 'Dr. V. K. Aggarwal',
        time: '02:00 PM - 03:30 PM',
        room: 'Seminar Hall 1',
        status: 'Upcoming',
        day: 'Monday'
      },
      {
        id: 'tt-4',
        subjectCode: 'CST-244',
        subjectName: 'Full Stack Web Engineering',
        teacher: 'Prof. Ankit Sharma',
        time: '04:00 PM - 05:30 PM',
        room: 'Computing Center 2',
        status: 'Upcoming',
        day: 'Monday'
      }
    ]
  },
  leaderboards: {
    'cohort-cu-cse4-a': [
      {
        rank: 1,
        userId: 'user-default-01',
        name: 'Aryan Nair (CR)',
        rollNo: '22CS0142',
        xp: 2850,
        streakDays: 14,
        completedAssignments: 18,
        onTimeRate: 100,
        badge: 'Academic Champion 🏆'
      },
      {
        rank: 2,
        userId: 'mem-3',
        name: 'Priya Sharma',
        rollNo: '22CS0150',
        xp: 2640,
        streakDays: 12,
        completedAssignments: 17,
        onTimeRate: 98,
        badge: 'Sprint Master ⚡'
      },
      {
        rank: 3,
        userId: 'mem-2',
        name: 'Rohan Verma',
        rollNo: '22CS0144',
        xp: 2410,
        streakDays: 9,
        completedAssignments: 16,
        onTimeRate: 94,
        badge: 'Consistent Scholar 📚'
      },
      {
        rank: 4,
        userId: 'mem-4',
        name: 'Ayush Sharma',
        rollNo: '22CS0155',
        xp: 2180,
        streakDays: 7,
        completedAssignments: 14,
        onTimeRate: 90,
        badge: 'Rising Star ⭐'
      },
      {
        rank: 5,
        userId: 'mem-5',
        name: 'Ananya Deshmukh',
        rollNo: '22CS0162',
        xp: 1950,
        streakDays: 5,
        completedAssignments: 13,
        onTimeRate: 88,
        badge: 'Active Peer 💡'
      }
    ]
  },
  messages: {
    'cohort-cu-cse4-a': [
      {
        id: 'msg-1',
        classId: 'cohort-cu-cse4-a',
        senderId: 'mem-2',
        senderName: 'Dr. Rajiv Kumar',
        senderRole: 'TEACHER',
        message: 'Reminder: The DBMS B+ tree assignment deadline is strict tonight at 11:59 PM. Make sure your memory checks are clean.',
        timestamp: '10:15 AM',
        isPinned: true,
        isAnnouncement: true
      },
      {
        id: 'msg-2',
        classId: 'cohort-cu-cse4-a',
        senderId: 'mem-1',
        senderName: 'Aryan Nair (CR)',
        senderRole: 'CR',
        message: 'I have pinned the starter templates in the Notes & Resources tab. If anyone faces node split recursion bugs, ping in the group.',
        timestamp: '10:30 AM'
      },
      {
        id: 'msg-3',
        classId: 'cohort-cu-cse4-a',
        senderId: 'mem-3',
        senderName: 'Ayush Sharma',
        senderRole: 'STUDENT',
        message: 'Is the physical submission for DAA sheet required on Friday or Monday?',
        timestamp: '11:05 AM'
      },
      {
        id: 'msg-4',
        classId: 'cohort-cu-cse4-a',
        senderId: 'mem-1',
        senderName: 'Aryan Nair (CR)',
        senderRole: 'CR',
        message: 'Friday 10:00 AM lecture! Ensure printed copy is signed.',
        timestamp: '11:08 AM'
      }
    ]
  },
  subjects: {
    'cohort-cu-cse4-a': [
      { id: 'sub-1', code: 'CST-241', name: 'Database Management Systems', teacherName: 'Dr. Rajiv Kumar', credits: 4, color: '#6366F1' },
      { id: 'sub-2', code: 'CST-242', name: 'Operating Systems & System Programming', teacherName: 'Prof. Neha Sundaram', credits: 4, color: '#EC4899' },
      { id: 'sub-3', code: 'CST-243', name: 'Design & Analysis of Algorithms', teacherName: 'Dr. V. K. Aggarwal', credits: 4, color: '#F59E0B' },
      { id: 'sub-4', code: 'CST-244', name: 'Full Stack Web Engineering', teacherName: 'Prof. Ankit Sharma', credits: 3, color: '#10B981' }
    ]
  },
  assignments: [
    {
      id: 'CU-CS401',
      classId: 'cohort-cu-cse4-a',
      title: 'Design & Implement B+ Tree Indexing in C++/Java',
      subjectCode: 'CST-241',
      subjectName: 'Database Management Systems',
      teacher: 'Dr. Rajiv Kumar',
      owner: 'Ayush Sharma',
      description: 'Implement a disk-backed B+ tree index structure with node splitting, merging, and range query support as per the lecture 14 specifications.',
      status: 'Active',
      priority: 'Critical',
      estimatedHours: 4.5,
      dueDate: 'Today • 11:59 PM',
      dueDateISO: new Date(Date.now() + 5.8 * 3600 * 1000).toISOString(),
      relativeTime: 'Due in 5h 48m',
      isCompleted: false,
      isPinned: true,
      isImportant: true,
      isVerified: true,
      verifiedBy: 'Dr. Rajiv Kumar (Faculty)',
      instructions: [
        'Clone starter template and implement Node split & merge logic',
        'Support range queries: search(startKey, endKey) returning sorted keys',
        'Include memory leak check using Valgrind or AddressSanitizer',
        'Submit zipped source code along with a 2-page design PDF report'
      ],
      attachments: [
        {
          id: 'att-1',
          name: 'DBMS_Lab_Assignment_4_Spec.pdf',
          size: '1.8 MB',
          type: 'PDF',
          uploadedAt: '2026-08-16T10:00:00.000Z'
        },
        {
          id: 'att-2',
          name: 'bplus_tree_starter_code.zip',
          size: '840 KB',
          type: 'ZIP',
          uploadedAt: '2026-08-16T10:05:00.000Z'
        }
      ],
      createdAt: '2026-08-15T09:30:00.000Z',
      updatedAt: '2026-08-18T10:00:00.000Z',
      createdBy: 'Aryan Nair (CR)',
      createdByRole: 'CR'
    },
    {
      id: 'CU-CS402',
      classId: 'cohort-cu-cse4-a',
      title: 'Multi-threaded Producer-Consumer Synchronization using Semaphores',
      subjectCode: 'CST-242',
      subjectName: 'Operating Systems & System Programming',
      teacher: 'Prof. Neha Sundaram',
      owner: 'Priya Patel',
      description: 'Solve the bounded buffer problem using POSIX semaphores and mutex locks in C/C++. Ensure deadlock freedom and starvation prevention under heavy thread concurrency.',
      status: 'In Review',
      priority: 'High',
      estimatedHours: 3.5,
      dueDate: 'Tomorrow • 11:59 PM',
      dueDateISO: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
      relativeTime: 'Due Tomorrow',
      isCompleted: false,
      isPinned: true,
      isVerified: true,
      verifiedBy: 'Prof. Neha Sundaram',
      instructions: [
        'Initialize circular buffer of size N = 10',
        'Create 5 producer and 5 consumer threads with randomized sleep times',
        'Record throughput metrics for buffer full vs empty states'
      ],
      attachments: [
        {
          id: 'att-3',
          name: 'OS_Lab_Guidelines_Semaphores.pdf',
          size: '1.2 MB',
          type: 'PDF',
          uploadedAt: '2026-08-16T14:00:00.000Z'
        }
      ],
      createdAt: '2026-08-16T12:00:00.000Z',
      updatedAt: '2026-08-17T11:00:00.000Z',
      createdBy: 'Aryan Nair (CR)',
      createdByRole: 'CR'
    },
    {
      id: 'CU-CS403',
      classId: 'cohort-cu-cse4-a',
      title: 'Dijkstra & Prim Minimum Spanning Tree Complex Problem Set',
      subjectCode: 'CST-243',
      subjectName: 'Design & Analysis of Algorithms',
      teacher: 'Dr. V. K. Aggarwal',
      owner: 'Rohan Gupta',
      description: 'Handwritten problem sheet and asymptotic complexity proofs for Fibonacci Heap Dijkstra and Kruskal Disjoint Set Union optimization.',
      status: 'Active',
      priority: 'Normal',
      estimatedHours: 2.5,
      dueDate: 'Aug 24, 2026 • 05:00 PM',
      dueDateISO: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      relativeTime: 'Due in 3 days',
      isCompleted: false,
      isPinned: false,
      isVerified: true,
      verifiedBy: 'Dr. V. K. Aggarwal',
      instructions: [
        'Complete questions 1 through 8 from Tutorial Sheet #6',
        'Scan as a single clear PDF document using CamScanner or Adobe Scan',
        'Physical paper submission also required during Friday 10:00 AM lecture'
      ],
      attachments: [
        {
          id: 'att-4',
          name: 'DAA_Tutorial_Sheet_6.pdf',
          size: '950 KB',
          type: 'PDF',
          uploadedAt: '2026-08-17T09:00:00.000Z'
        }
      ],
      createdAt: '2026-08-17T09:00:00.000Z',
      updatedAt: '2026-08-17T09:00:00.000Z',
      createdBy: 'Dr. V. K. Aggarwal',
      createdByRole: 'TEACHER'
    },
    {
      id: 'CU-CS404',
      classId: 'cohort-cu-cse4-a',
      title: 'Responsive Portfolio Web Application using Tailwind CSS',
      subjectCode: 'CST-244',
      subjectName: 'Full Stack Web Engineering',
      teacher: 'Prof. Ankit Sharma',
      owner: 'Ananya Verma',
      description: 'Create a fully accessible mobile-friendly developer portfolio with dark/light modes, project showcase, and dynamic contact form handling.',
      status: 'Active',
      priority: 'Low',
      estimatedHours: 2.0,
      dueDate: 'Aug 28, 2026 • 11:59 PM',
      dueDateISO: new Date(Date.now() + 168 * 3600 * 1000).toISOString(),
      relativeTime: 'Due in 7 days',
      isCompleted: true,
      completedAt: '2026-08-18T08:30:00.000Z',
      isPinned: false,
      isVerified: false,
      instructions: [
        'Deploy project to Vercel or GitHub Pages',
        'Submit live link and GitHub repository URL in LMS portal'
      ],
      attachments: [],
      createdAt: '2026-08-17T15:00:00.000Z',
      updatedAt: '2026-08-18T08:30:00.000Z',
      createdBy: 'Aryan Nair (CR)',
      createdByRole: 'CR'
    }
  ],
  completions: {
    'user-default-01': {
      'CU-CS404': true
    }
  },
  announcements: [
    {
      id: 'ann-1',
      classId: 'cohort-cu-cse4-a',
      title: '🚨 Mid-Term Practical Evaluation Schedule Announced',
      content: 'Database Systems (CST-241) and OS Lab (CST-242) practical evaluations are scheduled for Friday 9:30 AM in Lab 304. Bring your verified physical lab journals.',
      author: 'Dr. Rajiv Kumar (Faculty In-Charge)',
      authorRole: 'TEACHER',
      priority: 'Urgent',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      relativeTime: '2 hours ago',
      isPinned: true
    },
    {
      id: 'ann-2',
      classId: 'cohort-cu-cse4-a',
      title: '📢 CR Notice: Final Project Group Lists Due Tomorrow',
      content: 'All class students must submit their 3-member project groups via the class WhatsApp group or directly to CR Aryan before 5:00 PM tomorrow. Unassigned students will be randomized by faculty.',
      author: 'Aryan Nair (CR)',
      authorRole: 'CR',
      priority: 'Normal',
      createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      relativeTime: 'Yesterday',
      isPinned: false
    }
  ],
  submissions: {
    'CU-CS401': [
      {
        id: 'sub-01',
        assignmentId: 'CU-CS401',
        studentId: 'mem-2',
        studentName: 'Rohan Verma',
        studentRollNo: '22CS0144',
        studentEmail: 'rohan.v@university.edu',
        status: 'SUBMITTED',
        submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        content: 'Completed all required B-Tree balancing operations and empirical memory benchmarks in C++17.',
        attachments: [
          {
            id: 'att-sub-1',
            name: 'btree_benchmark_report.pdf',
            size: '1.4 MB',
            type: 'PDF',
            uploadedAt: new Date(Date.now() - 3600000 * 4).toISOString()
          }
        ],
        isLate: false
      },
      {
        id: 'sub-02',
        assignmentId: 'CU-CS401',
        studentId: 'mem-3',
        studentName: 'Priya Sharma',
        studentRollNo: '22CS0150',
        studentEmail: 'priya.s@university.edu',
        status: 'COMPLETED',
        submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        content: 'Submitted source code repo and performance analysis charts.',
        attachments: [
          {
            id: 'att-sub-2',
            name: 'b_plus_tree_analysis.pdf',
            size: '2.1 MB',
            type: 'PDF',
            uploadedAt: new Date(Date.now() - 3600000 * 12).toISOString()
          }
        ],
        grade: 'A+ (98/100)',
        feedback: 'Excellent time complexity analysis on random key distributions.',
        reviewedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        reviewedBy: 'Dr. Rajesh Sharma',
        isLate: false
      }
    ]
  },
  notifications: [
    {
      id: 'notif-1',
      userId: 'user-default-01',
      title: '🚨 Deadline Warning: CST-241',
      message: 'Design & Implement B+ Tree Indexing is due in 5h 48m (11:59 PM).',
      type: 'reminder',
      referenceId: 'CU-CS401',
      timestamp: '15m ago',
      isRead: false
    },
    {
      id: 'notif-2',
      userId: 'user-default-01',
      title: '✓ Verified by Faculty: Dr. Rajiv Kumar',
      message: 'Assignment CU-CS401 has been verified with official evaluation criteria.',
      type: 'verification',
      referenceId: 'CU-CS401',
      timestamp: '2h ago',
      isRead: false
    },
    {
      id: 'notif-3',
      userId: 'user-default-01',
      title: '📝 New Assignment Published by CR',
      message: 'Producer-Consumer Synchronization (CST-242) published by Aryan Nair.',
      type: 'assignment',
      referenceId: 'CU-CS402',
      timestamp: 'Yesterday',
      isRead: true
    }
  ]
};

// Store singleton with disk sync
class Store {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.completions) parsed.completions = {};
        if (!parsed.submissions) parsed.submissions = defaultData.submissions || {};
        if (!parsed.joinRequests) parsed.joinRequests = defaultData.joinRequests;
        if (!parsed.resources) parsed.resources = defaultData.resources;
        if (!parsed.notes) parsed.notes = defaultData.notes;
        if (!parsed.timetable) parsed.timetable = defaultData.timetable;
        if (!parsed.leaderboards) parsed.leaderboards = defaultData.leaderboards;
        if (!parsed.messages) parsed.messages = defaultData.messages;
        if (!parsed.subjects) parsed.subjects = defaultData.subjects;
        if (!parsed.profiles) {
          parsed.profiles = { 'user-default-01': parsed.profile || defaultData.profiles['user-default-01'] };
          parsed.activeUserId = 'user-default-01';
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading db.json, initializing defaults:', e);
    }
    this.save(defaultData);
    return defaultData;
  }

  public save(dataToSave?: DatabaseSchema) {
    if (dataToSave) {
      this.data = dataToSave;
    }
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db.json:', e);
    }
  }

  public get(): DatabaseSchema {
    return this.data;
  }

  public getActiveProfile(): UserProfile {
    const profile = this.data.profiles[this.data.activeUserId];
    if (profile) return profile;
    return defaultData.profiles['user-default-01'];
  }

  public getActiveCohort(): ClassCohort {
    const profile = this.getActiveProfile();
    const active = this.data.classes.find(c => c.id === profile.activeClassId);
    return active || this.data.classes[0];
  }
}

export const store = new Store();
