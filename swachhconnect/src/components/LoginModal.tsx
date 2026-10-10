import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  User, 
  Truck, 
  Building2, 
  CheckCircle2, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { role, setRole, requestOtp, verifyOtp, t } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(role);
  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState<string | null>(null);
  const [simulatedOtp, setSimulatedOtp] = useState<string>('123456');

  if (!isOpen) return null;

  const handleRoleChange = (r: UserRole) => {
    setSelectedRole(r);
    if (r === 'customer') setMobile('9876543210');
    else if (r === 'worker') setMobile('9841098765');
    else setMobile('9884011223');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError(null);
    requestOtp(mobile);
    setSimulatedOtp('123456');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyOtp(mobile, otp || '123456', selectedRole);
    if (success) {
      onClose();
    } else {
      setError('Invalid OTP code. For demo, use 123456');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{t.loginTitle}</h3>
              <p className="text-xs text-slate-500">Fast & Secure Mobile Authentication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'customer', label: 'Customer', icon: User },
              { id: 'worker', label: 'Worker', icon: Truck },
              { id: 'admin', label: 'Admin', icon: Building2 },
            ].map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(r.id as UserRole)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t.enterMobile}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-xs">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>{t.sendOtp}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.enterOtp}
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  Change number
                </button>
              </div>

              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="mt-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800 flex items-center justify-between">
                <span>Demo OTP Sent via SMS Gateway:</span>
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="font-mono font-bold underline bg-emerald-200/60 px-2 py-0.5 rounded"
                >
                  Auto-fill: 123456
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.verifyOtp}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
