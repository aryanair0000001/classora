import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Assignment } from '../types/index.js';

interface CalendarViewProps {
  assignments: Assignment[];
  onSelectAssignment: (a: Assignment) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  assignments,
  onSelectAssignment
}) => {
  // Generate 14 days starting from today
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const getAssignmentsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const day = date.getDate();

    return assignments.filter(a => {
      const d = new Date(a.dueDateISO);
      return d.getFullYear() === y && d.getMonth() === m && d.getDate() === day;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-gray-900 font-mono">
            14-DAY ACADEMIC SPRINT & DEADLINE AGENDA
          </h3>
        </div>
        <div className="text-[11px] text-gray-500 font-mono">
          {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-gray-100 min-h-[380px]">
        {days.slice(0, 7).map((d, idx) => {
          const isCurrentDay = idx === 0;
          const dayAssignments = getAssignmentsForDate(d);

          return (
            <div
              key={idx}
              className={`p-3 flex flex-col ${
                isCurrentDay ? 'bg-indigo-50/20' : 'bg-white'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
                <span className="text-[10px] font-bold font-mono uppercase text-gray-400">
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    isCurrentDay
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 bg-gray-100'
                  }`}
                >
                  {d.getDate()}
                </span>
              </div>

              {/* Day Items */}
              <div className="flex-1 space-y-1.5 overflow-y-auto">
                {dayAssignments.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-[10px] text-gray-300 font-mono">No Dues</span>
                  </div>
                ) : (
                  dayAssignments.map(a => (
                    <div
                      key={a.id}
                      onClick={() => onSelectAssignment(a)}
                      className={`p-2 rounded border text-left cursor-pointer transition-all hover:scale-[1.02] ${
                        a.isCompleted
                          ? 'bg-gray-50 border-gray-200 opacity-60'
                          : a.priority === 'Critical'
                          ? 'bg-red-50/80 border-red-200'
                          : a.priority === 'High'
                          ? 'bg-orange-50/80 border-orange-200'
                          : 'bg-indigo-50/80 border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono font-bold mb-1">
                        <span className="text-indigo-700 truncate">{a.subjectCode}</span>
                        {a.isCompleted && <CheckCircle2 className="w-3 h-3 text-green-600" />}
                      </div>
                      <p className="text-[11px] font-semibold text-gray-900 leading-tight line-clamp-2">
                        {a.title}
                      </p>
                      <div className="mt-1 text-[9px] text-gray-500 font-mono flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>
                          {new Date(a.dueDateISO).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
