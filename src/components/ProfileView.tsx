import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Building, 
  BookOpen, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Edit3, 
  KeyRound, 
  Bell, 
  FileText, 
  Trash2, 
  Check, 
  Sparkles,
  Layers,
  ChevronRight,
  X,
  Share2
} from 'lucide-react';
import { UserProfile, ClassCohort, Role } from '../types/index.js';
import { api } from '../services/api.js';

interface ProfileViewProps {
  profile: UserProfile | null;
  activeCohort: ClassCohort | null;
  enrolledClasses: ClassCohort[];
  onUpdateProfile: (updated: UserProfile) => void;
  onSwitchClass: (classId: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenGoogleSync: () => void;
  onRoleChange: (role: Role) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  activeCohort,
  enrolledClasses,
  onUpdateProfile,
  onSwitchClass,
  onOpenPrivacy,
  onOpenTerms,
  onOpenGoogleSync,
  onRoleChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [rollNo, setRollNo] = useState(profile?.rollNo || '');
  const [university, setUniversity] = useState(profile?.university || '');
  const [program, setProgram] = useState(profile?.program || '');
  const [semester, setSemester] = useState(profile?.semester || '');
  const [section, setSection] = useState(profile?.section || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.updateProfile({
        name: name.trim(),
        rollNo: rollNo.trim(),
        university: university.trim(),
        program: program.trim(),
        semester: semester.trim(),
        section: section.trim()
      });
      onUpdateProfile(res.profile);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out of your university session?')) {
      window.location.reload();
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Warning: Deleting your account will remove your enrolled cohorts, study history, and private submissions. Proceed?')) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
          
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-600/40 shrink-0 border-2 border-slate-800">
            {profile?.name?.[0] || 'A'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {profile?.name || 'Aryan Nair'}
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {profile?.email || 'student@university.edu'}
                </p>
              </div>

              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <span className="px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider">
                  Role: {profile?.role || 'STUDENT'}
                </span>
                <button
                  onClick={() => {
                    setName(profile?.name || '');
                    setRollNo(profile?.rollNo || '');
                    setUniversity(profile?.university || '');
                    setProgram(profile?.program || '');
                    setSemester(profile?.semester || '');
                    setSection(profile?.section || '');
                    setIsEditing(true);
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition-colors"
                  title="Edit Profile"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Academic details pill row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4 text-xs text-slate-300 font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>{profile?.university || 'Chandigarh University'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>{profile?.program || 'B.Tech CSE'}</span>
              </span>
              {profile?.rollNo && (
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Roll: {profile.rollNo}</span>
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Role Mode Quick Switcher */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
          Simulate Role Workspace
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['STUDENT', 'CR', 'TEACHER'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`p-3 rounded-xl border text-center transition-all ${
                profile?.role === r || (r === 'TEACHER' && profile?.role === 'FACULTY')
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-mono">{r === 'TEACHER' ? 'FACULTY' : r}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {r === 'STUDENT' ? 'Student Portal' : r === 'CR' ? 'Class Rep Lead' : 'Professor Review'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Enrolled Cohorts Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Enrolled Class Cohorts
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {enrolledClasses.length} Cohorts
          </span>
        </div>

        <div className="space-y-2">
          {enrolledClasses.map((cls) => {
            const isActive = cls.id === activeCohort?.id;
            return (
              <div
                key={cls.id}
                onClick={() => onSwitchClass(cls.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500/60'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {cls.name}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded bg-indigo-500 text-white font-mono text-[9px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Code: {cls.code} • {cls.universityName}
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings & Support Links */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 shadow-lg overflow-hidden">
        
        <button
          onClick={onOpenGoogleSync}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Google Workspace Sync</div>
              <div className="text-[11px] text-slate-400">Connect Google Calendar, Tasks & Classroom</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={onOpenPrivacy}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Privacy Policy</div>
              <div className="text-[11px] text-slate-400">FERPA, GDPR compliance and student data isolation</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={onOpenTerms}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Terms of Service</div>
              <div className="text-[11px] text-slate-400">Academic integrity, CR governance and acceptable use</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={handleSignOut}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors text-amber-400"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">Sign Out</div>
              <div className="text-[11px] text-slate-400">End current authenticated university session</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={handleDeleteAccount}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-rose-950/20 transition-colors text-rose-400"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-rose-400">Delete Account & Data</div>
              <div className="text-[11px] text-slate-500">Permanently erase profile and submission records</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Edit Academic Profile</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Student Roll No</label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Section</label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">University / Institute</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Program / Degree</label>
                  <input
                    type="text"
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Semester</label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
