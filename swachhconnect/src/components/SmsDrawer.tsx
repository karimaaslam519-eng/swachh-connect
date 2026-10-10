import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Settings, 
  Radio, 
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmsDrawer: React.FC<SmsDrawerProps> = ({ isOpen, onClose }) => {
  const { smsLogs, config, updateConfig } = useApp();
  const [activeTab, setActiveTab] = useState<'logs' | 'settings'>('logs');
  const [provider, setProvider] = useState(config.smsProvider);
  const [apiKey, setApiKey] = useState(config.smsApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      smsProvider: provider,
      smsApiKey: apiKey
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">SMS Gateway Transmission Hub</h3>
              <p className="text-[11px] text-slate-400">Live Delivery Ledger ({smsLogs.length} messages)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-5 pt-2 bg-slate-50 shrink-0">
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>SMS Outbox Logs</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Gateway Config</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'logs' ? (
            <>
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-[11px] text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Gateway Provider: <strong>{config.smsProvider}</strong></span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 font-bold rounded text-[10px]">
                  ACTIVE
                </span>
              </div>

              <div className="space-y-3">
                {smsLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        +91 {log.recipientMobile} ({log.recipientName})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          log.status === 'Sent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status === 'Sent' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        {log.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl font-sans leading-relaxed border border-slate-100">
                      {log.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">
                        {log.type}
                      </span>
                      <span>{log.sentAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                Configure your national SMS API provider credentials for Warning 1, Warning 2, ₹100 Fine, and pickup delivery notices.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  SMS Gateway Service Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Fast2SMS">Fast2SMS (India Bulk DLT Route)</option>
                  <option value="MSG91">MSG91 (Govt Enterprise Route)</option>
                  <option value="Twilio">Twilio International SMS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Provider Authorization API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {savedSuccess && (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Gateway configuration updated successfully!</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Save Gateway Settings
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
