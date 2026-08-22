import React from 'react';
import { 
  Home, 
  Layers, 
  Plus, 
  BrainCircuit, 
  User, 
  Calendar as CalendarIcon, 
  BookOpen, 
  TrendingUp, 
  Trophy 
} from 'lucide-react';
import { MainNavigationTab, Role } from '../types/index.js';

interface BottomNavProps {
  activeTab: MainNavigationTab;
  onSelectTab: (tab: MainNavigationTab) => void;
  onOpenQuickAction: () => void;
  userRole?: Role;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickAction,
  userRole
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'home' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'home' ? 'bg-indigo-950/80' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </button>

        {/* 2. Classes */}
        <button
          onClick={() => onSelectTab('classes')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'classes' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'classes' ? 'bg-indigo-950/80' : ''}`}>
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">Classes</span>
        </button>

        {/* 3. Central Quick Action (+) Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={onOpenQuickAction}
            aria-label="Quick Action"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/40 flex items-center justify-center transition-transform active:scale-95 border-2 border-slate-950"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. AI Hub */}
        <button
          onClick={() => onSelectTab('ai')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'ai' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'ai' ? 'bg-purple-950/80' : ''}`}>
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">AI Hub</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'profile' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-indigo-950/80' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium mt-0.5">Profile</span>
        </button>

      </div>
    </div>
  );
};
