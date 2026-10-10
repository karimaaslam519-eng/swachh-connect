import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Server, 
  Code, 
  Layers, 
  Check, 
  Copy, 
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { MYSQL_SCHEMA_DDL, SPRING_BOOT_ENDPOINTS } from '../data/databaseSchema';

interface DatabaseSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSpecModal: React.FC<DatabaseSpecModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mysql' | 'springboot' | 'architecture'>('mysql');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Technology Architecture & Specifications</h3>
              <p className="text-xs text-slate-400">MySQL Schema • Spring Boot REST API • Flutter Mobile Client</p>
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
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 shrink-0 gap-2">
          <button
            onClick={() => setActiveTab('mysql')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'mysql'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL Schema (DDL)</span>
          </button>

          <button
            onClick={() => setActiveTab('springboot')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'springboot'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Spring Boot REST APIs</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-cyan-600 text-cyan-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Full System Architecture</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs">
          
          {activeTab === 'mysql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-sans font-semibold">
                  Production MySQL 8.0 DDL script with foreign keys, indexes, and ENUM statuses:
                </span>
                <button
                  onClick={() => handleCopy(MYSQL_SCHEMA_DDL)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-sans font-bold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy DDL'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-cyan-300 p-4 rounded-2xl overflow-x-auto text-[11px] leading-relaxed max-h-[55vh] border border-slate-800">
                {MYSQL_SCHEMA_DDL}
              </pre>
            </div>
          )}

          {activeTab === 'springboot' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-sans font-semibold">
                  Spring Boot 3.x REST Controller API Endpoints specification:
                </span>
                <button
                  onClick={() => handleCopy(SPRING_BOOT_ENDPOINTS)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-sans font-bold flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Endpoints'}</span>
                </button>
              </div>

              <pre className="bg-slate-950 text-emerald-300 p-4 rounded-2xl overflow-x-auto text-[11px] leading-relaxed max-h-[55vh] border border-slate-800">
                {SPRING_BOOT_ENDPOINTS}
              </pre>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 font-sans text-xs text-slate-700">
              <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-cyan-900 text-sm">Technology Stack Blueprint</h4>
                <p className="text-slate-600">
                  SwachhConnect is designed according to enterprise municipal sanitation guidelines:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><strong>Frontend:</strong> Flutter Mobile Application for Android & iOS (Cross-platform Dart client with GPS & Google Maps integration)</li>
                  <li><strong>Backend:</strong> Spring Boot 3.x Microservice / REST API (Java 17/21, Spring Security with JWT, Spring Data JPA)</li>
                  <li><strong>Database:</strong> MySQL 8.0 relational database with ACID compliance and spatial indexing for GPS coordinates</li>
                  <li><strong>Location:</strong> GPS + Google Maps API with route waypoint calculation and real-time polylines</li>
                  <li><strong>Communication:</strong> SMS Gateway (Fast2SMS / MSG91 / Twilio) for Warnings and Fines delivery</li>
                  <li><strong>Storage:</strong> Cloud Storage bucket for encrypted violation evidence photos</li>
                  <li><strong>Payment:</strong> Secure Payment Gateway (Razorpay / UPI) with webhook verification</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-slate-900">Enforcement & Incentive State Machine Flow</h4>
                <p className="text-slate-600">
                  1. Worker inspects doorstep waste → If mixed, uploads photo proof and selects reason.
                  <br />
                  2. Report is placed in <strong>Under Review</strong> state in MySQL. (No direct fine is imposed).
                  <br />
                  3. Admin Zonal Officer audits evidence photo in Municipal Portal → Approves or rejects report.
                  <br />
                  4. If approved, system checks household history:
                  <br />
                  &nbsp;&nbsp;• 1st violation: Warning 1 issued + SMS sent.
                  <br />
                  &nbsp;&nbsp;• 2nd violation: Warning 2 issued + SMS sent.
                  <br />
                  &nbsp;&nbsp;• 3rd violation: ₹100 Fine generated + SMS payment link sent.
                  <br />
                  5. Resident pays ₹100 via UPI / Card.
                  <br />
                  6. Payment Gateway triggers webhook → <strong>40% (₹40) is automatically credited to reporting worker's incentive wallet</strong>.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
