import test from 'node:test';
import assert from 'node:assert';
import { analyzeDeadline, sortAndEnrichAssignments, calculateAcademicMetrics } from '../src/utils/deadlineEngine.ts';

test('analyzeDeadline: accurately flags overdue deadlines', () => {
  const pastDate = new Date(Date.now() - 3600 * 1000 * 5).toISOString(); // 5 hours ago
  const result = analyzeDeadline(pastDate);
  assert.strictEqual(result.isOverdue, true);
  assert.strictEqual(result.urgency, 'OVERDUE');
  assert.match(result.relativeTime, /Overdue/);
});

test('analyzeDeadline: flags today deadlines properly', () => {
  const now = new Date();
  const futureToday = new Date(now.getTime() + 3600 * 1000 * 3); // 3 hours from now
  const result = analyzeDeadline(futureToday.toISOString(), now);
  assert.strictEqual(result.isOverdue, false);
  assert.strictEqual(result.urgency, 'DUE_TODAY');
  assert.match(result.relativeTime, /Due in/);
});

test('analyzeDeadline: handles invalid dates gracefully', () => {
  const result = analyzeDeadline('invalid-date-string');
  assert.strictEqual(result.isOverdue, false);
  assert.strictEqual(result.urgency, 'UPCOMING');
  assert.strictEqual(result.relativeTime, 'Date TBD');
});

test('calculateAcademicMetrics: calculates velocity and completion rates correctly', () => {
  const dummyAssignments = [
    {
      id: 'A1',
      classId: 'c1',
      title: 'Task 1',
      subjectCode: 'CS1',
      subjectName: 'CS',
      teacher: 'Prof',
      owner: 'Student',
      description: 'Desc',
      status: 'Active',
      priority: 'Critical',
      estimatedHours: 4,
      dueDate: 'Today',
      dueDateISO: new Date(Date.now() + 3600 * 1000 * 2).toISOString(),
      relativeTime: 'Due in 2h',
      isCompleted: true,
      isPinned: false,
      isVerified: true,
      instructions: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Me',
      createdByRole: 'CR'
    },
    {
      id: 'A2',
      classId: 'c1',
      title: 'Task 2',
      subjectCode: 'CS2',
      subjectName: 'CS',
      teacher: 'Prof',
      owner: 'Student',
      description: 'Desc',
      status: 'Active',
      priority: 'Normal',
      estimatedHours: 2,
      dueDate: 'Tomorrow',
      dueDateISO: new Date(Date.now() + 3600 * 1000 * 30).toISOString(),
      relativeTime: 'Due Tomorrow',
      isCompleted: false,
      isPinned: false,
      isVerified: false,
      instructions: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Me',
      createdByRole: 'CR'
    }
  ];

  const metrics = calculateAcademicMetrics(dummyAssignments);
  assert.strictEqual(metrics.total, 2);
  assert.strictEqual(metrics.completed, 1);
  assert.strictEqual(metrics.completionPercentage, 50);
  assert.strictEqual(metrics.completedHours, 4);
});
