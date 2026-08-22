import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  MessageSquare,
  FileText,
  KeyRound,
  ShieldCheck,
  UserCheck,
  UserX,
  Copy,
  Check,
  RefreshCw,
  Send,
  Pin,
  UploadCloud,
  Download,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
  BookOpen,
  Plus
} from 'lucide-react';
import {
  ClassCohort,
  ClassMember,
  JoinRequest,
  ClassResource,
  ChatMessage,
  Role,
  UserProfile
} from '../types/index.js';
import { api } from '../services/api.js';

interface ClassHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCohort: ClassCohort | null;
  userRole: Role;
  profile: UserProfile | null;
  onClassUpdated?: () => void;
}

export const ClassHubModal: React.FC<ClassHubModalProps> = ({
  isOpen,
  onClose,
  activeCohort,
  userRole,
  profile,
  onClassUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'requests' | 'chat' | 'resources' | 'code'>('roster');
  
  // Data states
  const [members, setMembers] = useState<ClassMember[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [resources, setResources] = useState<ClassResource[]>([]);
  
  // Input states
  const [chatInput, setChatInput] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // New Resource Form state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newResTitle, setNewResTitle] = useState<string>('');
  const [newResDesc, setNewResDesc] = useState<string>('');
  const [newResType, setNewResType] = useState<'PDF' | 'DOC' | 'PPT' | 'LINK' | 'IMAGE'>('PDF');

  const isCR = userRole === 'CR' || userRole === 'ADMIN';
  const isFaculty = userRole === 'TEACHER' || userRole === 'FACULTY';

  const loadHubData = async () => {
    if (!activeCohort) return;
    setIsLoadingData(true);
    try {
      const [mems, reqs, msgs, resList] = await Promise.all([
        api.getClassMembers(),
        isCR ? api.getJoinRequests() : Promise.resolve([]),
        api.getMessages(),
        api.getResources()
      ]);
      setMembers(mems);
      setRequests(reqs);
      setMessages(msgs);
      setResources(resList);
    } catch (err) {
      console.error('Failed to load class hub data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHubData();
    }
  }, [isOpen, activeCohort, userRole]);

  if (!isOpen || !activeCohort) return null;

  const handleCopyCode = () => {
    if (activeCohort.code) {
      navigator.clipboard.writeText(activeCohort.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleRegenerateCode = async () => {
    if (!confirm('Are you sure you want to regenerate the class join code? Old codes will expire.')) return;
    setIsRegenerating(true);
    try {
      const res = await api.regenerateClassCode();
      activeCohort.code = res.newCode;
      setIsCopied(false);
      if (onClassUpdated) onClassUpdated();
    } catch (e: any) {
      alert(e.message || 'Failed to regenerate code');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      await api.approveJoinRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
      await loadHubData();
      if (onClassUpdated) onClassUpdated();
    } catch (e: any) {
      alert(e.message || 'Approval failed');
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await api.rejectJoinRequest(id);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (e: any) {
      alert(e.message || 'Reject failed');
    }
  };

  const handleRemoveMember = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from this class?`)) return;
    try {
      await api.removeMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
      if (onClassUpdated) onClassUpdated();
    } catch (e: any) {
      alert(e.message || 'Remove member failed');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    try {
      const newMsg = await api.sendMessage({ message: chatInput.trim() });
      setMessages(prev => [...prev, newMsg]);
      setChatInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to send chat message');
    }
  };

  const handleTogglePinMessage = async (id: string) => {
    try {
      const res = await api.togglePinMessage(id);
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, isPinned: res.isPinned } : m))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to pin message');
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim()) return;
    try {
      const created = await api.createResource({
        title: newResTitle.trim(),
        description: newResDesc.trim() || undefined,
        type: newResType,
        size: '2.1 MB'
      });
      setResources(prev => [created, ...prev]);
      setShowUploadModal(false);
      setNewResTitle('');
      setNewResDesc('');
    } catch (e: any) {
      alert(e.message || 'Failed to upload resource');
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.deleteResource(id);
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (e: any) {
      alert(e.message || 'Failed to delete resource');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{activeCohort.name}</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeCohort.code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeCohort.universityName} • {activeCohort.totalStudents} Enrolled • CR: {activeCohort.crName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
          
          <button
            type="button"
            onClick={() => setActiveTab('roster')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'roster'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Class Roster ({members.length})
          </button>

          {isCR && (
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'requests'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Join Requests
              {requests.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-[10px] text-white font-bold animate-pulse">
                  {requests.length}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Class Discussion
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resources')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'resources'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Notes & Resources ({resources.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === 'code'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Join Code & Access
          </button>

        </div>

        {/* Tab Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* 1. Class Roster Tab */}
          {activeTab === 'roster' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Verified Classmates ({members.length})</span>
                <span className="text-[11px] text-slate-500">Class Representative: {activeCohort.crName}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {members.map(member => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                          {member.name}
                          {member.role === 'CR' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              CR
                            </span>
                          )}
                          {member.role === 'TEACHER' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Faculty
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {member.rollNo || member.email}
                        </div>
                      </div>
                    </div>

                    {isCR && member.role !== 'CR' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remove student from class"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Join Requests Tab (CR Only) */}
          {activeTab === 'requests' && isCR && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Pending Student Join Requests</h3>
                  <p className="text-xs text-slate-400">
                    Review and verify students requesting access to {activeCohort.name}.
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {requests.length} Pending
                </span>
              </div>

              {requests.length === 0 ? (
                <div className="text-center py-10 rounded-xl bg-slate-800/20 border border-slate-800/60 space-y-2">
                  <UserCheck className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs font-medium text-slate-400">No pending join requests</p>
                  <p className="text-[11px] text-slate-500">Share your class join code with classmates to invite them.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {requests.map(req => (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                          {req.studentName}
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                            {req.rollNo || 'No ID'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">{req.studentEmail}</div>
                        <div className="text-[10px] text-slate-500">
                          Requested: {new Date(req.requestedAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleRejectRequest(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
                        >
                          <UserX className="w-3.5 h-3.5 text-rose-400" /> Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(req.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Approve Student
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Discussion / Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[400px]">
              
              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-3">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl border ${
                      msg.isAnnouncement
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : msg.senderRole === 'CR'
                        ? 'bg-indigo-950/30 border-indigo-500/30'
                        : 'bg-slate-800/40 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{msg.senderName}</span>
                        {msg.isAnnouncement && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Notice
                          </span>
                        )}
                        {msg.isPinned && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 flex items-center gap-0.5">
                            <Pin className="w-2.5 h-2.5" /> Pinned
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                        {(isCR || isFaculty) && (
                          <button
                            type="button"
                            onClick={() => handleTogglePinMessage(msg.id)}
                            className="text-slate-500 hover:text-indigo-300"
                            title={msg.isPinned ? 'Unpin message' : 'Pin message'}
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{msg.message}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type a message or question for your classmates..."
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>
          )}

          {/* 4. Notes & Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Class Notes & Shared Materials</h3>
                  <p className="text-xs text-slate-400">PDFs, slide decks, and code starter kits for this semester.</p>
                </div>
                {(isCR || isFaculty) && (
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Upload Material
                  </button>
                )}
              </div>

              {showUploadModal && (
                <form onSubmit={handleCreateResource} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                  <div className="text-xs font-semibold text-white">Add New Study Resource</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Title (e.g. Unit 3 DBMS Indexing Notes)"
                      value={newResTitle}
                      onChange={e => setNewResTitle(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      required
                    />
                    <select
                      value={newResType}
                      onChange={e => setNewResType(e.target.value as any)}
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="DOC">Word / Doc</option>
                      <option value="PPT">PowerPoint Slide</option>
                      <option value="LINK">Web Link</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Brief description or instructor instructions..."
                    value={newResDesc}
                    onChange={e => setNewResDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                    >
                      Publish Resource
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resources.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {res.type}
                        </span>
                        <span className="text-[10px] text-slate-500">{res.size}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-2">{res.title}</h4>
                      {res.description && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{res.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                      <span>By {res.uploadedBy}</span>
                      <div className="flex items-center gap-2">
                        {(isCR || isFaculty) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteResource(res.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <a
                          href={res.fileUrl || '#'}
                          download
                          className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Join Code & Security Tab */}
          {activeTab === 'code' && (
            <div className="space-y-5 max-w-lg mx-auto py-3">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white">Class Join Code</h3>
                <p className="text-xs text-slate-400">
                  Share this secure code with your classmates. Students must enter this code to request entry.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 text-center space-y-4">
                <div className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-indigo-200 selection:bg-indigo-500">
                  {activeCohort.code}
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    {isCopied ? 'Code Copied!' : 'Copy Code'}
                  </button>

                  {isCR && (
                    <button
                      type="button"
                      disabled={isRegenerating}
                      onClick={handleRegenerateCode}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border border-slate-700"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800 text-xs text-slate-400 space-y-2">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Protected Class Governance
                </div>
                <p className="leading-relaxed text-[11px]">
                  When a student enters this code, they submit a Join Request. They only gain access to assignments, calendars, and resources once approved by you as the Class Representative.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
