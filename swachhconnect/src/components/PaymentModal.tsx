import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Receipt,
  ArrowRight,
  Download,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FineRecord } from '../types';

interface PaymentModalProps {
  fine: FineRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ fine, isOpen, onClose }) => {
  const { payFine, t } = useApp();
  const [method, setMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [upiApp, setUpiApp] = useState<'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM'>('Google Pay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [receiptDetails, setReceiptDetails] = useState<{
    txnId: string;
    receiptNum: string;
    paidAt: string;
  } | null>(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setStatus('processing');

    // Simulate real gateway processing latency
    setTimeout(async () => {
      try {
        const success = await payFine(fine.id, method, method === 'UPI' ? upiApp : undefined);
        if (success) {
          setReceiptDetails({
            txnId: `TXN-SWC-${Date.now().toString().slice(-8)}`,
            receiptNum: `REC-TN-CHN-${Date.now().toString().slice(-6)}`,
            paidAt: new Date().toLocaleString()
          });
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
              <Lock className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Municipal Payment Gateway</h3>
              <p className="text-xs text-emerald-100 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted • Zero Sensitive Storage
              </p>
            </div>
          </div>
          {status !== 'processing' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6">
          {status === 'idle' && (
            <div className="space-y-5">
              {/* Fine Notice Summary Card */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Imposed Fine Penalty
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 mt-0.5">₹{fine.amount}.00</h4>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
                    Fine Pending
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Reason: 3rd unsegregated waste violation verified by Municipal Authority under Solid Waste Management Bylaws.
                </p>
              </div>

              {/* Payment Methods Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('UPI')}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      method === 'UPI'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-800 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-xs">UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('Card')}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      method === 'Card'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-800 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Debit/Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('Net Banking')}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      method === 'Net Banking'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-800 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs">NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Form details per payment method */}
              {method === 'UPI' && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    {(['Google Pay', 'PhonePe', 'Paytm', 'BHIM'] as const).map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                          upiApp === app
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{app}</span>
                        {upiApp === app && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Or enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. resident@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {method === 'Card' && (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Card Number (Simulated / RuPay / Visa)
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4532 •••• •••• 8921"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === 'Net Banking' && (
                <div className="pt-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option>State Bank of India (SBI)</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Indian Bank</option>
                    <option>Canara Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Security Disclosure (Mandated by Section 5) */}
              <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Zero Credential Retention:</strong> Card numbers, UPI PINs, and banking credentials are never transmitted or stored on SwachhConnect servers.
                </p>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePayment}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-base transition-all transform active:scale-98"
              >
                <span>Pay ₹{fine.amount}.00 Instantly</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {status === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                <Lock className="w-6 h-6 text-emerald-600 absolute inset-0 m-auto" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Contacting Municipal Gateway...</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Authorizing transaction of ₹{fine.amount}.00. Please do not refresh or press back.
                </p>
              </div>
            </div>
          )}

          {status === 'success' && receiptDetails && (
            <div className="py-4 space-y-4 text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Payment Confirmed
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-0.5">₹{fine.amount}.00 Paid</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Fine settled successfully. Sanitation services continue uninterrupted.
                </p>
              </div>

              {/* Receipt Summary */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Receipt Number:</span>
                  <span className="font-bold text-slate-800">{receiptDetails.receiptNum}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Txn Ref ID:</span>
                  <span className="font-bold text-slate-800">{receiptDetails.txnId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Paid By:</span>
                  <span className="text-slate-800 font-sans font-medium">{fine.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Worker Incentive:</span>
                  <span className="text-emerald-700 font-bold font-sans">₹40.00 Credited to Sanitation Staff</span>
                </div>
                <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200">
                  <span>Status:</span>
                  <span className="text-emerald-600 font-bold uppercase">Fine Paid & Cleared</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm transition-all"
              >
                Close & Return to Dashboard
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">Transaction Could Not Complete</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Unable to reach the payment gateway. Please check your connection or choose another payment method.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
