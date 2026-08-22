import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  GraduationCap,
  Users,
  BookOpen,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Search,
  Plus,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Role, University, ClassCohort, UserProfile } from '../types/index.js';
import { api } from '../services/api.js';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile?: any) => void;
  onClose?: () => void;
  universities?: University[];
  onAddUniversity?: (u: University) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onClose,
  universities: propUniversities,
  onAddUniversity
}) => {
  const [internalUniversities, setInternalUniversities] = useState<University[]>([]);
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<Role>('STUDENT');
  const [selectedUniv, setSelectedUniv] = useState<string>('Chandigarh University');
  const [univSearch, setUnivSearch] = useState<string>('');
  const [customUnivName, setCustomUnivName] = useState<string>('');
  const [showAddUniv, setShowAddUniv] = useState<boolean>(false);

  useEffect(() => {
    if (propUniversities && propUniversities.length > 0) {
      setInternalUniversities(propUniversities);
    } else {
      api.getUniversities().then(u => setInternalUniversities(u)).catch(() => {});
    }
  }, [propUniversities, isOpen]);

  const universities = propUniversities || internalUniversities;

  // Student Step 4
  const [studentName, setStudentName] = useState<string>('Aryan Nair');
  const [studentRollNo, setStudentRollNo] = useState<string>('22CS0142');
  const [classCodeInput, setClassCodeInput] = useState<string>('CU-CSE2-A-7K4P');
  const [joinStatusMsg, setJoinStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // CR Step 4
  const [crClassName, setCrClassName] = useState<string>('B.Tech CSE 2nd Year - Section A');
  const [crProgram, setCrProgram] = useState<string>('B.Tech Computer Science & Engineering');
  const [crBranch, setCrBranch] = useState<string>('Computer Science & Engineering');
  const [crSemester, setCrSemester] = useState<string>('Semester 4 (2nd Year)');
  const [crSection, setCrSection] = useState<string>('Section A');
  const [crFaculty, setCrFaculty] = useState<string>('Dr. Rajiv Kumar');

  // Teacher Step 4
  const [teacherDept, setTeacherDept] = useState<string>('Computer Science & Engineering');
  const [teacherSubjects, setTeacherSubjects] = useState<string>('DBMS, Operating Systems, DAA');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const filteredUniversities = universities.filter(u =>
    u.name.toLowerCase().includes(univSearch.toLowerCase()) ||
    (u.country && u.country.toLowerCase().includes(univSearch.toLowerCase()))
  );

  const handleCreateCustomUniv = async () => {
    if (!customUnivName.trim()) return;
    try {
      const created = await api.createUniversity({ name: customUnivName.trim() });
      if (onAddUniversity) onAddUniversity(created);
      setInternalUniversities(prev => [...prev, created]);
      setSelectedUniv(created.name);
      setShowAddUniv(false);
      setCustomUnivName('');
    } catch (e: any) {
      alert(e.message || 'Failed to add university');
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setJoinStatusMsg(null);
    try {
      if (role === 'CR') {
        // Create new class as CR
        const createdCohort = await api.createClass({
          name: crClassName,
          universityName: selectedUniv,
          program: crProgram,
          branch: crBranch,
          semester: crSemester,
          section: crSection,
          facultyInCharge: crFaculty
        });

        await api.setRole('CR');
        const updated = await api.updateProfile({
          name: studentName,
          university: selectedUniv,
          program: crProgram,
          branch: crBranch,
          semester: crSemester,
          section: crSection,
          rollNo: studentRollNo,
          isOnboarded: true
        });

        onComplete(updated.profile);
      } else if (role === 'TEACHER') {
        await api.setRole('TEACHER');
        const updated = await api.updateProfile({
          name: studentName,
          university: selectedUniv,
          department: teacherDept,
          isOnboarded: true
        });
        onComplete(updated.profile);
      } else {
        // Student joins with code or requests join
        await api.setRole('STUDENT');
        try {
          await api.sendJoinRequest(classCodeInput);
          setJoinStatusMsg({
            type: 'success',
            text: 'Join request sent to Class Representative! You can now explore the portal while awaiting verification.'
          });
        } catch (err: any) {
          // If already requested or enrolled, proceed safely
          console.warn(err);
        }

        const updated = await api.updateProfile({
          name: studentName,
          university: selectedUniv,
          rollNo: studentRollNo,
          isOnboarded: true
        });
        onComplete(updated.profile);
      }
    } catch (err: any) {
      setJoinStatusMsg({ type: 'error', text: err.message || 'An error occurred during onboarding.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Top Progress Header */}
        <div className="p-6 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              C
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Classora
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Step {step} of 4
                </span>
              </h2>
              <p className="text-xs text-slate-400">Never Miss What Matters.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-indigo-500' : s < step ? 'w-3 bg-indigo-700' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 mx-auto shadow-inner">
                <Sparkles className="w-10 h-10" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-white">Welcome to Classora</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  The universal academic deadline management platform for students, class representatives, and faculty across colleges worldwide.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                  <KeyRound className="w-5 h-5 text-indigo-400 mb-2" />
                  <h4 className="text-xs font-semibold text-white">CR-Governed</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Authorized class representatives verify and invite real classmates.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                  <h4 className="text-xs font-semibold text-white">Faculty Verified</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Rubrics and assignment specifications verified by course professors.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
                  <Award className="w-5 h-5 text-amber-400 mb-2" />
                  <h4 className="text-xs font-semibold text-white">Precision Deadlines</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Never lose marks with real-time fire zone countdowns and reminders.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Role Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">Choose Your Academic Role</h3>
                <p className="text-xs text-slate-400">Select how you participate in your university classes.</p>
              </div>

              <div className="grid grid-cols-1 gap-3.5 pt-2">
                
                {/* Student */}
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    role === 'STUDENT'
                      ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-slate-800/30 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${role === 'STUDENT' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">Student</span>
                      {role === 'STUDENT' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Join your class with a secure code, track assignments, fire-zone deadlines, announcements, and notes.
                    </p>
                  </div>
                </button>

                {/* Class Representative (CR) */}
                <button
                  type="button"
                  onClick={() => setRole('CR')}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    role === 'CR'
                      ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-slate-800/30 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${role === 'CR' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">Class Representative (CR)</span>
                      {role === 'CR' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Class Administrator: Create classes, approve classmates, publish assignments, set deadlines, and broadcast notices.
                    </p>
                  </div>
                </button>

                {/* Teacher / Faculty */}
                <button
                  type="button"
                  onClick={() => setRole('TEACHER')}
                  className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    role === 'TEACHER'
                      ? 'bg-indigo-600/15 border-indigo-500 text-white ring-1 ring-indigo-500'
                      : 'bg-slate-800/30 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${role === 'TEACHER' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">Teacher / Faculty</span>
                      {role === 'TEACHER' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Publish official course syllabi, verify CR task submissions, share resources, and post faculty notices.
                    </p>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* STEP 3: University Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">Select Your University / Institution</h3>
                <p className="text-xs text-slate-400">Classora supports any university, college, or school worldwide.</p>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search university or campus..."
                  value={univSearch}
                  onChange={e => setUnivSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* List */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {filteredUniversities.map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelectedUniv(u.name)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      selectedUniv === u.name
                        ? 'bg-indigo-600/15 border-indigo-500 text-white'
                        : 'bg-slate-800/30 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className={`w-4 h-4 ${selectedUniv === u.name ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="text-xs font-semibold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.campus || u.country}</div>
                      </div>
                    </div>
                    {selectedUniv === u.name && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </button>
                ))}
              </div>

              {/* Custom University adder */}
              {!showAddUniv ? (
                <button
                  type="button"
                  onClick={() => setShowAddUniv(true)}
                  className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors pt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Can't find your university? Add your institution
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">Add New Institution</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. National Institute of Technology Trichy"
                      value={customUnivName}
                      onChange={e => setCustomUnivName(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleCreateCustomUniv}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Role-Specific Details */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-bold text-white">
                  {role === 'CR' ? 'Create & Setup Your Class' : role === 'TEACHER' ? 'Faculty Profile Setup' : 'Join Your Class'}
                </h3>
                <p className="text-xs text-slate-400">
                  {role === 'CR'
                    ? 'Generate your secure class code to invite classmates.'
                    : role === 'TEACHER'
                    ? 'Configure your department and associated courses.'
                    : 'Enter the join code shared by your Class Representative.'}
                </p>
              </div>

              {joinStatusMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium border ${
                    joinStatusMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {joinStatusMsg.text}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Enter your name"
                  />
                </div>

                {role === 'STUDENT' && (
                  <>
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">University Roll / Student ID Number</label>
                      <input
                        type="text"
                        value={studentRollNo}
                        onChange={e => setStudentRollNo(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                        placeholder="e.g. 22CS0142"
                      />
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold">
                        <KeyRound className="w-4 h-4" /> Class Join Code (from your CR)
                      </div>
                      <input
                        type="text"
                        value={classCodeInput}
                        onChange={e => setClassCodeInput(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-indigo-500/50 rounded-xl text-sm font-mono tracking-wider text-indigo-200 placeholder-indigo-400/40 focus:outline-none focus:border-indigo-400"
                        placeholder="e.g. CU-CSE2-A-7K4P"
                      />
                      <p className="text-[11px] text-slate-400">
                        Entering this code sends a join request to your CR. Once approved, all class deadlines sync automatically.
                      </p>
                    </div>
                  </>
                )}

                {role === 'CR' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">Class Display Name</label>
                      <input
                        type="text"
                        value={crClassName}
                        onChange={e => setCrClassName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">Program / Degree</label>
                      <input
                        type="text"
                        value={crProgram}
                        onChange={e => setCrProgram(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">Branch / Major</label>
                      <input
                        type="text"
                        value={crBranch}
                        onChange={e => setCrBranch(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">Semester & Year</label>
                      <input
                        type="text"
                        value={crSemester}
                        onChange={e => setCrSemester(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">Section</label>
                      <input
                        type="text"
                        value={crSection}
                        onChange={e => setCrSection(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {role === 'TEACHER' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">Academic Department</label>
                      <input
                        type="text"
                        value={teacherDept}
                        onChange={e => setTeacherDept(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-400 block mb-1">Subjects & Course Codes</label>
                      <input
                        type="text"
                        value={teacherSubjects}
                        onChange={e => setTeacherSubjects(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-1.5"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Configuring Academic Space...' : 'Enter Classora Portal'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
