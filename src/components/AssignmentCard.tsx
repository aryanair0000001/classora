import React from 'react';
import {
  CheckCircle2,
  Circle,
  Pin,
  FileText,
  Clock,
  UserCheck,
  Download,
  AlertCircle,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { Assignment, Role } from '../types/index.js';

interface AssignmentCardProps {
  assignment: Assignment;
  userRole: Role;
  onSelect: (a: Assignment) => void;
  onToggleComplete: (id: string, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  userRole,
  onSelect,
  onToggleComplete,
  onTogglePin
}) => {
  const isOverdue = !assignment.isCompleted && new Date(assignment.dueDateISO).getTime() < Date.now();
  const isDueToday = !assignment.isCompleted && !isOverdue && (
    assignment.dueDate.toLowerCase().includes('today') ||
    new Date(assignment.dueDateISO).toDateString() === new Date().toDateString()
  );

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'text-rose-300 bg-rose-500/20 border-rose-500/30';
      case 'High':
        return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
      case 'Normal':
        return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div
      onClick={() => onSelect(assignment)}
      className={`group relative rounded-2xl border transition-all p-4 cursor-pointer shadow-md backdrop-blur-sm ${
        assignment.isCompleted
          ? 'border-slate-800/80 bg-slate-900/40 opacity-75'
          : assignment.isPinned
          ? 'border-indigo-500/40 bg-indigo-950/20 hover:border-indigo-400'
          : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-850'
      }`}
    >
      {/* Top row: Subject code, Status, Pin, Priority */}
      <div className="flex items-center justify-between text-[11px] mb-2.5">
        <div className="flex items-center space-x-2 font-mono">
          <span className="font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30">
            {assignment.subjectCode}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-semibold truncate max-w-[140px] sm:max-w-[200px]">
            {assignment.subjectName}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Priority Pill */}
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border font-mono ${getPriorityStyle(
              assignment.priority
            )}`}
          >
            {assignment.priority}
          </span>

          {/* Pin Button (CR/Faculty only) */}
          {userRole !== 'STUDENT' && (
            <button
              onClick={e => onTogglePin(assignment.id, e)}
              className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors ${
                assignment.isPinned ? 'text-indigo-400' : 'text-slate-600 hover:text-slate-300'
              }`}
              title={assignment.isPinned ? 'Unpin from Top' : 'Pin to Top (CR)'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Checkbox */}
      <div className="flex items-start space-x-3 mb-3">
        <button
          onClick={e => onToggleComplete(assignment.id, e)}
          className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0"
          title={assignment.isCompleted ? 'Mark as Incomplete' : 'Mark as Done'}
        >
          {assignment.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Circle className="w-5 h-5 text-slate-600 group-hover:text-indigo-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-bold leading-snug tracking-tight ${
              assignment.isCompleted ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-white'
            }`}
          >
            {assignment.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {assignment.description}
          </p>
        </div>
      </div>

      {/* Footer: Due date, Teacher, Attachments, Faculty Verification */}
      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80 text-slate-400 font-mono">
        <div className="flex items-center space-x-2.5">
          <span
            className={`inline-flex items-center space-x-1 font-semibold ${
              isOverdue
                ? 'text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-md border border-rose-500/25'
                : isDueToday
                ? 'text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/25'
                : 'text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{assignment.dueDate}</span>
          </span>

          {assignment.attachments.length > 0 && (
            <span className="inline-flex items-center space-x-1 text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md text-[11px] border border-slate-700/80">
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>{assignment.attachments.length} {assignment.attachments.length === 1 ? 'file' : 'files'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {assignment.isVerified ? (
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              ✓ Verified
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">
              {assignment.teacher.split(' ').slice(-1)[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
