import React from 'react';
import {
  CheckCircle2,
  Circle,
  Pin,
  FileText,
  Clock,
  UserCheck,
  Download,
  AlertCircle
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

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'High':
        return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Normal':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      onClick={() => onSelect(assignment)}
      className={`group relative bg-white rounded-lg border transition-all p-3.5 cursor-pointer shadow-xs hover:border-indigo-400 hover:shadow-sm ${
        assignment.isCompleted
          ? 'border-gray-200 bg-gray-50/60 opacity-85'
          : assignment.isPinned
          ? 'border-indigo-200 bg-indigo-50/20'
          : 'border-gray-200'
      }`}
    >
      {/* Top row: Subject code, Status, Pin, Priority */}
      <div className="flex items-center justify-between text-[11px] mb-2">
        <div className="flex items-center space-x-1.5 font-mono">
          <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
            {assignment.subjectCode}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500 font-semibold truncate max-w-[140px]">
            {assignment.subjectName}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Priority Pill */}
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border font-mono ${getPriorityStyle(
              assignment.priority
            )}`}
          >
            {assignment.priority}
          </span>

          {/* Pin Button (CR/Faculty only) */}
          {userRole !== 'STUDENT' && (
            <button
              onClick={e => onTogglePin(assignment.id, e)}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                assignment.isPinned ? 'text-indigo-600' : 'text-gray-300 hover:text-gray-600'
              }`}
              title={assignment.isPinned ? 'Unpin from Top' : 'Pin to Top (CR)'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Checkbox */}
      <div className="flex items-start space-x-2.5 mb-2.5">
        <button
          onClick={e => onToggleComplete(assignment.id, e)}
          className="mt-0.5 text-gray-300 hover:text-green-600 transition-colors flex-shrink-0"
          title={assignment.isCompleted ? 'Mark as Incomplete' : 'Mark as Done'}
        >
          {assignment.isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <Circle className="w-4 h-4 text-gray-300 group-hover:text-indigo-600" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-xs font-semibold leading-snug ${
              assignment.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
            }`}
          >
            {assignment.title}
          </h3>
          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
            {assignment.description}
          </p>
        </div>
      </div>

      {/* Footer: Due date, Teacher, Attachments, Faculty Verification */}
      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-100 text-gray-500 font-mono">
        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center space-x-1 font-semibold ${
              isOverdue
                ? 'text-red-600 bg-red-50 px-1.5 py-0.5 rounded'
                : assignment.dueDate.includes('Today')
                ? 'text-red-700 bg-red-50 px-1.5 py-0.5 rounded'
                : 'text-gray-700'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>{assignment.dueDate}</span>
          </span>

          {assignment.attachments.length > 0 && (
            <span className="inline-flex items-center space-x-1 text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
              <FileText className="w-3 h-3 text-indigo-500" />
              <span>{assignment.attachments.length} {assignment.attachments.length === 1 ? 'file' : 'files'}</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {assignment.isVerified ? (
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              ✓ Verified
            </span>
          ) : (
            <span className="text-[10px] text-gray-400">
              {assignment.teacher.split(' ').slice(-1)[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
