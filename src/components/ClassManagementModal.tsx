import React, { useState } from 'react';
import {
  X,
  Users,
  Copy,
  Check,
  Plus,
  ArrowRight,
  School,
  GraduationCap,
  Shield,
  QrCode
} from 'lucide-react';
import { ClassCohort, ClassMember, Role } from '../types/index.js';

interface ClassManagementModalProps {
  activeCohort: ClassCohort | null;
  enrolledClasses: ClassCohort[];
  members: ClassMember[];
  userRole: Role;
  onClose: () => void;
  onSwitchClass: (classId: string) => Promise<void>;
  onJoinClass: (code: string) => Promise<void>;
  onCreateClass: (data: any) => Promise<void>;
}

export const ClassManagementModal: React.FC<ClassManagementModalProps> = ({
  activeCohort,
  enrolledClasses,
  members,
  userRole,
  onClose,
  onSwitchClass,
  onJoinClass,
  onCreateClass
}) => {
  const [activeTab, setActiveTab] = useState<'switch' | 'join' | 'create' | 'roster'>('switch');
  const [joinCode, setJoinCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newUniversity, setNewUniversity] = useState(activeCohort?.universityName || 'Global University');
  const [newProgram, setNewProgram] = useState(activeCohort?.program || 'Computer Science & Engineering');
  const [newSemester, setNewSemester] = useState(activeCohort?.semester || 'Semester 1');
  const [newSection, setNewSection] = useState(activeCohort?.section || 'Section A');
  const [newAcademicYear, setNewAcademicYear] = useState('2025-2026');
  const [newFaculty, setNewFaculty] = useState(activeCohort?.facultyInCharge || 'Faculty Advisor');

  const handleCopyCode = () => {
    if (activeCohort?.code) {
      navigator.clipboard.writeText(activeCohort.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await onJoinClass(joinCode.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to join class');
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await onCreateClass({
        name: newClassName.trim(),
        universityName: newUniversity,
        program: newProgram,
        semester: newSemester,
        section: newSection,
        academicYear: newAcademicYear,
        facultyInCharge: newFaculty
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create class');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Topbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-2">
            <School className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-900 font-mono">CLASS COHORT MANAGER</h2>
              <p className="text-[11px] text-gray-500">
                Switch cohorts, join via class code, or invite students.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-4 bg-white text-xs font-mono">
          <button
            onClick={() => setActiveTab('switch')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'switch'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            My Classes ({enrolledClasses.length})
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'roster'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Class Roster ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'join'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Join with Code
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`py-2.5 px-3 border-b-2 font-bold transition-colors ${
              activeTab === 'create'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            + Create Cohort
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          {/* 1. SWITCH CLASSES TAB */}
          {activeTab === 'switch' && (
            <div className="space-y-4">
              {/* Current Active Banner */}
              {activeCohort && (
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                        CURRENT ACTIVE COHORT
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 mt-1">
                        {activeCohort.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activeCohort.universityName} • {activeCohort.academicYear}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-gray-400">Class Code</div>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <span className="text-xs font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {activeCohort.code}
                        </span>
                        <button
                          onClick={handleCopyCode}
                          className="p-1 text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 rounded"
                          title="Copy Code to Share with Students"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Class List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-500 uppercase font-mono">
                  Enrolled Class Cohorts
                </div>
                {enrolledClasses.map(c => {
                  const isActive = c.id === activeCohort?.id;
                  return (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-50/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2 font-mono text-xs">
                          <span className="font-bold text-gray-900">{c.code}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">{c.branch}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-800 mt-0.5">{c.name}</p>
                        <p className="text-[11px] text-gray-400">{c.universityName}</p>
                      </div>

                      {isActive ? (
                        <span className="px-2.5 py-1 bg-indigo-600 text-white text-[11px] font-semibold rounded-md">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={async () => {
                            await onSwitchClass(c.id);
                            onClose();
                          }}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-md transition-colors"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. ROSTER TAB */}
          {activeTab === 'roster' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-gray-500">
                <span>MEMBERS OF {activeCohort?.code}</span>
                <span>{members.length} ENROLLED</span>
              </div>

              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                {members.map(m => (
                  <div key={m.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 font-mono">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center space-x-1.5">
                          <span>{m.name}</span>
                          {m.rollNo && (
                            <span className="text-[10px] text-gray-400 font-mono">
                              ({m.rollNo})
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-[11px]">{m.email}</div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        m.role === 'CR'
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : m.role === 'FACULTY'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {m.role === 'CR' ? 'Class Rep (CR)' : m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. JOIN WITH CODE TAB */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <QrCode className="w-12 h-12 text-indigo-600 mx-auto mb-2 opacity-80" />
                <h3 className="text-sm font-bold text-gray-900">Enter Class Join Code</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                  Obtain the 8-character cohort code from your Class Representative (CR) or Faculty Advisor.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Class Cohort Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CU-24CSE-4A"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm font-mono text-center tracking-widest border border-gray-300 rounded-lg uppercase focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !joinCode.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <span>Join Class Cohort</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 4. CREATE COHORT TAB */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Class Cohort Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer Science - Semester 4 (Section B)"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                    University / Institution
                  </label>
                  <input
                    type="text"
                    value={newUniversity}
                    onChange={e => setNewUniversity(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                    Program / Degree
                  </label>
                  <input
                    type="text"
                    value={newProgram}
                    onChange={e => setNewProgram(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={newSemester}
                    onChange={e => setNewSemester(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    value={newSection}
                    onChange={e => setNewSection(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={newAcademicYear}
                    onChange={e => setNewAcademicYear(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
                  Faculty Advisor / In-Charge
                </label>
                <input
                  type="text"
                  value={newFaculty}
                  onChange={e => setNewFaculty(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !newClassName.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  Create & Launch Class Cohort
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
