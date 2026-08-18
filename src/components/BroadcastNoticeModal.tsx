import React, { useState } from 'react';
import { X, Send, AlertCircle, Megaphone } from 'lucide-react';
import { Role } from '../types/index.js';

interface BroadcastNoticeModalProps {
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; priority: 'Urgent' | 'Normal' | 'Info' }) => Promise<void>;
  userRole: Role;
}

export const BroadcastNoticeModal: React.FC<BroadcastNoticeModalProps> = ({
  onClose,
  onSubmit,
  userRole
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'Urgent' | 'Normal' | 'Info'>('Normal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Both notice title and message content are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        priority
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to broadcast announcement');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Topbar */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-sm font-bold text-gray-900 font-mono">BROADCAST CLASS NOTICE</h2>
              <p className="text-[11px] text-gray-500">
                Official announcement published as {userRole === 'CR' ? 'Class Representative (CR)' : userRole}.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
              Notice Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 🚨 Mid-Term Practical Evaluation Schedule Announced"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
              Notice Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Urgent', 'Normal', 'Info'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 text-xs font-semibold rounded-md border font-mono transition-colors ${
                    priority === p
                      ? p === 'Urgent'
                        ? 'bg-red-50 border-red-300 text-red-700'
                        : p === 'Normal'
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p === 'Urgent' && '🚨 '}
                  {p === 'Normal' && '📢 '}
                  {p === 'Info' && 'ℹ️ '}
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase font-mono mb-1">
              Announcement Details *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Include all relevant details, venue room numbers, timings, and deadlines..."
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="pt-2 border-t border-gray-200 flex items-center justify-end space-x-2">
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
                <span>Broadcasting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Notice</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
