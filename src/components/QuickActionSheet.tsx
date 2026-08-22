import React from 'react';
import { 
  X, 
  PlusCircle, 
  FileUp, 
  BellRing, 
  KeyRound, 
  BrainCircuit, 
  Megaphone,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { Role } from '../types/index.js';

interface QuickActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: Role;
  onAction: (action: 'assignment' | 'note' | 'reminder' | 'join' | 'ai' | 'broadcast') => void;
}

export const QuickActionSheet: React.FC<QuickActionSheetProps> = ({
  isOpen,
  onClose,
  userRole,
  onAction
}) => {
  if (!isOpen) return null;

  const isCRorFaculty = userRole === 'CR' || userRole === 'TEACHER' || userRole === 'FACULTY' || userRole === 'ADMIN';

  const actions = [
    {
      id: 'assignment',
      title: isCRorFaculty ? 'Create Assignment' : 'Add Study Task',
      desc: isCRorFaculty ? 'Publish assignment with due date & attachments' : 'Track your personal course milestone',
      icon: PlusCircle,
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20',
      iconBg: 'bg-indigo-600'
    },
    {
      id: 'note',
      title: 'Upload Study Notes',
      desc: 'Share lecture notes, summaries & tutorial sheets',
      icon: FileUp,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
      iconBg: 'bg-emerald-600'
    },
    {
      id: 'ai',
      title: 'AI Doubt Assistant',
      desc: 'Get instant algorithmic breakdowns & concept answers',
      icon: BrainCircuit,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20',
      iconBg: 'bg-purple-600'
    },
    {
      id: 'join',
      title: 'Join Class Cohort',
      desc: 'Enter an invite code provided by your CR or Professor',
      icon: KeyRound,
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20',
      iconBg: 'bg-cyan-600'
    },
    ...(isCRorFaculty ? [{
      id: 'broadcast',
      title: 'Broadcast Announcement',
      desc: 'Send urgent cohort notifications & schedule alerts',
      icon: Megaphone,
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20',
      iconBg: 'bg-rose-600'
    }] : [{
      id: 'reminder',
      title: 'Set Due Date Reminder',
      desc: 'Get alerted before critical deadlines strike',
      icon: BellRing,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
      iconBg: 'bg-amber-600'
    }])
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Quick Actions</h3>
            <p className="text-[11px] text-slate-400">Classora Academic Productivity Hub</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onAction(act.id as any);
                  onClose();
                }}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${act.color}`}
              >
                <div className={`w-10 h-10 rounded-xl ${act.iconBg} text-white flex items-center justify-center shrink-0 shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {act.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {act.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-center">
          <span className="text-[11px] text-slate-500 font-mono">
            Role: <span className="text-indigo-400 font-semibold">{userRole || 'STUDENT'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
