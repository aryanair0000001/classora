import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Upload, 
  Bookmark, 
  BookmarkCheck, 
  Download, 
  FileText, 
  Filter, 
  Sparkles, 
  Plus, 
  Check, 
  ExternalLink,
  Shield,
  Layers,
  X
} from 'lucide-react';
import { StudyNote, Role, ClassCohort } from '../types/index.js';
import { api } from '../services/api.js';

interface NotesHubViewProps {
  activeCohort: ClassCohort | null;
  userRole?: Role;
  onAskAIAboutNote?: (note: StudyNote) => void;
}

export const NotesHubView: React.FC<NotesHubViewProps> = ({
  activeCohort,
  userRole,
  onAskAIAboutNote
}) => {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Note Form State
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('CST-241');
  const [subjectName, setSubjectName] = useState('Database Management Systems');
  const [description, setDescription] = useState('');
  const [noteType, setNoteType] = useState<'PDF' | 'DOC' | 'PPT' | 'IMG' | 'NOTE'>('PDF');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const data = await api.getNotes({
        subject: selectedSubject,
        search: searchQuery
      });
      setNotes(data);
    } catch (err) {
      console.error('Failed to load study notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [selectedSubject, searchQuery]);

  const handleToggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.toggleNoteBookmark(id);
      setNotes(prev => prev.map(n => n.id === id ? { ...n, isBookmarked: res.isBookmarked } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await api.uploadNote({
        title: title.trim(),
        subjectCode,
        subjectName,
        description: description.trim(),
        type: noteType,
        size: `${(Math.random() * 2 + 1.2).toFixed(1)} MB`,
        fileUrl: '#'
      });

      setTitle('');
      setDescription('');
      setIsUploadModalOpen(false);
      await loadNotes();
    } catch (err) {
      console.error('Failed to upload note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (note: StudyNote) => {
    // Simulated clean browser file download blob
    const element = document.createElement('a');
    const file = new Blob([
      `Classora Academic Note Repository\nTitle: ${note.title}\nSubject: ${note.subjectName} (${note.subjectCode})\nAuthor: ${note.author} (${note.authorRole})\nCohort: ${activeCohort?.name || 'Classora'}\nUploaded: ${new Date(note.uploadedAt).toLocaleDateString()}\n\nSummary:\n${note.description || 'Academic review notes and tutorial formulas.'}`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${note.subjectCode}_${note.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const displayedNotes = filterBookmarked ? notes.filter(n => n.isBookmarked) : notes;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Upload Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 border border-indigo-500/20 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Academic Notes & Resource Hub
              </h1>
              <p className="text-xs text-slate-400">
                Shared course lecture slides, handwritten derivations, and tutorial question sets
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Notes</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes, chapters, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Subject Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['ALL', 'CST-241', 'CST-242', 'CST-243', 'CST-244'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {sub}
            </button>
          ))}

          <button
            onClick={() => setFilterBookmarked(!filterBookmarked)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors shrink-0 ${
              filterBookmarked
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved</span>
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : displayedNotes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300">No notes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            {filterBookmarked ? 'You have not bookmarked any notes yet.' : 'Be the first to upload lecture notes or study sheets for this cohort.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('ALL');
              setFilterBookmarked(false);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedNotes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 group"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 font-mono text-[11px] font-bold border border-indigo-800/40">
                      {note.subjectCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono text-[10px]">
                      {note.type} • {note.size}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleToggleBookmark(note.id, e)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                    title={note.isBookmarked ? 'Remove Bookmark' : 'Bookmark Note'}
                  >
                    {note.isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {note.title}
                </h3>

                {/* Description */}
                {note.description && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {note.description}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                    {note.author[0]}
                  </div>
                  <span className="truncate text-[11px]">{note.author}</span>
                  {note.authorRole === 'TEACHER' && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 text-[9px] font-bold font-mono">
                      Faculty
                    </span>
                  )}
                  {note.authorRole === 'CR' && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[9px] font-bold font-mono">
                      CR
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(note)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors flex items-center gap-1"
                    title="Download Note"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Upload Class Study Notes</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 B+ Tree Splits & Query Cost Calculations"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Subject Code</label>
                  <select
                    value={subjectCode}
                    onChange={(e) => {
                      setSubjectCode(e.target.value);
                      if (e.target.value === 'CST-241') setSubjectName('Database Management Systems');
                      if (e.target.value === 'CST-242') setSubjectName('Operating Systems');
                      if (e.target.value === 'CST-243') setSubjectName('Design & Analysis of Algorithms');
                      if (e.target.value === 'CST-244') setSubjectName('Web Engineering');
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                  >
                    <option value="CST-241">CST-241 (DBMS)</option>
                    <option value="CST-242">CST-242 (OS)</option>
                    <option value="CST-243">CST-243 (DAA)</option>
                    <option value="CST-244">CST-244 (Web Eng)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Document Format</label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOC">Word Doc (.docx)</option>
                    <option value="PPT">PowerPoint (.pptx)</option>
                    <option value="IMG">Handwritten Scans (Image)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description / Key Formulas</label>
                <textarea
                  rows={3}
                  placeholder="Outline key topics covered, exam relevance, or page chapters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed"
                />
              </div>

              {/* Drag and Drop Box */}
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-4 text-center bg-slate-950/60 hover:border-indigo-500/50 transition-colors">
                <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-300 font-medium">Drag & drop note file or click to browse</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">Supports PDF, DOCX, PPTX up to 50MB</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Publish to Cohort'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
