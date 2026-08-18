import { Assignment, Announcement, ResourceAllocation, ClassCohort, AppNotification, Role } from '../src/types/index.js';

export interface DatabaseState {
  currentRole: Role;
  currentCohort: ClassCohort;
  assignments: Assignment[];
  announcements: Announcement[];
  resources: ResourceAllocation[];
  notifications: AppNotification[];
}

export const db: DatabaseState = {
  currentRole: 'CR',
  currentCohort: {
    id: 'cohort-1',
    code: 'STAN-CS301-A',
    name: 'CS-301 Distributed Systems & Data Structs',
    university: 'Stanford University / Global University Network',
    program: 'B.S. Computer Science',
    semester: 'Semester 4',
    section: 'Section A',
    totalStudents: 82,
    crName: 'Aryan (Class Representative)'
  },
  assignments: [
    {
      id: 'PHX-102',
      classId: 'cohort-1',
      title: 'Implement Redis Caching Layer for Auth & Session Storage',
      subjectCode: 'CS-301',
      subjectName: 'Advanced Data Structures & Algorithms',
      teacher: 'Prof. David Malan',
      owner: 'Sarah Jenkins',
      status: 'In Review',
      priority: 'Critical',
      estimatedHours: 4.5,
      dueDate: 'Today • 11:59 PM',
      dueDateISO: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      relativeTime: 'Due in 4h',
      isCompleted: false,
      isPinned: true,
      isVerified: true,
      instructions: [
        'Clone assignment starter repository and checkout feature/redis-auth',
        'Implement multi-level LRU caching in /src/cache/redis.ts',
        'Ensure failover memory fallback if Redis cluster is unreachable',
        'Run benchmark tests (npm run test:cache)'
      ],
      attachments: [
        { id: 'att-1', name: 'Architecture_Spec_v2.pdf', size: '2.4 MB', type: 'PDF' },
        { id: 'att-2', name: 'Redis_Config_Starter.zip', size: '1.1 MB', type: 'ZIP' }
      ],
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdByRole: 'FACULTY'
    },
    {
      id: 'PHX-104',
      classId: 'cohort-1',
      title: 'Fix race condition in Websocket events dispatcher',
      subjectCode: 'CS-304',
      subjectName: 'Distributed Operating Systems',
      teacher: 'Dr. Jennifer Widom',
      owner: 'Mike Lowrey',
      status: 'Testing',
      priority: 'High',
      estimatedHours: 3.5,
      dueDate: 'Tomorrow • 11:59 PM',
      dueDateISO: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
      relativeTime: 'Due Tomorrow',
      isCompleted: false,
      isPinned: true,
      isVerified: true,
      instructions: [
        'Audit lock synchronization across worker nodes',
        'Implement atomic mutex locks for broadcast events',
        'Verify zero dropped packets during stress testing'
      ],
      attachments: [
        { id: 'att-3', name: 'Concurrency_Lab_Guide.pdf', size: '1.8 MB', type: 'PDF' }
      ],
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdByRole: 'CR'
    },
    {
      id: 'PHX-105',
      classId: 'cohort-1',
      title: 'Migrate Legacy Postgres Schemas to v2 with zero downtime',
      subjectCode: 'CS-302',
      subjectName: 'Database Management Systems',
      teacher: 'Prof. Michael Stonebraker',
      owner: 'Chen Wei',
      status: 'Verified',
      priority: 'Normal',
      estimatedHours: 5.0,
      dueDate: 'Aug 21, 2026 • 05:00 PM',
      dueDateISO: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
      relativeTime: 'Due in 3 days',
      isCompleted: false,
      isPinned: false,
      isVerified: true,
      instructions: [
        'Write backward-compatible idempotent SQL migrations',
        'Validate index performance on foreign keys',
        'Test rollback sequence on staging DB replica'
      ],
      attachments: [],
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdByRole: 'FACULTY'
    },
    {
      id: 'PHX-106',
      classId: 'cohort-1',
      title: 'Refactor Header Component for Mobile & High Density Displays',
      subjectCode: 'CS-310',
      subjectName: 'Human-Computer Interaction & UI Systems',
      teacher: 'Dr. Terry Winograd',
      owner: 'Alex Rivera',
      status: 'Backlog',
      priority: 'Low',
      estimatedHours: 2.0,
      dueDate: 'Aug 25, 2026 • 11:59 PM',
      dueDateISO: new Date(Date.now() + 168 * 3600 * 1000).toISOString(),
      relativeTime: 'Due in 7 days',
      isCompleted: false,
      isPinned: false,
      isVerified: false,
      instructions: [
        'Optimize touch hit targets to minimum 44px',
        'Ensure WCAG AA color contrast ratio across themes'
      ],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByRole: 'CR'
    },
    {
      id: 'PHX-108',
      classId: 'cohort-1',
      title: 'Comprehensive Documentation & Sandbox for API Webhooks',
      subjectCode: 'CS-308',
      subjectName: 'Cloud Infrastructure & API Design',
      teacher: 'Prof. John Hennessy',
      owner: 'Sarah Jenkins',
      status: 'In Review',
      priority: 'Normal',
      estimatedHours: 3.0,
      dueDate: 'Aug 24, 2026 • 11:59 PM',
      dueDateISO: new Date(Date.now() + 144 * 3600 * 1000).toISOString(),
      relativeTime: 'Due in 6 days',
      isCompleted: false,
      isPinned: false,
      isVerified: true,
      instructions: [
        'Publish OpenAPI 3.1 specification to Swagger portal',
        'Write curl and Node.js examples for each webhook signature'
      ],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByRole: 'FACULTY'
    },
    {
      id: 'PHX-109',
      classId: 'cohort-1',
      title: 'Unit test suites for Billing & Invoicing Engine',
      subjectCode: 'CS-301',
      subjectName: 'Software Engineering & Testing',
      teacher: 'Prof. David Malan',
      owner: 'Chen Wei',
      status: 'Backlog',
      priority: 'Critical',
      estimatedHours: 6.5,
      dueDate: 'Aug 26, 2026 • 11:59 PM',
      dueDateISO: new Date(Date.now() + 192 * 3600 * 1000).toISOString(),
      relativeTime: 'Due in 8 days',
      isCompleted: false,
      isPinned: false,
      isVerified: false,
      instructions: [
        'Achieve >90% code coverage on invoicing calculation services',
        'Mock third-party payment gateway error states'
      ],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdByRole: 'CR'
    }
  ],
  announcements: [
    {
      id: 'ann-1',
      classId: 'cohort-1',
      title: '⚠️ Mid-Term Sprint Submission Guidelines (Strict Deadline)',
      content: 'All class teams must tag their final git commit with v1.0.0-sprint42 before 11:59 PM tonight. Late pull requests will automatically incur grade penalties per the syllabus policy.',
      author: 'Prof. David Malan',
      authorRole: 'FACULTY',
      priority: 'Urgent',
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      relativeTime: '3 hours ago'
    },
    {
      id: 'ann-2',
      classId: 'cohort-1',
      title: '🏛️ Faculty Extra Office Hours Scheduled for Thursday',
      content: 'Extra office hours on Thursday 2:00 PM - 4:00 PM via Zoom to review Redis cluster configurations and database migration scripts.',
      author: 'Prof. David Malan',
      authorRole: 'FACULTY',
      priority: 'Normal',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      relativeTime: 'Yesterday'
    },
    {
      id: 'ann-3',
      classId: 'cohort-1',
      title: '📢 CR Notice: Final Project Team Formation Roster',
      content: 'Please submit your 3-member team list in the class portal spreadsheet before Friday 5:00 PM. Unassigned students will be randomized.',
      author: 'Aryan (CR)',
      authorRole: 'CR',
      priority: 'Info',
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      relativeTime: '2 days ago'
    }
  ],
  resources: [
    {
      id: 'res-1',
      name: 'Sarah Jenkins',
      role: 'Backend Lead',
      avatar: 'SJ',
      assignedTasks: 3,
      allocatedHours: 9.2,
      capacityHours: 10.0,
      percentage: 92,
      isOverCapacity: true
    },
    {
      id: 'res-2',
      name: 'Mike Lowrey',
      role: 'Systems Eng.',
      avatar: 'ML',
      assignedTasks: 2,
      allocatedHours: 6.5,
      capacityHours: 10.0,
      percentage: 65,
      isOverCapacity: false
    },
    {
      id: 'res-3',
      name: 'Chen Wei',
      role: 'Database Arch.',
      avatar: 'CW',
      assignedTasks: 2,
      allocatedHours: 4.8,
      capacityHours: 10.0,
      percentage: 48,
      isOverCapacity: false
    },
    {
      id: 'res-4',
      name: 'Alex Rivera',
      role: 'Frontend UI',
      avatar: 'AR',
      assignedTasks: 1,
      allocatedHours: 2.2,
      capacityHours: 10.0,
      percentage: 22,
      isOverCapacity: false
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      title: '🚨 Deadline Warning: PHX-102',
      message: 'Implement Redis Caching Layer is due in 4 hours (11:59 PM).',
      type: 'reminder',
      referenceId: 'PHX-102',
      timestamp: '15m ago',
      isRead: false
    },
    {
      id: 'notif-2',
      title: '✨ Verified by Faculty',
      message: 'Prof. David Malan verified the requirements for CS-301 Sprint Deliverable.',
      type: 'verification',
      referenceId: 'PHX-102',
      timestamp: '1h ago',
      isRead: false
    },
    {
      id: 'notif-3',
      title: '📝 New Assignment Published by CR',
      message: 'Unit test suites for Billing & Invoicing Engine published by CR.',
      type: 'assignment',
      referenceId: 'PHX-109',
      timestamp: '3h ago',
      isRead: true
    }
  ]
};
