import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Truck, 
  Calendar, 
  ShieldAlert, 
  MessageSquare, 
  CreditCard, 
  Award, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Clock, 
  ChevronRight,
  TrendingUp,
  MapPin,
  Settings,
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MapTracker } from './MapTracker';
import { WasteViolationReport, Customer, Worker } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    customers, 
    workers, 
    schedules, 
    violations, 
    warnings, 
    fines, 
    payments, 
    incentives, 
    complaints, 
    config, 
    updateConfig, 
    adminApproveViolation, 
    adminRejectViolation, 
    adminResolveComplaint, 
    routes,
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'customers' | 'workers' | 'schedules' | 'violations' | 'complaints' | 'fines' | 'incentives' | 'reports'
  >('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedViolationForAudit, setSelectedViolationForAudit] = useState<WasteViolationReport | null>(null);
  const [adminRemarkText, setAdminRemarkText] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [complaintResolutionNote, setComplaintResolutionNote] = useState('');
  const [viewProofModalUrl, setViewProofModalUrl] = useState<string | null>(null);
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState<Customer | null>(null);

  // Computed metrics
  const totalCustomersCount = customers.length;
  const activeWorkersCount = workers.filter(w => w.isRouteActive).length;
  const totalScheduledPickups = schedules.length;
  const completedPickupsCount = schedules.filter(s => s.todayStatus === 'Collected').length;
  const missedCollectionsCount = complaints.filter(c => c.status !== 'Resolved').length;
  const totalViolationsCount = violations.length;
  const pendingVerificationsCount = violations.filter(v => v.status === 'Under Review').length;
  const warningsIssuedCount = warnings.length;
  const finesCollectedTotal = payments.reduce((acc, p) => acc + p.amount, 0);
  const workerIncentivesDistributed = incentives.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
  const totalComplaintsCount = complaints.length;

  const handleApprove = (reportId: string) => {
    adminApproveViolation(reportId, adminRemarkText || 'Evidence verified by Municipal Zonal Officer. Next enforcement tier issued.');
    setSelectedViolationForAudit(null);
    setAdminRemarkText('');
  };

  const handleReject = (reportId: string) => {
    adminRejectViolation(reportId, adminRemarkText || 'Violation rejected: Image does not substantiate unsegregated waste.');
    setSelectedViolationForAudit(null);
    setAdminRemarkText('');
  };

  const handleResolveComplaint = (complaintId: string) => {
    if (!complaintResolutionNote.trim()) return;
    adminResolveComplaint(complaintId, complaintResolutionNote);
    setSelectedComplaintId(null);
    setComplaintResolutionNote('');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 flex flex-col font-sans">
      
      {/* Admin Command Banner */}
      <div className="bg-slate-900 text-white px-6 py-4 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base leading-tight">Municipal Command Center</h2>
                <span className="text-[10px] px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded font-mono border border-cyan-800">
                  GCC ZONE 5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Solid Waste Management & Citizen Grievance Redressal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
              Active Workers: <strong className="text-emerald-400">{activeWorkersCount} / {workers.length}</strong>
            </span>
            <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 border border-slate-700">
              Pending Audits: <strong className="text-amber-400">{pendingVerificationsCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation (Mandated: Dashboard | Customers | Workers | Schedules | Violations | Complaints | Fines | Incentives | Reports) */}
      <div className="bg-white border-b border-slate-200 sticky top-12 z-20 overflow-x-auto shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 min-w-max py-1.5">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'customers', label: 'Customers', icon: Users, badge: totalCustomersCount },
            { id: 'workers', label: 'Workers', icon: Truck, badge: activeWorkersCount },
            { id: 'schedules', label: 'Schedules', icon: Calendar },
            { id: 'violations', label: 'Violations', icon: ShieldAlert, badge: pendingVerificationsCount, badgeColor: 'bg-amber-500' },
            { id: 'complaints', label: 'Complaints', icon: AlertCircle, badge: missedCollectionsCount, badgeColor: 'bg-red-500' },
            { id: 'fines', label: 'Fines', icon: CreditCard },
            { id: 'incentives', label: 'Incentives', icon: Award },
            { id: 'reports', label: 'Reports', icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full text-white font-mono ${
                      item.badgeColor || 'bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 space-y-6">
        
        {/* ======================= DASHBOARD TAB ======================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Dashboard 11 Mandatory Metrics KPI Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">{t.totalCustomers}</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{totalCustomersCount}</span>
                <span className="text-[10px] text-emerald-600 font-medium">Registered Households</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">{t.activeWorkers}</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{activeWorkersCount}</span>
                <span className="text-[10px] text-slate-500">of {workers.length} On Shift</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">{t.scheduledPickups}</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{totalScheduledPickups}</span>
                <span className="text-[10px] text-slate-500">Doorstep Targets</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">Completed Pickups</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedPickupsCount}</span>
                <span className="text-[10px] text-emerald-700 font-medium">Segregated & Cleared</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">Missed Collections</span>
                <span className="text-2xl font-black text-red-600 mt-1 block">{missedCollectionsCount}</span>
                <span className="text-[10px] text-red-700 font-medium">Pending Grievances</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">Segregation Violations</span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">{totalViolationsCount}</span>
                <span className="text-[10px] text-amber-700 font-medium">Reported by Workers</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">Pending Verifications</span>
                <span className="text-2xl font-black text-amber-500 mt-1 block">{pendingVerificationsCount}</span>
                <span className="text-[10px] text-amber-600 font-bold">Needs Admin Audit</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">Warnings Issued</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{warningsIssuedCount}</span>
                <span className="text-[10px] text-slate-500">Tier 1 & 2 Notices</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">{t.finesCollected}</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">₹{finesCollectedTotal}</span>
                <span className="text-[10px] text-emerald-700 font-medium">₹100 Tier 3 Fines</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">Worker Incentives Paid</span>
                <span className="text-2xl font-black text-teal-600 mt-1 block">₹{workerIncentivesDistributed}</span>
                <span className="text-[10px] text-teal-700 font-medium">40% Fine Sharing</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs sm:col-span-2">
                <span className="text-xs font-semibold text-slate-400 block">Customer Complaints</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{totalComplaintsCount}</span>
                <span className="text-[10px] text-slate-500">Total Grievances Submitted</span>
              </div>
            </div>

            {/* Live GPS Fleet Map for Municipal Authority */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Ward 12 Live Sanitation Operations Map</h3>
                  <p className="text-xs text-slate-500">
                    Real-time GPS vehicle tracking and collection progress
                  </p>
                </div>
                <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                  Live Fleet: {activeWorkersCount} Active
                </span>
              </div>

              <MapTracker
                worker={workers[0]}
                waypoints={routes[0]?.waypoints}
                isWorkerActive={workers[0].isRouteActive}
                height="h-72"
              />
            </div>

            {/* Pending Violations That Require Immediate Municipal Verification */}
            {pendingVerificationsCount > 0 && (
              <div className="bg-amber-50/60 border border-amber-200/90 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-sm">
                      Urgent: {pendingVerificationsCount} Violation Report(s) Awaiting Municipal Verification
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('violations')}
                    className="text-xs font-bold text-amber-800 hover:underline"
                  >
                    Open Violations Queue →
                  </button>
                </div>
                <p className="text-xs text-amber-800">
                  Workers have documented improper waste segregation with photograph proof. The Municipal Admin must visually audit the evidence before a Warning or ₹100 Fine is imposed.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ======================= CUSTOMERS TAB ======================= */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Resident Customer Management</h3>
                <p className="text-xs text-slate-500">
                  Manage households, compliance records, warnings, and fine histories
                </p>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3.5 px-4">Resident & Contact</th>
                      <th className="py-3.5 px-4">Doorstep Address</th>
                      <th className="py-3.5 px-4">Violation Tier</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                          <p className="text-slate-400 font-mono">+91 {c.mobile}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-slate-700 font-medium">{c.address.houseNumber}</p>
                          <p className="text-slate-400 text-[11px]">{c.address.street}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800">{c.violationCount} / 3</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              c.currentStatus === 'Clean Record'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.currentStatus === 'Fine Pending'
                                ? 'bg-red-100 text-red-800 font-black'
                                : c.currentStatus === 'Fine Paid'
                                ? 'bg-teal-100 text-teal-800'
                                : c.currentStatus === 'Disputed'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.currentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedCustomerHistory(c)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
                          >
                            View Record
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================= WORKERS TAB ======================= */}
        {activeTab === 'workers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Sanitation Worker Force</h3>
                <p className="text-xs text-slate-500">
                  Assign wards, monitor real GPS locations, and track incentive performance
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {workers.map((w) => (
                <div
                  key={w.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-base text-slate-900">{w.name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded font-mono">
                          {w.workerCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{w.assignedWard}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        w.isRouteActive
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {w.isRouteActive ? 'GPS ACTIVE' : 'OFF-DUTY'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-600">
                      Vehicle: <strong>{w.vehicleNumber}</strong>
                    </p>
                    <p className="text-slate-600">
                      Rating: <strong className="text-emerald-700">★ {w.rating} / 5.0</strong>
                    </p>
                    <p className="text-slate-600">
                      Incentives Earned: <strong className="text-emerald-600">₹{w.incentiveBalance}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 pt-1">
                      Last GPS Ping: {w.lastLocationUpdate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= SCHEDULES TAB ======================= */}
        {activeTab === 'schedules' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Doorstep Collection Schedules</h3>
              <p className="text-xs text-slate-500">
                Configure collection days, expected windows, and assigned workers
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Resident</th>
                    <th className="py-3 px-4">Collection Days</th>
                    <th className="py-3 px-4">Time Window</th>
                    <th className="py-3 px-4">Assigned Worker</th>
                    <th className="py-3 px-4">Today's Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{s.customerName}</td>
                      <td className="py-3 px-4 text-slate-700">{s.collectionDays.join(', ')}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{s.expectedTime}</td>
                      <td className="py-3 px-4 text-slate-800">{s.workerName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            s.todayStatus === 'Collected'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.todayStatus === 'Segregation Issue'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {s.todayStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================= VIOLATIONS AUDIT TAB (CORE WORKFLOW) ======================= */}
        {activeTab === 'violations' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Waste Segregation Violation Reports & Audits
              </h3>
              <p className="text-xs text-slate-500">
                Review worker-submitted photographic evidence before escalating to Warning 1, Warning 2, or ₹100 Fine
              </p>
            </div>

            <div className="space-y-4">
              {violations.map((v) => (
                <div
                  key={v.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-slate-900">{v.customerName}</h4>
                        <span className="text-xs text-slate-400 font-mono">({v.customerMobile})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{v.householdAddress}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        Reported by: <strong>{v.workerName}</strong>
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          v.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : v.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : v.status === 'Fine Pending'
                            ? 'bg-red-100 text-red-800 font-black'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>
                  </div>

                  {/* Violation Details & Evidence Photo */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="sm:col-span-2 space-y-2">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="text-slate-400 block text-[11px]">Reason for Violation</span>
                        <p className="font-bold text-amber-900 text-sm mt-0.5">{v.reason}</p>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span className="text-slate-400 block text-[11px]">Sanitation Worker Remarks</span>
                        <p className="text-slate-700 mt-0.5">{v.remarks || 'No notes provided'}</p>
                      </div>

                      {v.adminRemarks && (
                        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-emerald-900">
                          <span className="text-emerald-700 block text-[11px] font-bold">
                            Municipal Audit Decision
                          </span>
                          <p className="mt-0.5">{v.adminRemarks}</p>
                        </div>
                      )}

                      {v.disputeReason && (
                        <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl text-purple-900">
                          <span className="text-purple-700 block text-[11px] font-bold">
                            Citizen Dispute Filed:
                          </span>
                          <p className="mt-0.5 font-medium">{v.disputeReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Proof Photo */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Uploaded Proof Photo
                      </span>
                      <div
                        onClick={() => setViewProofModalUrl(v.proofImageUrl)}
                        className="relative group rounded-2xl overflow-hidden cursor-pointer border border-slate-200 bg-slate-900 h-36"
                      >
                        <img
                          src={v.proofImageUrl}
                          alt="Proof"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                          <Eye className="w-4 h-4" /> Expand Photo
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audit Actions (Only for 'Under Review' or 'Disputed') */}
                  {(v.status === 'Under Review' || v.status === 'Disputed') && (
                    <div className="border-t border-slate-100 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                      <input
                        type="text"
                        placeholder="Optional remarks (e.g. Verified by Zonal Officer)"
                        value={selectedViolationForAudit?.id === v.id ? adminRemarkText : ''}
                        onChange={(e) => {
                          setSelectedViolationForAudit(v);
                          setAdminRemarkText(e.target.value);
                        }}
                        className="flex-1 px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => handleReject(v.id)}
                        className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Report</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprove(v.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Issue Next Penalty</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= COMPLAINTS RESOLUTION TAB ======================= */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Missed Collection Grievance Redressal</h3>
              <p className="text-xs text-slate-500">
                Audit citizen complaints and dispatch relief collection vehicles
              </p>
            </div>

            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{c.customerName}</h4>
                      <p className="text-slate-500">
                        Missed Date: {c.missedDate} • Mobile: +91 {c.customerMobile}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-slate-800 font-semibold">{c.reason}</p>
                  {c.description && (
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl">{c.description}</p>
                  )}

                  {c.resolutionNote && (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-900">
                      <strong>Resolution:</strong> {c.resolutionNote}
                    </div>
                  )}

                  {c.status !== 'Resolved' && (
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Resolution details (e.g. Relief vehicle TN 02 BL 4892 dispatched; completed at 11 AM)"
                          value={selectedComplaintId === c.id ? complaintResolutionNote : ''}
                          onChange={(e) => {
                            setSelectedComplaintId(c.id);
                            setComplaintResolutionNote(e.target.value);
                          }}
                          className="flex-1 px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleResolveComplaint(c.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                        >
                          Resolve Grievance
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= FINES & PAYMENT AUDIT TAB ======================= */}
        {activeTab === 'fines' && (
          <div className="space-y-4">
            {/* Fine Config Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base text-slate-900">Municipal Fine Rule Settings</h4>
                <p className="text-xs text-slate-500">
                  Standard fine imposed on 3rd unsegregated waste violation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Default Fine Amount:</span>
                <span className="text-xl font-black text-slate-900">₹{config.fineAmount}.00</span>
              </div>
            </div>

            {/* Fines Ledger */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Resident</th>
                    <th className="py-3 px-4">Fine Amount</th>
                    <th className="py-3 px-4">Date Issued</th>
                    <th className="py-3 px-4">SMS Status</th>
                    <th className="py-3 px-4">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fines.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{f.customerName}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">₹{f.amount}.00</td>
                      <td className="py-3 px-4 text-slate-500">{f.issuedAt}</td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-700 font-semibold">✓ {f.smsStatus}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            f.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800 font-extrabold'
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================= INCENTIVES CONFIG TAB ======================= */}
        {activeTab === 'incentives' && (
          <div className="space-y-4">
            {/* Incentive Config Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base text-slate-900">Worker Incentive Sharing Configuration</h4>
                <p className="text-xs text-slate-500">
                  Direct revenue-share percentage transferred to reporting worker upon fine payment
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Configured Incentive:</span>
                <span className="text-xl font-black text-emerald-700">{config.incentivePercentage}% (₹40.00 / fine)</span>
              </div>
            </div>

            {/* Incentives Ledger */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Sanitation Champion</th>
                    <th className="py-3 px-4">Household Source</th>
                    <th className="py-3 px-4">Incentive (40%)</th>
                    <th className="py-3 px-4">Date Credited</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incentives.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{i.workerName}</td>
                      <td className="py-3 px-4 text-slate-600">{i.customerName}</td>
                      <td className="py-3 px-4 font-bold text-emerald-700">+₹{i.amount}.00</td>
                      <td className="py-3 px-4 text-slate-400">{i.createdAt}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            i.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : i.status === 'Approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {i.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================= REPORTS & ANALYTICS TAB ======================= */}
        {activeTab === 'reports' && (
          <div className="space-y-5">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">Sanitation Performance & Compliance Analytics</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-xs">
                  <span className="text-emerald-800 font-bold block">Segregation Compliance Rate</span>
                  <span className="text-3xl font-black text-emerald-700 mt-1 block">88.4%</span>
                  <p className="text-slate-500 mt-1">+12.6% improvement since SwachhConnect launch</p>
                </div>

                <div className="bg-cyan-50 p-4 rounded-2xl border border-cyan-100 text-xs">
                  <span className="text-cyan-800 font-bold block">Doorstep Completion Rate</span>
                  <span className="text-3xl font-black text-cyan-700 mt-1 block">96.2%</span>
                  <p className="text-slate-500 mt-1">Average daily completion across Ward 12</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-xs">
                  <span className="text-amber-800 font-bold block">Grievance Redressal Time</span>
                  <span className="text-3xl font-black text-amber-700 mt-1 block">2.4 hrs</span>
                  <p className="text-slate-500 mt-1">Relief vehicle dispatch window</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Expanded Photo Proof Viewer Modal */}
      {viewProofModalUrl && (
        <div
          onClick={() => setViewProofModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-xl w-full bg-slate-900 rounded-3xl overflow-hidden p-2">
            <img src={viewProofModalUrl} alt="Evidence Proof" className="w-full max-h-[80vh] object-contain rounded-2xl" />
            <button
              onClick={() => setViewProofModalUrl(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Customer Record Modal */}
      {selectedCustomerHistory && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-base text-slate-900">{selectedCustomerHistory.name}</h4>
              <button onClick={() => setSelectedCustomerHistory(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs space-y-2">
              <p><strong>Mobile:</strong> +91 {selectedCustomerHistory.mobile}</p>
              <p><strong>Address:</strong> {selectedCustomerHistory.address.houseNumber}, {selectedCustomerHistory.address.street}</p>
              <p><strong>Violations Count:</strong> {selectedCustomerHistory.violationCount}</p>
              <p><strong>Status:</strong> {selectedCustomerHistory.currentStatus}</p>
            </div>
            <button
              onClick={() => setSelectedCustomerHistory(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
