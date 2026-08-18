import React from 'react';
import { X, Bell, CheckCheck, AlertTriangle, ShieldCheck, FileText, Megaphone } from 'lucide-react';
import { AppNotification } from '../types/index.js';

interface NotificationsDrawerProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectReference?: (id: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
  onSelectReference
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-500" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs flex justify-end z-50 animate-fade-in">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-gray-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-gray-900 font-mono">CLASS ACTIVITY & ALERTS</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Read all banner */}
        <div className="px-4 py-2 bg-gray-50/70 border-b border-gray-100 flex justify-between items-center text-[11px]">
          <span className="text-gray-500 font-mono">
            {notifications.filter(n => !n.isRead).length} Unread
          </span>
          <button
            onClick={onMarkAllRead}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs font-mono">
              No notifications yet.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.referenceId && onSelectReference) {
                    onSelectReference(n.referenceId);
                  }
                }}
                className={`p-3.5 transition-colors cursor-pointer ${
                  n.isRead ? 'bg-white hover:bg-gray-50/60' : 'bg-indigo-50/30 hover:bg-indigo-50/60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-gray-50 rounded-md border border-gray-200 mt-0.5 flex-shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-mono ml-2 flex-shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
