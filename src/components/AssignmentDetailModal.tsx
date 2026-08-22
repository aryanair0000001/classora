import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  FileText,
  Download,
  Share2,
  Trash2,
  ShieldCheck,
  Award,
  BookOpen,
  Pin,
  ExternalLink,
  Sparkles,
  UploadCloud,
  Send,
  AlertCircle,
  GraduationCap,
  MessageSquare,
  Check
} from 'lucide-react';
import { Assignment, Role, StudentSubmission, Attachment } from '../types/index.js';
import { api } from '../services/api.js';

interface AssignmentDetailModalProps {
  assignment: Assignment | null;
  userRole: Role;
  isOpen: boolean;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onAssignmentUpdated?: () => void;
}

export const AssignmentDetailModal: React.FC<AssignmentDetailModalProps> = ({
  assignment,
  userRole,
  isOpen,
  onClose,
  onToggleComplete,
  onAssignmentUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'submission' | 'gradebook'>('overview');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Student submission state
  const [mySub, setMySub] = useState<StudentSubmission | null>(null);
  const [submissionText, setSubmissionText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Faculty/CR submissions state
  const [submissionsList, setSubmissionsList] = useState<StudentSubmission[]>([]);
  const [selectedSub, setSelectedSub] = useState<StudentSubmission | null>(null);
  const [gradingScore, setGradingScore] = useState<string>('');
  const [gradingFeedback, setGradingFeedback] = useState<string>('');
  const [isSavingGrade, setIsSavingGrade] = useState<boolean>(false);

  const isCR = userRole === 'CR' || userRole === 'ADMIN';
  const isFaculty = userRole === 'TEACHER' || userRole === 'FACULTY' || userRole === 'ADMIN';

  useEffect(() => {
    if (!isOpen || !assignment) return;
    
    // Load student's own submission
    api.getMySubmission(assignment.id)
      .then(s => {
        setMySub(s);
        if (s.content) setSubmissionText(s.content);
      })
      .catch(() => {});

    // If Faculty or CR, load all submissions
    if (isFaculty || isCR) {
      api.getSubmissions(assignment.id)
        .then(subs => setSubmissionsList(subs))
        .catch(() => {});
    }
  }, [isOpen, assignment, userRole]);

  if (!isOpen || !assignment) return null;

  const isOverdue = !assignment.isCompleted && new Date(assignment.dueDateISO).getTime() < Date.now();

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      await api.verifyAssignment(assignment.id);
      if (onAssignmentUpdated) onAssignmentUpdated();
    } catch (e: any) {
      alert(e.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this assignment from the class cohort?')) return;
    setIsDeleting(true);
    try {
      await api.deleteAssignment(assignment.id);
      if (onAssignmentUpdated) onAssignmentUpdated();
      onClose();
    } catch (e: any) {
      alert(e.message || 'Failed to delete assignment');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    const text = `📚 ${assignment.title} (${assignment.subjectCode})\nDue: ${assignment.dueDate}\nTeacher: ${assignment.teacher}\nTrack on Classora: Never Miss What Matters.`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitWork = async () => {
    if (!submissionText.trim()) return;
    setIsSubmitting(true);
    try {
      const mockAttachment: Attachment = {
        id: `att-sub-${Date.now()}`,
        name: `${assignment.subjectCode}_Submission_${assignment.id}.pdf`,
        size: '1.2 MB',
        type: 'PDF',
        uploadedAt: new Date().toISOString()
      };

      const res = await api.submitAssignment(assignment.id, {
        content: submissionText,
        attachments: [mockAttachment]
      });

      setMySub(res);
      setSubmissionSuccess(true);
      if (onAssignmentUpdated) onAssignmentUpdated();
      setTimeout(() => setSubmissionSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit work');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSub) return;
    setIsSavingGrade(true);
    try {
      const updated = await api.reviewSubmission(selectedSub.id, {
        grade: gradingScore,
        feedback: gradingFeedback,
        status: 'COMPLETED'
      });

      setSubmissionsList(prev => prev.map(s => s.id === updated.id ? updated : s));
      setSelectedSub(updated);
      alert('Grading feedback saved and student notified.');
      if (onAssignmentUpdated) onAssignmentUpdated();
    } catch (err: any) {
      alert(err.message || 'Failed to save grade');
    } finally {
      setIsSavingGrade(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5 font-mono text-xs">
              <span className="font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                {assignment.subjectCode}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300 font-semibold">{assignment.subjectName}</span>
              <span className="text-slate-500">•</span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                assignment.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
              }`}>
                {assignment.priority} Priority
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {assignment.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 sm:px-6 border-b border-slate-800 bg-slate-950/40 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guidelines & Rubric</span>
          </button>

          <button
            onClick={() => setActiveTab('submission')}
            className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'submission'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>My Submission {mySub && mySub.status !== 'NOT_STARTED' && '✓'}</span>
          </button>

          {(isFaculty || isCR) && (
            <button
              onClick={() => setActiveTab('gradebook')}
              className={`py-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'gradebook'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Submissions ({submissionsList.length})</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {activeTab === 'overview' && (
            <>
              {/* Metadata Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Instructor</div>
                  <div className="font-semibold text-slate-200 mt-0.5 truncate">{assignment.teacher}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Due Date</div>
                  <div className="font-semibold text-indigo-300 mt-0.5 truncate">{assignment.dueDate}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Estimated Time</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{assignment.estimatedHours} Hours</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Status</div>
                  <div className="font-semibold text-emerald-400 mt-0.5">
                    {assignment.isCompleted ? 'Completed ✓' : isOverdue ? 'Overdue ⚠️' : 'Active'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Course Description & Overview</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap p-3.5 rounded-xl bg-slate-800/30 border border-slate-800">
                  {assignment.description}
                </p>
              </div>

              {/* Instructions Checklist */}
              {assignment.instructions && assignment.instructions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Task Instructions & Rubric</h4>
                  <div className="space-y-2">
                    {assignment.instructions.map((inst, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/30 border border-slate-800 text-xs text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{inst}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {assignment.attachments && assignment.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Reference Materials & Attachments</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {assignment.attachments.map(att => (
                      <div key={att.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate">{att.name}</div>
                            <div className="text-[10px] text-slate-400">{att.size} • {att.type}</div>
                          </div>
                        </div>
                        <a
                          href={att.dataUrl || '#'}
                          download={att.name}
                          className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Download reference document"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Badge */}
              {assignment.isVerified && (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-300">Officially Verified by Faculty</div>
                    <div className="text-[11px] text-slate-400">
                      Rubric and criteria confirmed by {assignment.verifiedBy || assignment.teacher}.
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Student Work Submission Tab */}
          {activeTab === 'submission' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono uppercase font-bold text-slate-400">Submission State</div>
                  <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${
                      mySub?.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      mySub?.status === 'SUBMITTED' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      mySub?.status === 'LATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {mySub?.status || 'NOT_STARTED'}
                    </span>
                    {mySub?.isLate && <span className="text-amber-400 text-xs font-mono">⚠️ Submitted after deadline</span>}
                  </div>
                </div>

                {mySub?.submittedAt && (
                  <div className="text-right text-[11px] text-slate-400 font-mono">
                    <div>Recorded:</div>
                    <div className="text-slate-200">{new Date(mySub.submittedAt).toLocaleString()}</div>
                  </div>
                )}
              </div>

              {/* Feedback & Grade Card if reviewed */}
              {mySub?.grade && (
                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 font-mono">Faculty Evaluation & Score:</span>
                    <span className="px-2.5 py-1 rounded bg-indigo-600 text-white font-mono font-bold text-xs">
                      {mySub.grade}
                    </span>
                  </div>
                  {mySub.feedback && (
                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                      "{mySub.feedback}"
                    </p>
                  )}
                  <div className="text-[10px] text-slate-400 font-mono">
                    Reviewed by {mySub.reviewedBy || 'Faculty'} • {mySub.reviewedAt ? new Date(mySub.reviewedAt).toLocaleDateString() : ''}
                  </div>
                </div>
              )}

              {/* Submit Work Form */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                  Write Submission Summary or Github / Drive URL
                </label>
                <textarea
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  placeholder="Paste your source code link, Drive document URL, or executive submission summary here..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />

                <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-center space-y-2">
                  <UploadCloud className="w-6 h-6 text-indigo-400 mx-auto" />
                  <div className="text-xs text-slate-300 font-semibold">
                    Attached Deliverable: <span className="text-indigo-300 font-mono">{assignment.subjectCode}_Submission_{assignment.id}.pdf</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    File will be timestamped and saved with official cohort record.
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting || !submissionText.trim()}
                  onClick={handleSubmitWork}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Uploading & Submitting...' : 'Turn In Final Assignment'}
                </button>

                {submissionSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Assignment submitted successfully!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Faculty / CR Gradebook Tab */}
          {activeTab === 'gradebook' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-400">
                Class Submissions Queue ({submissionsList.length} Turned In)
              </div>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                {submissionsList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 font-mono">
                    No submissions recorded yet for this task.
                  </div>
                ) : (
                  submissionsList.map(sub => (
                    <div
                      key={sub.id}
                      onClick={() => {
                        setSelectedSub(sub);
                        setGradingScore(sub.grade || '');
                        setGradingFeedback(sub.feedback || '');
                      }}
                      className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                        selectedSub?.id === sub.id ? 'bg-indigo-950/30' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{sub.studentName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({sub.studentRollNo || '22CS0142'})</span>
                          {sub.isLate && <span className="text-[10px] text-amber-400 font-mono">LATE</span>}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-sm">
                          {sub.content || 'Attached file submission'}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          sub.grade ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {sub.grade ? `Grade: ${sub.grade}` : 'Pending Grade'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Selected Submission Grading Panel */}
              {selectedSub && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 font-mono">
                      Grading: {selectedSub.studentName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Submitted {selectedSub.submittedAt ? new Date(selectedSub.submittedAt).toLocaleTimeString() : ''}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    {selectedSub.content}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Grade / Marks (e.g. A+ or 95/100)"
                      value={gradingScore}
                      onChange={e => setGradingScore(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Feedback comments for student"
                      value={gradingFeedback}
                      onChange={e => setGradingFeedback(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isSavingGrade}
                    onClick={handleGradeSubmission}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors font-mono"
                  >
                    {isSavingGrade ? 'Saving...' : 'Confirm Grade & Send Notification'}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Share2 className="w-3.5 h-3.5" />
              {isCopied ? 'Details Copied!' : 'Share'}
            </button>

            {isFaculty && !assignment.isVerified && (
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleVerify}
                className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {isVerifying ? 'Verifying...' : 'Verify Rubric'}
              </button>
            )}

            {(isCR || isFaculty) && (
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onToggleComplete(assignment.id);
            }}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow ${
              assignment.isCompleted
                ? 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {assignment.isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
          </button>

        </div>

      </div>
    </div>
  );
};
