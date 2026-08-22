import React from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            ) : (
              <FileText className="w-5 h-5 text-indigo-400" />
            )}
            <h2 className="text-base font-bold text-white tracking-tight">
              {type === 'privacy' ? 'Classora Privacy Policy' : 'Classora Terms of Service'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {type === 'privacy' ? (
            <>
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
                Effective Date: August 2026 • Compliance: GDPR, FERPA & Google API Services User Data Policy
              </div>

              <section className="space-y-1.5">
                <h3 className="text-white font-bold text-sm">1. Academic Data Collection & Storage</h3>
                <p>
                  Classora collects minimal academic information necessary to provide cohort deadline tracking, class announcements, and assignment submissions. Data collected includes your university email address, display name, student roll/matriculation ID, enrolled class codes, and uploaded assignment deliverables.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-white font-bold text-sm">2. Google Workspace & OAuth Token Security</h3>
                <p>
                  When connecting Google Calendar, Google Classroom, Google Tasks, or Drive, Classora uses client-side authorization tokens with least-privilege scopes. Your tokens are stored locally in your sandboxed browser session and are never transmitted to unauthorized third parties or sold to advertisers.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-white font-bold text-sm">3. Class Cohort Isolation & Privacy</h3>
                <p>
                  Each academic cohort maintains strict boundary isolation. Only verified Class Representatives, assigned Faculty, and approved enrolled students can view class resources, rosters, and assignments. Student submissions are strictly private between the submitting student and the course faculty.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-white font-bold text-sm">4. Data Deletion & Export</h3>
                <p>
                  Users may export their academic agenda at any time in RFC 5545 standard (.ics) format and can request complete profile and submission deletion by leaving their cohorts or contacting support@classora.app.
                </p>
              </section>
            </>
          ) : (
            <>
              <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 font-mono text-xs">
                Last Updated: August 2026 • Governing Terms for Global Universities
              </div>

              <section className="space-y-1.5">
                <h3 className="text-white font-bold text-sm">1. Acceptance of Academic Terms</h3>
                <p>
                  By accessing Classora, you agree to comply with these terms, your institution's student code of conduct, and acceptable academic integrity guidelines.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-white font-bold text-sm">2. Class Representative (CR) & Faculty Governance</h3>
                <p>
                  Class Representatives and Faculty members are authorized to publish assignment dates, verify rubrics, and manage cohort membership. Impersonation of faculty or university officials is strictly prohibited and results in immediate account suspension.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-white font-bold text-sm">3. Academic Integrity & Deliverables</h3>
                <p>
                  Students are responsible for the authenticity of submitted files and adherence to course submission deadlines. Classora serves as a coordination and workflow tracker and does not alter official university grade registries without verified instructor review.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="text-white font-bold text-sm">4. Service Availability</h3>
                <p>
                  Classora provides offline caching and automatic sync upon network reconnection to ensure uninterrupted deadline tracking during campus connectivity drops.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
