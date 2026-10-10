import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderBar } from './components/HeaderBar';
import { CustomerDashboard } from './components/CustomerDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SmsDrawer } from './components/SmsDrawer';
import { DatabaseSpecModal } from './components/DatabaseSpecModal';
import { LoginModal } from './components/LoginModal';
import { Smartphone, Shield, Wifi, Battery, Signal } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { role } = useApp();
  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  const renderDashboard = () => {
    switch (role) {
      case 'customer':
        return <CustomerDashboard />;
      case 'worker':
        return <WorkerDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Header with Quick Role Switching & Tools */}
      <HeaderBar
        onOpenSms={() => setIsSmsOpen(true)}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex justify-center items-start">
        {isMobileFrame ? (
          <div className="py-6 px-4 w-full flex justify-center">
            {/* Flutter Smartphone Mockup Frame */}
            <div className="w-full max-w-[420px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative overflow-hidden ring-1 ring-slate-800">
              
              {/* Speaker notch & camera */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-40 flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <div className="w-10 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Status Bar */}
              <div className="bg-slate-900 text-white text-[11px] px-6 pt-3 pb-2 flex items-center justify-between z-30 select-none">
                <span className="font-semibold text-xs">09:41</span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Mobile Screen viewport */}
              <div className="bg-slate-50 rounded-[36px] overflow-hidden min-h-[750px] max-h-[82vh] overflow-y-auto relative shadow-inner">
                {renderDashboard()}
              </div>

              {/* Bottom Gesture Bar */}
              <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-2" />
            </div>
          </div>
        ) : (
          <div className="w-full">
            {renderDashboard()}
          </div>
        )}
      </div>

      {/* Global Modals & Drawers */}
      <SmsDrawer isOpen={isSmsOpen} onClose={() => setIsSmsOpen(false)} />
      <DatabaseSpecModal isOpen={isDatabaseModalOpen} onClose={() => setIsDatabaseModalOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
