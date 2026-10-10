import React from 'react';
import { 
  Recycle, 
  Languages, 
  MessageSquare, 
  User, 
  ShieldCheck, 
  Truck, 
  Building2, 
  LogOut, 
  Smartphone, 
  Monitor,
  RefreshCw,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface HeaderBarProps {
  onOpenSms: () => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  onOpenDatabaseModal: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onOpenSms,
  isMobileFrame,
  setIsMobileFrame,
  onOpenDatabaseModal,
}) => {
  const { 
    role, 
    quickSwitchUser, 
    language, 
    setLanguage, 
    t, 
    currentUser, 
    smsLogs, 
    resetDemoData 
  } = useApp();

  const unreadSmsCount = smsLogs.length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top Banner & Quick Role Switching Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-md">
            <Recycle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-white">SwachhConnect</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-bold">
                MUNICIPAL v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Smart Waste Segregation & Sanitation Management
            </p>
          </div>
        </div>

        {/* Role Quick Selector (Mandated by Section 1: Customer / Worker / Admin) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => quickSwitchUser('customer', 'cust-1')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
              role === 'customer'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => quickSwitchUser('worker')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
              role === 'worker'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Worker</span>
          </button>

          <button
            onClick={() => quickSwitchUser('admin')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
              role === 'admin'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Right Tools (Language EN/TA, SMS Drawer, Frame Mode, DB Spec) */}
        <div className="flex items-center gap-2">
          {/* Language Switcher (Mandated by Section 1: English / Tamil) */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-[11px] font-bold rounded ${
                language === 'en' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ta')}
              className={`px-2 py-1 text-[11px] font-bold rounded font-tamil ${
                language === 'ta' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* SMS Hub button */}
          <button
            onClick={onOpenSms}
            className="relative px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 text-xs font-semibold transition-colors"
            title="View Live SMS Outbox logs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">SMS Hub</span>
            <span className="w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center">
              {unreadSmsCount}
            </span>
          </button>

          {/* MySQL & Spring Boot Spec Button */}
          <button
            onClick={onOpenDatabaseModal}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 text-xs font-semibold transition-colors"
            title="Inspect MySQL Schema & Spring Boot REST API Architecture"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">MySQL / API</span>
          </button>

          {/* Device Frame Switcher */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors hidden sm:flex items-center gap-1"
            title={isMobileFrame ? 'Switch to Full Screen Layout' : 'Switch to Mobile App Preview Frame'}
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            <span className="text-[11px] font-medium hidden md:inline">
              {isMobileFrame ? 'Full View' : 'Mobile Frame'}
            </span>
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={resetDemoData}
            title="Reset to Initial Demo State"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
