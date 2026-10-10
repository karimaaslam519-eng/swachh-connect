import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Navigation, 
  Play, 
  Square, 
  Award, 
  FileText, 
  User, 
  Radio, 
  Calendar, 
  Camera, 
  Check, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MapTracker } from './MapTracker';
import { ViolationReportModal } from './ViolationReportModal';
import { Customer } from '../types';

export const WorkerDashboard: React.FC = () => {
  const { 
    currentUser, 
    customers, 
    routes, 
    schedules, 
    violations, 
    incentives, 
    startWorkerRoute, 
    endWorkerRoute, 
    markWasteCollected, 
    activeWorkerId, 
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'route' | 'collections' | 'reports' | 'incentives' | 'profile'>('dashboard');
  const [selectedCustomerForViolation, setSelectedCustomerForViolation] = useState<Customer | null>(null);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const worker = currentUser;
  const activeRoute = routes.find(r => r.id === worker?.assignedRouteId) || routes[0];
  const waypoints = activeRoute?.waypoints || [];

  // Filter schedules and households assigned to this route
  const assignedCustomers = customers.filter(c => c.assignedRouteId === activeRoute?.id);
  const myReports = violations.filter(v => v.workerId === worker?.id);
  const myIncentives = incentives.filter(i => i.workerId === worker?.id);

  const completedCount = schedules.filter(s => s.workerId === worker?.id && s.todayStatus === 'Collected').length;
  const pendingCount = Math.max(0, assignedCustomers.length - completedCount);

  const handleMarkCollected = (cust: Customer) => {
    const sched = schedules.find(s => s.customerId === cust.id);
    if (sched) {
      markWasteCollected(sched.id, cust.id, worker.id, 'Doorstep segregated waste verified & collected.');
      showToast(`✓ Waste collected for ${cust.name}`);
    }
  };

  const handleOpenViolation = (cust: Customer) => {
    setSelectedCustomerForViolation(cust);
    setIsViolationModalOpen(true);
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 flex flex-col font-sans">
      
      {/* Worker Header Status Banner */}
      <div className="bg-slate-900 text-white px-4 py-3 shadow-md flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/30">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base leading-tight">{worker.name}</h2>
              <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                {worker.workerCode}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {worker.assignedWard} • {worker.vehicleNumber}
            </p>
          </div>
        </div>

        {/* Route Action Control (Start/End Route) */}
        <div>
          {worker.isRouteActive ? (
            <button
              onClick={() => {
                endWorkerRoute(worker.id);
                showToast('Route Completed. Live GPS tracking stopped.');
              }}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{t.endRoute}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                startWorkerRoute(worker.id);
                showToast('Route Started! Live GPS location is now shared with citizens.');
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all animate-pulse"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.startRoute}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto bg-slate-900 text-emerald-400 p-3 rounded-2xl shadow-xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full px-4 py-5 flex-1 space-y-5">
        
        {/* ======================= DASHBOARD TAB ======================= */}
        {activeTab === 'dashboard' && (
          <>
            {/* GPS Live Telemetry Status Card */}
            <div className={`p-4 rounded-3xl border flex items-center justify-between transition-all ${
              worker.isRouteActive 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${worker.isRouteActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">
                    {worker.isRouteActive ? 'GPS TRANSMISSION ACTIVE' : 'COLLECTION SHIFT PAUSED'}
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {worker.lastLocationUpdate}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700">
                {worker.isRouteActive ? 'Transmitting' : 'Idle'}
              </span>
            </div>

            {/* Quick Metrics Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">{t.assignedHouseholds}</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">
                  {assignedCustomers.length}
                </span>
                <span className="text-[10px] text-slate-500">Route 12-A</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">{t.completedCollections}</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">
                  {completedCount}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Segregated Pickups</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">{t.pendingCollections}</span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">
                  {pendingCount}
                </span>
                <span className="text-[10px] text-amber-700 font-medium">Remaining stops</span>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-semibold text-slate-400 block">{t.incentiveBalance}</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">
                  ₹{worker.incentiveBalance}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">40% fine share</span>
              </div>
            </div>

            {/* Route Map Preview */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-amber-600" />
                  <span>Assigned Route & Household Waypoints</span>
                </h3>
                <button
                  onClick={() => setActiveTab('route')}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  Full Map View →
                </button>
              </div>

              <MapTracker
                worker={worker}
                waypoints={waypoints}
                isWorkerActive={worker.isRouteActive}
                height="h-56"
              />
            </div>

            {/* Today's Doorstep Quick Checklist */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Doorstep Collection Actions</h3>
                  <p className="text-xs text-slate-500">
                    Verify segregation quality before marking collected
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('collections')}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  View All ({assignedCustomers.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {assignedCustomers.slice(0, 3).map((cust) => {
                  const sched = schedules.find(s => s.customerId === cust.id);
                  const isDone = sched?.todayStatus === 'Collected';
                  const hasIssue = sched?.todayStatus === 'Segregation Issue';

                  return (
                    <div
                      key={cust.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{cust.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                              {cust.address.houseNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{cust.address.street}</p>
                        </div>

                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : hasIssue
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {sched?.todayStatus || 'Scheduled'}
                        </span>
                      </div>

                      {/* Large Quick Buttons (Mandated: Option 1 vs Option 2) */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleMarkCollected(cust)}
                          disabled={isDone}
                          className={`py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            isDone
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                          <span>{isDone ? 'Collected ✓' : t.markCollected}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenViolation(cust)}
                          className="py-3 px-3 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-300 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>{t.markNotSegregated}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ======================= ROUTE TAB ======================= */}
        {activeTab === 'route' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Assigned Ward Route</h3>
                  <p className="text-xs text-slate-500">{activeRoute?.name}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                  {waypoints.length} Total Waypoints
                </span>
              </div>

              <MapTracker
                worker={worker}
                waypoints={waypoints}
                isWorkerActive={worker.isRouteActive}
                height="h-96"
              />

              {/* Waypoint stops listed sequentially */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Sequential Stops on Route:
                </h4>
                {waypoints.map((wp, i) => (
                  <div
                    key={wp.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{wp.householdName}</p>
                        <p className="text-[11px] text-slate-500">{wp.address}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        wp.isCollected
                          ? 'bg-emerald-100 text-emerald-800'
                          : wp.hasViolation
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {wp.isCollected ? 'Collected' : wp.hasViolation ? 'Violation Flagged' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= COLLECTIONS TAB ======================= */}
        {activeTab === 'collections' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Today's Assigned Households</h3>
              <p className="text-xs text-slate-500">
                Inspect waste segregation quality at each doorstep
              </p>
            </div>

            <div className="space-y-3">
              {assignedCustomers.map((cust) => {
                const sched = schedules.find(s => s.customerId === cust.id);
                const isDone = sched?.todayStatus === 'Collected';
                const hasIssue = sched?.todayStatus === 'Segregation Issue';

                return (
                  <div
                    key={cust.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-base text-slate-900">{cust.name}</h4>
                        <p className="text-xs text-slate-500">
                          {cust.address.houseNumber}, {cust.address.street}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Window: {sched?.expectedTime || '07:30 AM - 08:30 AM'}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : hasIssue
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {sched?.todayStatus || 'Scheduled'}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleMarkCollected(cust)}
                        disabled={isDone}
                        className={`py-3.5 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isDone
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>{isDone ? 'Collected ✓' : 'Mark Collected'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenViolation(cust)}
                        className="py-3.5 px-3 rounded-2xl font-bold text-xs bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-300 flex items-center justify-center gap-2 transition-all"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Report Mixed Waste</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= REPORTS TAB ======================= */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Submitted Segregation Reports</h3>
              <p className="text-xs text-slate-500">
                Track status of violation reports submitted to Municipal Admin for audit
              </p>
            </div>

            {myReports.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No violation reports submitted today.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myReports.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{r.customerName}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          r.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : r.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <p className="text-slate-700 font-semibold">{r.reason}</p>
                    {r.remarks && <p className="text-slate-500">{r.remarks}</p>}

                    {r.proofImageUrl && (
                      <img
                        src={r.proofImageUrl}
                        alt="Proof"
                        className="w-full max-h-36 object-cover rounded-xl border border-slate-200"
                      />
                    )}

                    {r.adminRemarks && (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-600">
                        <strong>Admin Verdict:</strong> {r.adminRemarks}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Report #{r.id}</span>
                      <span>{r.reportedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= INCENTIVES TAB ======================= */}
        {activeTab === 'incentives' && (
          <div className="space-y-4">
            {/* Balance Overview */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                Sanitation Champion Incentive Ledger
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">₹{worker.incentiveBalance}.00</span>
                <span className="text-xs text-emerald-100 font-medium">Earned & Verified</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-emerald-500/40">
                <div>
                  <span className="text-emerald-100 block">Pending Clearance:</span>
                  <span className="font-bold text-white">₹{worker.pendingIncentives}.00</span>
                </div>
                <div>
                  <span className="text-emerald-100 block">Paid Out to Bank:</span>
                  <span className="font-bold text-white">₹{worker.paidIncentives}.00</span>
                </div>
              </div>
            </div>

            {/* Explanatory Policy Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs text-xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>How Incentives Are Awarded</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Under the SwachhConnect Municipal Framework, when a citizen pays an imposed segregation fine of ₹100, <strong>40% (₹40) is directly credited to the reporting sanitation worker's account</strong> as an enforcement incentive.
              </p>
            </div>

            {/* Incentive History List */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Incentive Credit History</h4>

              <div className="space-y-2.5">
                {myIncentives.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900">+₹{inc.amount}.00</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Household: {inc.customerName} ({inc.percentage}% of fine)
                      </p>
                      <p className="text-slate-400 text-[10px]">{inc.createdAt}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        inc.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inc.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================= PROFILE TAB ======================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Sanitation Champion Profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Worker Full Name</span>
                <span className="font-bold text-slate-800 text-sm">{worker.name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Staff Code ID</span>
                <span className="font-bold text-slate-800 text-sm font-mono">{worker.workerCode}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Assigned Ward / Zone</span>
                <span className="font-bold text-slate-800 text-sm">{worker.assignedWard}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Vehicle Assignment</span>
                <span className="font-bold text-slate-800 text-sm">{worker.vehicleNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Worker Rating</span>
                <span className="font-bold text-emerald-700 text-sm">★ {worker.rating} / 5.0</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[11px]">Registered Mobile</span>
                <span className="font-bold text-slate-800 text-sm">+91 {worker.mobile}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Worker Bottom Navigation Bar (Mandated: Dashboard | Route | Collections | Reports | Incentives | Profile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/90 py-1.5 px-3 z-30 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeTab === 'dashboard' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.home}</span>
          </button>

          <button
            onClick={() => setActiveTab('route')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeTab === 'route' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.route}</span>
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeTab === 'collections' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.collections}</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeTab === 'reports' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.reports}</span>
          </button>

          <button
            onClick={() => setActiveTab('incentives')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeTab === 'incentives' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.incentives}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              activeTab === 'profile' ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.profile}</span>
          </button>
        </div>
      </nav>

      {/* Violation Reporting Modal */}
      {selectedCustomerForViolation && (
        <ViolationReportModal
          customer={selectedCustomerForViolation}
          isOpen={isViolationModalOpen}
          onClose={() => {
            setIsViolationModalOpen(false);
            setSelectedCustomerForViolation(null);
          }}
          onSuccess={() => {
            showToast('Report submitted for Municipal Admin audit.');
          }}
        />
      )}
    </div>
  );
};
