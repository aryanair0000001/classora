import React, { useState } from 'react';
import { X, Send, AlertTriangle, Info, Bell, CheckCircle } from 'lucide-react';
import { Role } from '../types/index.js';

interface BroadcastNoticeModalProps {
  onClose: () => void;
  onSubmit: (title: string, message: string, urgency: 'INFO' | 'URGENT' | 'CRITICAL') => Promise<void>;
  userRole: Role;
}

export const BroadcastNoticeModal: React.FC<BroadcastNoticeModalProps> = ({
  onClose,
  onSubmit,
  userRole
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState<'INFO' | 'URGENT' | 'CRITICAL'>('URGENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError('Both title and message are required for class broadcast.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(title.trim(), message.trim(), urgency);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to broadcast announcement');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>Broadcast Official Class Notice</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly notifies all classmates via bell alerts and in-app banner.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-1.5">
              Notice Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CST-241 Lab Assignment 3 Deadline Extended by 24h"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'INFO', label: 'Info Notice', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
                { id: 'URGENT', label: 'Urgent Alert', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
                { id: 'CRITICAL', label: 'Emergency', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setUrgency(item.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                    urgency === item.id ? item.color : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase font-mono mb-1.5">
              Message Body *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Detailed announcement instructions from Professor / CR..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl transition-colors border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-600/30 transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Broadcasting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
