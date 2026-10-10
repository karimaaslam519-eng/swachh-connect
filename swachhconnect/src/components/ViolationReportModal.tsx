import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  Info,
  FileImage,
  CloudUpload,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Customer, ViolationReason } from '../types';
import { SAMPLE_EVIDENCE_IMAGES } from '../data/initialData';

interface ViolationReportModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const REASONS: ViolationReason[] = [
  'Wet and dry waste mixed',
  'Plastic mixed with organic waste',
  'Improper segregation',
  'Hazardous/Medical waste mixed',
  'Other'
];

export const ViolationReportModal: React.FC<ViolationReportModalProps> = ({
  customer,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { reportImproperSegregation, activeWorkerId, t, config } = useApp();
  const [reason, setReason] = useState<ViolationReason>('Wet and dry waste mixed');
  const [remarks, setRemarks] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_EVIDENCE_IMAGES.mixedBags);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(20);
      const reader = new FileReader();
      reader.onload = (event) => {
        setTimeout(() => {
          setUploadProgress(100);
          setIsUploading(false);
          if (event.target?.result) {
            setPhotoUrl(event.target.result as string);
          }
        }, 600);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    setPhotoUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportImproperSegregation(customer.id, activeWorkerId, reason, remarks, photoUrl);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Report Improper Waste Segregation</h3>
              <p className="text-xs text-amber-100">Household: {customer.name} ({customer.address.houseNumber})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Important Safeguard Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Municipal Protocol Notice:</strong> Worker reports do <u>not</u> directly impose fines. This report will be transmitted to the Municipal Admin Zonal Inspector with photo proof for verification.
            </p>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Segregation Violation Reason *
            </label>
            <div className="space-y-2">
              {REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    reason === r
                      ? 'border-amber-600 bg-amber-50/70 font-semibold text-amber-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span>{r}</span>
                  <input
                    type="radio"
                    name="violationReason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-amber-600 w-4 h-4"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Photo Proof Upload & Cloud Storage Simulation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Photo Proof (Mandatory Evidence) *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Cloud Bucket: {config.cloudStorageBucket.split('/').pop()}</span>
            </div>

            {/* Photo Preview Card */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 p-2 text-center">
              {photoUrl ? (
                <div className="relative group rounded-xl overflow-hidden max-h-44 bg-slate-900">
                  <img
                    src={photoUrl}
                    alt="Evidence of improper segregation"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg shadow"
                    >
                      Change Photo
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    ✓ Cloud Uploaded
                  </span>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center">
                  <Camera className="w-10 h-10 text-slate-400 mb-1" />
                  <p className="text-xs font-semibold text-slate-700">Capture or Upload Evidence</p>
                  <p className="text-[11px] text-slate-400">Clear photo showing mixed bins / unsegregated bag</p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Sample Preset Proof Photos Buttons for Quick Worker Demonstration */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-500 font-medium">Sample Evidence:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(SAMPLE_EVIDENCE_IMAGES.mixedBags)}
                    className="text-[10px] px-2 py-1 bg-white border border-slate-200 hover:border-amber-400 rounded-md text-slate-600"
                  >
                    Mixed Bags
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(SAMPLE_EVIDENCE_IMAGES.plasticOrganic)}
                    className="text-[10px] px-2 py-1 bg-white border border-slate-200 hover:border-amber-400 rounded-md text-slate-600"
                  >
                    Plastic in Wet
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] px-2.5 py-1 bg-amber-500 text-white font-bold rounded-md flex items-center gap-1 shadow-xs"
                  >
                    <Upload className="w-3 h-3" /> Upload File
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Sanitation Worker Remarks / Notes
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Milk packets and polythene mixed inside green food waste bin. Spoke to resident."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-2xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
            >
              <span>Submit to Admin for Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
