import React, { useState } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  AlertCircle,
  Paperclip
} from 'lucide-react';
import { Priority, Role, Attachment } from '../types/index.js';

interface CreateAssignmentModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  userRole: Role;
}

const COMMON_SUBJECTS = [
  { code: 'CST-241', name: 'Database Management Systems', teacher: 'Dr. Rajiv Kumar' },
  { code: 'CST-242', name: 'Operating Systems & System Programming', teacher: 'Prof. Neha Sundaram' },
  { code: 'CST-243', name: 'Design & Analysis of Algorithms', teacher: 'Dr. V. K. Aggarwal' },
  { code: 'CST-244', name: 'Full Stack Web Engineering', teacher: 'Prof. Ankit Sharma' },
  { code: 'MTH-201', name: 'Discrete Mathematical Structures', teacher: 'Dr. S. K. Mittal' }
];

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  onClose,
  onSubmit,
  userRole
}) => {
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('CST-241');
  const [subjectName, setSubjectName] = useState('Database Management Systems');
  const [teacher, setTeacher] = useState('Dr. Rajiv Kumar');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [estimatedHours, setEstimatedHours] = useState(3);
  const [dueDateText, setDueDateText] = useState('Tomorrow • 11:59 PM');
  const [dueDateISO, setDueDateISO] = useState(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16)
  );

  const [instructions, setInstructions] = useState<string[]>([
    'Review the assignment rubric and lecture guidelines.',
    'Write clean, modular code with comments and unit test cases.',
    'Submit final document / archive file before deadline.'
  ]);
  const [newInstruction, setNewInstruction] = useState('');

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubjectChange = (code: string) => {
    setSubjectCode(code);
    const found = COMMON_SUBJECTS.find(s => s.code === code);
    if (found) {
      setSubjectName(found.name);
      setTeacher(found.teacher);
    }
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (idx: number) => {
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newAttachment: Attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          dataUrl,
          uploadedAt: new Date().toISOString()
        };
        setAttachments(prev => [...prev, newAttachment]);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an assignment title.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        subjectCode,
        subjectName,
        teacher,
        description,
        priority,
        estimatedHours: Number(estimatedHours),
        dueDate: dueDateText,
        dueDateISO: new Date(dueDateISO).toISOString(),
        instructions,
        attachments
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to publish assignment');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-sm font-bold text-gray-900 font-mono flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span>PUBLISH ACADEMIC ASSIGNMENT</span>
            </h2>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Broadcast assignment specifications, files, and milestones to the class cohort.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement B+ Tree Indexing in C++"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Subject & Teacher Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                Subject Preset / Code
              </label>
              <select
                value={subjectCode}
                onChange={e => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {COMMON_SUBJECTS.map(s => (
                  <option key={s.code} value={s.code}>
                    [{s.code}] {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                Course Faculty / Instructor
              </label>
              <input
                type="text"
                value={teacher}
                onChange={e => setTeacher(e.target.value)}
                placeholder="Dr. Rajiv Kumar"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                Urgency Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Critical">🔴 Critical</option>
                <option value="High">🟠 High</option>
                <option value="Normal">🟡 Normal</option>
                <option value="Low">🟢 Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                Effort (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                value={estimatedHours}
                onChange={e => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                Submission Deadline
              </label>
              <input
                type="datetime-local"
                value={dueDateISO}
                onChange={e => {
                  setDueDateISO(e.target.value);
                  const d = new Date(e.target.value);
                  setDueDateText(
                    `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  );
                }}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
              Description / Problem Statement
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Outline the core objective, problem constraints, and submission criteria..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Step Guidelines Builder */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
              Submission Guidelines Checklist
            </label>
            <div className="space-y-1.5 mb-2">
              {instructions.map((ins, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center font-mono flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-gray-700">{ins}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(i)}
                    className="text-gray-400 hover:text-red-500 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add guideline step..."
                value={newInstruction}
                onChange={e => setNewInstruction(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInstruction();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddInstruction}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-md transition-colors"
              >
                Add Step
              </button>
            </div>
          </div>

          {/* Real Attachments Upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
              Attachments (PDF, Specs, Code Starters)
            </label>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-1"
              >
                <Paperclip className="w-5 h-5 text-indigo-500" />
                <span className="text-xs font-semibold text-indigo-600 hover:underline">
                  Click to browse files or drag here
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Supported: PDF, ZIP, DOCX, TXT
                </span>
              </label>
            </div>

            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map(att => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between px-3 py-1.5 bg-indigo-50/60 border border-indigo-100 rounded text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 truncate">{att.name}</span>
                      <span className="text-gray-400 font-mono text-[10px]">({att.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing to Class...</span>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish Assignment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
