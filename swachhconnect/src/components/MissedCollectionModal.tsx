import React, { useState } from 'react';
import { 
  X, 
  AlertCircle, 
  Calendar, 
  Camera, 
  Upload, 
  Send, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_EVIDENCE_IMAGES } from '../data/initialData';

interface MissedCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MissedCollectionModal: React.FC<MissedCollectionModalProps> = ({ isOpen, onClose }) => {
  const { fileComplaint, activeCustomerId, schedules } = useApp();
  const [scheduleId, setScheduleId] = useState(schedules[0]?.id || 'sched-1');
  const [missedDate, setMissedDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('Sanitation vehicle passed without collecting waste');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fileComplaint(activeCustomerId, scheduleId, missedDate, reason, description, photoUrl);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Report Missed Collection</h3>
              <p className="text-xs text-teal-100">Municipal Grievance Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Grievance Registered!</h4>
            <p className="text-xs text-slate-500">
              Your missed collection report has been submitted to Ward 12 Zonal Officer. You will receive SMS updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Missed Pickup Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={missedDate}
                  onChange={(e) => setMissedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reason for Complaint *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Sanitation vehicle passed without collecting waste</option>
                <option>Collection vehicle did not arrive in scheduled window</option>
                <option>Doorbell was not rung / missed household gate</option>
                <option>Only wet waste taken, dry recyclables left behind</option>
                <option>Other grievance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description / Landmark
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Segregated green and blue bins were kept outside at 7:30 AM."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Upload Photo of Bins (Optional)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoUrl(SAMPLE_EVIDENCE_IMAGES.unsegregatedBins)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                    photoUrl ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{photoUrl ? 'Photo Attached ✓' : 'Attach Photo'}</span>
                </button>
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(undefined)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>Municipal tracking: Submitted → Under Review → Resolved with relief pickup dispatch.</p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Grievance</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
