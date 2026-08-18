import React from 'react';
import {
  X,
  Clock,
  UserCheck,
  FileText,
  Download,
  Calendar as CalendarIcon,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Layers,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Assignment, Role } from '../types/index.js';

interface DetailModalProps {
  assignment: Assignment;
  userRole: Role;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onVerify: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AssignmentDetailModal: React.FC<DetailModalProps> = ({
  assignment,
  userRole,
  onClose,
  onToggleComplete,
  onVerify,
  onDelete
}) => {
  const handleCompleteClick = () => {
    if (!assignment.isCompleted) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }
    }
    onToggleComplete(assignment.id);
  };

  const handleDownloadAttachment = (attachment: { name: string; dataUrl?: string }) => {
    if (attachment.dataUrl) {
      const a = document.createElement('a');
      a.href = attachment.dataUrl;
      a.download = attachment.name;
      a.click();
    } else {
      // Mock genuine text download if no base64 was passed
      const blob = new Blob([`Assignment Brief: ${assignment.title}\nSubject: ${assignment.subjectName}\nTeacher: ${assignment.teacher}\nDeadline: ${assignment.dueDate}\n\nInstructions:\n` + assignment.instructions.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Topbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {assignment.id}
            </span>
            <span className="text-gray-400">•</span>
            <span className="font-semibold text-gray-700">{assignment.subjectCode}</span>
            <span className="text-gray-400">•</span>
            <span className={`px-2 py-0.5 rounded font-bold ${
              assignment.priority === 'Critical' ? 'bg-red-100 text-red-800' :
              assignment.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {assignment.priority}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Main Title & Subject Info */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              {assignment.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-500 font-mono">
              <span>{assignment.subjectName}</span>
              <span>•</span>
              <span>Assigned by {assignment.teacher}</span>
              <span>•</span>
              <span>Published by {assignment.createdBy}</span>
            </div>
          </div>

          {/* Key Metric Strip */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs font-mono">
            <div>
              <div className="text-gray-400 text-[10px] uppercase font-bold">Deadline</div>
              <div className="font-semibold text-gray-900 flex items-center space-x-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                <span>{assignment.dueDate}</span>
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-[10px] uppercase font-bold">Est. Effort</div>
              <div className="font-semibold text-gray-900 mt-0.5">
                {assignment.estimatedHours} Hours
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-[10px] uppercase font-bold">Faculty Status</div>
              <div className={`font-semibold mt-0.5 ${assignment.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                {assignment.isVerified ? '✓ Verified' : 'Pending Review'}
              </div>
            </div>
          </div>

          {/* Description */}
          {assignment.description && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono mb-1.5">
                Overview & Objectives
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-md border border-gray-100">
                {assignment.description}
              </p>
            </div>
          )}

          {/* Step-by-Step Instructions */}
          {assignment.instructions && assignment.instructions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono mb-2">
                Submission Guidelines & Steps
              </h4>
              <div className="space-y-2">
                {assignment.instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2.5 text-xs text-gray-700 bg-white p-2.5 rounded border border-gray-200 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold font-mono flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1 leading-normal">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real Attachments & Downloads */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono mb-2">
                Attached Files & Starters ({assignment.attachments.length})
              </h4>
              <div className="space-y-2">
                {assignment.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-indigo-50/40 border border-gray-200 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {att.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono">
                          {att.size} • {att.type}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadAttachment(att)}
                      className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-gray-200 text-indigo-600 text-xs font-semibold rounded flex items-center space-x-1 transition-colors shadow-2xs"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          {/* Complete Button */}
          <button
            onClick={handleCompleteClick}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors shadow-xs ${
              assignment.isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{assignment.isCompleted ? 'Completed ✓ (Mark Incomplete)' : 'Mark as Completed'}</span>
          </button>

          {/* Faculty Verify Action */}
          {userRole === 'FACULTY' && !assignment.isVerified && (
            <button
              onClick={() => onVerify(assignment.id)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors shadow-xs"
              title="Add Faculty Verification Badge"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify (Faculty)</span>
            </button>
          )}

          {/* CR / Faculty Archive Action */}
          {userRole !== 'STUDENT' && (
            <button
              onClick={() => onDelete(assignment.id)}
              className="p-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
              title="Archive / Remove Assignment (CR)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
