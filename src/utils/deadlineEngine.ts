import { Assignment, DeadlineUrgency } from '../types/index.js';

export interface DeadlineAnalysis {
  urgency: DeadlineUrgency;
  relativeTime: string;
  isOverdue: boolean;
  hoursRemaining: number;
  daysRemaining: number;
  formattedDue: string;
}

/**
 * Calculates standardized, localized deadline metrics and urgency classifications.
 * All calculations use client local time derived from UTC ISO-8601 strings.
 */
export function analyzeDeadline(dueDateISO: string, now: Date = new Date()): DeadlineAnalysis {
  const targetDate = new Date(dueDateISO);
  if (isNaN(targetDate.getTime())) {
    return {
      urgency: 'UPCOMING',
      relativeTime: 'Date TBD',
      isOverdue: false,
      hoursRemaining: 999,
      daysRemaining: 99,
      formattedDue: 'TBD'
    };
  }

  const diffMs = targetDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  const isSameCalendarDay =
    targetDate.getFullYear() === now.getFullYear() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getDate() === now.getDate();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    targetDate.getFullYear() === tomorrow.getFullYear() &&
    targetDate.getMonth() === tomorrow.getMonth() &&
    targetDate.getDate() === tomorrow.getDate();

  const timeString = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = targetDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

  let urgency: DeadlineUrgency = 'UPCOMING';
  let relativeTime = '';
  let isOverdue = false;

  if (diffMs < 0) {
    isOverdue = true;
    urgency = 'OVERDUE';
    const absHours = Math.abs(diffHours);
    if (absHours < 1) {
      relativeTime = 'Overdue by minutes';
    } else if (absHours < 24) {
      relativeTime = `Overdue by ${Math.floor(absHours)}h`;
    } else {
      relativeTime = `Overdue by ${Math.floor(absHours / 24)}d`;
    }
  } else if (isSameCalendarDay || (diffHours >= 0 && diffHours <= 24)) {
    urgency = 'DUE_TODAY';
    if (diffHours < 1) {
      const minutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
      relativeTime = `Due in ${minutes}m`;
    } else {
      relativeTime = `Due in ${Math.floor(diffHours)}h`;
    }
  } else if (isTomorrow || (diffHours > 24 && diffHours <= 48)) {
    urgency = 'DUE_TOMORROW';
    relativeTime = 'Due Tomorrow';
  } else if (diffDays <= 7) {
    urgency = 'DUE_THIS_WEEK';
    relativeTime = `Due in ${Math.ceil(diffDays)} days`;
  } else {
    urgency = 'UPCOMING';
    relativeTime = `Due in ${Math.ceil(diffDays)} days`;
  }

  const formattedDue = isSameCalendarDay
    ? `Today • ${timeString}`
    : isTomorrow
    ? `Tomorrow • ${timeString}`
    : `${dateString} • ${timeString}`;

  return {
    urgency,
    relativeTime,
    isOverdue,
    hoursRemaining: Math.round(diffHours * 10) / 10,
    daysRemaining: Math.round(diffDays * 10) / 10,
    formattedDue
  };
}

/**
 * Enriches a list of assignments with real-time dynamic deadline evaluations and sort ordering.
 */
export function sortAndEnrichAssignments(assignments: Assignment[], now: Date = new Date()): Assignment[] {
  return assignments
    .map(a => {
      const analysis = analyzeDeadline(a.dueDateISO, now);
      return {
        ...a,
        urgency: analysis.urgency,
        relativeTime: analysis.relativeTime,
        dueDate: analysis.formattedDue
      };
    })
    .sort((a, b) => {
      // 1. Pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // 2. Completed items at bottom
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;

      // 3. Overdue and nearest deadline first
      const timeA = new Date(a.dueDateISO).getTime();
      const timeB = new Date(b.dueDateISO).getTime();
      return timeA - timeB;
    });
}

/**
 * Calculates sprint and academic velocity statistics.
 */
export function calculateAcademicMetrics(assignments: Assignment[], now: Date = new Date()) {
  const total = assignments.length;
  let completed = 0;
  let dueToday = 0;
  let critical = 0;
  let overdue = 0;
  let totalEstimatedHours = 0;
  let completedHours = 0;

  assignments.forEach(a => {
    const analysis = analyzeDeadline(a.dueDateISO, now);
    if (a.isCompleted) {
      completed++;
      completedHours += a.estimatedHours || 0;
    } else {
      totalEstimatedHours += a.estimatedHours || 0;
      if (analysis.isOverdue) overdue++;
      if (analysis.urgency === 'DUE_TODAY') dueToday++;
      if (a.priority === 'Critical') critical++;
    }
  });

  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    dueToday,
    critical,
    overdue,
    completionPercentage,
    totalEstimatedHours: Math.round(totalEstimatedHours * 10) / 10,
    completedHours: Math.round(completedHours * 10) / 10
  };
}
