import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Calendar, CheckCircle, PlayCircle, AlertCircle } from 'lucide-react';
import { TimetableClass } from '../types/index.js';
import { api } from '../services/api.js';

export const TimetableWidget: React.FC = () => {
  const [schedule, setSchedule] = useState<TimetableClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await api.getTimetable();
        setSchedule(data);
      } catch (err) {
        console.error('Failed to load timetable:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return <div className="h-28 bg-slate-900/60 rounded-2xl animate-pulse" />;
  }

  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Today's Academic Schedule
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
          Monday • 4 Lectures
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {schedule.map((item) => {
          const isInProgress = item.status === 'In Progress';
          const isCompleted = item.status === 'Completed';

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                isInProgress
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                  : isCompleted
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px] font-bold">
                    {item.subjectCode}
                  </span>
                  <span className={`px-2 py-0.2 rounded font-mono text-[9px] font-bold ${
                    isInProgress ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' :
                    isCompleted ? 'bg-slate-800 text-slate-400' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {isInProgress ? '● LIVE' : item.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white line-clamp-1">
                  {item.subjectName}
                </h4>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-1.5">
                  <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{item.time}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{item.room}</span>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1 text-[10px] text-slate-400">
                <User className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate font-medium">{item.teacher}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
