import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  Bell, 
  User, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Phone, 
  ShieldAlert, 
  CreditCard, 
  FileText, 
  Navigation, 
  ChevronRight, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  Info,
  ShieldCheck,
  AlertCircle,
  Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MapTracker } from './MapTracker';
import { PaymentModal } from './PaymentModal';
import { MissedCollectionModal } from './MissedCollectionModal';
import { FineRecord } from '../types';

export const CustomerDashboard: React.FC = () => {
  const { 
    currentUser, 
    customers, 
    activeCustomerId, 
    setActiveCustomerId, 
    workers, 
    routes, 
    schedules, 
    warnings, 
    fines, 
    payments, 
    complaints, 
    smsLogs, 
    disputeViolation,
    violations,
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'track' | 'complaints' | 'notifications' | 'profile'>('home');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isMissedCollectionOpen, setIsMissedCollectionOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<FineRecord | null>(null);
  const [disputeReportId, setDisputeReportId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  const customer = currentUser;
  const assignedWorker = workers.find(w => w.id === customer?.assignedWorkerId) || workers[0];
  const activeRoute = routes.find(r => r.id === assignedWorker?.assignedRouteId) || routes[0];
  const schedule = schedules.find(s => s.customerId === customer?.id) || schedules[0];

  // Specific customer records
  const myWarnings = warnings.filter(w => w.customerId === customer?.id);
  const myFines = fines.filter(f => f.customerId === customer?.id);
  const myPendingFine = myFines.find(f => f.status === 'Pending');
  const myComplaints = complaints.filter(c => c.customerId === customer?.id);
  const mySms = smsLogs.filter(s => s.recipientMobile === customer?.mobile);
  const myViolations = violations.filter(v => v.customerId === customer?.id);

  const handleOpenPayment = (fine: FineRecord) => {
    setSelectedFine(fine);
    setIsPaymentOpen(true);
  };

  const handleDisputeSubmit = (reportId: string) => {
    if (!disputeReason.trim()) return;
    disputeViolation(reportId, disputeReason);
    setDisputeReportId(null);
    setDisputeReason('');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 flex flex-col font-sans">
      
      {/* Citizen Household Banner Bar */}
      <div className="bg-emerald-700 text-white px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg shadow-inner">
            {customer.name?.charAt(0) || 'R'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-base leading-tight">{customer.name}</h2>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-500/30 text-emerald-100 rounded-full font-semibold border border-emerald-400/40">
                {customer.address?.ward || 'Ward 12'}
              </span>
            </div>
            <p className="text-xs text-emerald-100 truncate max-w-[240px] sm:max-w-md">
              {customer.address?.houseNumber}, {customer.address?.street}
            </p>
          </div>
        </div>

        {/* Quick Citizen Account Switcher (For demo testing: Priya vs Murugan with pending fine) */}
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="text-emerald-200">Switch Demo Citizen:</span>
          <select
            value={activeCustomerId}
            onChange={(e) => setActiveCustomerId(e.target.value)}
            className="bg-emerald-800 text-white rounded-lg px-2 py-1 text-xs border border-emerald-600 focus:outline-none"
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.currentStatus})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-4xl mx-auto w-full px-4 py-5 flex-1 space-y-5">
        
        {/* ======================= HOME TAB ======================= */}
        {activeTab === 'home' && (
          <>
            {/* Urgent Fine Pending Alert Banner (If ₹100 Fine is active) */}
            {myPendingFine && (
              <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                        MUNICIPAL FINE IMPOSED
                      </span>
                      <span className="font-bold text-lg">₹{myPendingFine.amount}</span>
                    </div>
                    <p className="text-xs text-red-100 mt-1">
                      Imposed following 3 verified waste segregation violations. Pay now to maintain standard municipal clearance.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenPayment(myPendingFine)}
                  className="px-5 py-2.5 bg-white hover:bg-red-50 text-red-700 font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 shrink-0 transition-transform active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{myPendingFine.amount} Online</span>
                </button>
              </div>
            )}

            {/* Today's Pickup Status Card */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.todayPickupStatus}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                    schedule?.todayStatus === 'Collected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : schedule?.todayStatus === 'In-Progress'
                      ? 'bg-cyan-100 text-cyan-800 animate-pulse'
                      : schedule?.todayStatus === 'Segregation Issue'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {schedule?.todayStatus === 'Collected' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {schedule?.todayStatus === 'In-Progress' && <Clock className="w-3.5 h-3.5" />}
                  {schedule?.todayStatus === 'Segregation Issue' && <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{schedule?.todayStatus || 'Scheduled'}</span>
                </span>
              </div>

              {/* Status Graphic & Timing */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-inner">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">{t.nextPickup}</p>
                  <p className="text-base font-bold text-slate-900">
                    {schedule?.expectedTime || '07:30 AM - 08:30 AM'}
                  </p>
                  <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                    Category: {schedule?.wasteType || 'Segregated (Both Wet & Dry)'}
                  </p>
                </div>
                {schedule?.lastCollectedAt && (
                  <div className="text-right text-[11px] text-slate-400 font-medium hidden sm:block">
                    Last Collected:<br />
                    <span className="text-slate-700 font-semibold">{schedule.lastCollectedAt}</span>
                  </div>
                )}
              </div>

              {/* Assigned Sanitation Worker Card */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    <Truck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs text-slate-400">{t.assignedWorker}</p>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold">
                        ★ {assignedWorker?.rating}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900">{assignedWorker?.name}</p>
                    <p className="text-[11px] text-slate-500">{assignedWorker?.vehicleNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('track')}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.trackWorker}</span>
                  </button>

                  <button
                    onClick={() => setIsMissedCollectionOpen(true)}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.reportMissed}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Segregation Compliance & Warning Ladder Status */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">{t.warningStatus}</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Violations on Record: <strong>{customer.violationCount || 0} / 3</strong>
                </span>
              </div>

              {/* Visual 3-Stage Penalty Progression Meter */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Stage 1 */}
                <div
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    customer.violationCount >= 1
                      ? 'border-amber-300 bg-amber-50 text-amber-900'
                      : 'border-slate-100 bg-slate-50/70 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase block tracking-wider">
                    Violation 1
                  </span>
                  <span className="text-xs font-bold block mt-0.5">Warning 1</span>
                  <span className="text-[10px] text-slate-500">Advisory SMS</span>
                </div>

                {/* Stage 2 */}
                <div
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    customer.violationCount >= 2
                      ? 'border-orange-300 bg-orange-50 text-orange-900'
                      : 'border-slate-100 bg-slate-50/70 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase block tracking-wider">
                    Violation 2
                  </span>
                  <span className="text-xs font-bold block mt-0.5">Warning 2</span>
                  <span className="text-[10px] text-slate-500">Urgent SMS Notice</span>
                </div>

                {/* Stage 3 */}
                <div
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    customer.violationCount >= 3
                      ? 'border-red-300 bg-red-50 text-red-900 font-bold'
                      : 'border-slate-100 bg-slate-50/70 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase block tracking-wider">
                    Violation 3
                  </span>
                  <span className="text-xs font-bold block mt-0.5">₹100 Fine</span>
                  <span className="text-[10px] text-slate-500">Online Payment</span>
                </div>
              </div>

              {/* Context Explanation */}
              <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl">
                {customer.violationCount === 0 && (
                  <span className="text-emerald-700 font-medium">
                    ✓ Clean compliance record! Keep separating wet organic waste and dry recyclables into individual bins.
                  </span>
                )}
                {customer.violationCount === 1 && (
                  <span className="text-amber-800 font-medium">
                    Warning 1 has been issued. A repeat unsegregated collection report will escalate to Warning 2.
                  </span>
                )}
                {customer.violationCount === 2 && (
                  <span className="text-orange-800 font-medium">
                    Warning 2 is active. <strong>The next verified violation will impose a ₹100 fine</strong>.
                  </span>
                )}
                {customer.violationCount >= 3 && (
                  <span className="text-red-800 font-medium">
                    3 violations confirmed. Municipal fine of ₹100 has been sanctioned under solid waste bylaws.
                  </span>
                )}
              </p>
            </div>

            {/* Quick Live Tracking Preview */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">{t.liveTracking}</h3>
                </div>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {assignedWorker?.isRouteActive ? 'Live GPS Active' : 'Off-Duty'}
                </span>
              </div>

              <MapTracker
                worker={assignedWorker}
                waypoints={activeRoute?.waypoints}
                customerLocation={{
                  latitude: customer.address.latitude,
                  longitude: customer.address.longitude,
                  name: customer.name
                }}
                isWorkerActive={assignedWorker.isRouteActive}
                height="h-56"
              />
            </div>
          </>
        )}

        {/* ======================= SCHEDULE TAB ======================= */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Doorstep Collection Schedule</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Assigned Days</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {schedule?.collectionDays.join(', ') || 'Daily Collection'}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Pickup Window</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{schedule?.expectedTime}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Segregation Policy</span>
                  <p className="text-sm font-bold text-emerald-700 mt-1">
                    Wet (Green Bin) & Dry (Blue Bin)
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Sanitation Champion</span>
                  <p className="text-sm font-bold text-slate-900 mt-1">{assignedWorker.name}</p>
                </div>
              </div>

              {/* Segregation Guide Card */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-xs text-emerald-900 uppercase tracking-wider">
                  Mandatory Segregation Guidelines
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                    <p className="font-bold text-emerald-800">🟢 Wet Waste (Biodegradable):</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Vegetable peels, cooked food, fruit wastes, tea bags, garden leaves.
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-100">
                    <p className="font-bold text-cyan-800">🔵 Dry Waste (Recyclable):</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Clean paper, cartons, plastic bottles, glass, dry packaging materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TRACK WORKER TAB ======================= */}
        {activeTab === 'track' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Live Sanitation Route Tracking</h3>
                  <p className="text-xs text-slate-500">
                    Real-time GPS vehicle location for Ward 12
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                    Vehicle: {assignedWorker.vehicleNumber}
                  </span>
                </div>
              </div>

              <MapTracker
                worker={assignedWorker}
                waypoints={activeRoute?.waypoints}
                customerLocation={{
                  latitude: customer.address.latitude,
                  longitude: customer.address.longitude,
                  name: customer.name
                }}
                isWorkerActive={assignedWorker.isRouteActive}
                height="h-96"
              />
            </div>
          </div>
        )}

        {/* ======================= COMPLAINTS & GRIEVANCES TAB ======================= */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Missed Collection & Grievances</h3>
                <p className="text-xs text-slate-500">Status tracking for missed doorsteps</p>
              </div>
              <button
                onClick={() => setIsMissedCollectionOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <span>+ Report Missed</span>
              </button>
            </div>

            {myComplaints.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Missed Pickup Complaints</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Your waste collection is operating normally. If a scheduled window is missed, file a grievance here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myComplaints.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Missed Date: {c.missedDate}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'Under Review'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800">{c.reason}</p>
                    {c.description && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                        {c.description}
                      </p>
                    )}

                    {c.resolutionNote && (
                      <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 text-xs text-emerald-900">
                        <strong>Municipal Resolution:</strong> {c.resolutionNote}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Complaint ID: {c.id}</span>
                      <span>Submitted: {c.submittedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= NOTIFICATIONS & SMS TAB ======================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Official SMS & Alerts</h3>
              <p className="text-xs text-slate-500">
                Official notices dispatched to +91 {customer.mobile}
              </p>
            </div>

            <div className="space-y-3">
              {mySms.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-emerald-600" />
                      {s.type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ✓ Delivered SMS
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-sans leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {s.message}
                  </p>
                  <p className="text-[10px] text-slate-400 text-right">{s.sentAt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= PROFILE & VIOLATIONS HISTORY TAB ======================= */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            {/* Citizen Details */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900">Resident Profile</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-bold text-slate-800 text-sm">{customer.name}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Registered Mobile</span>
                  <span className="font-bold text-slate-800 text-sm">+91 {customer.mobile}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl sm:col-span-2">
                  <span className="text-slate-400 block text-[11px]">Registered Address</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {customer.address.houseNumber}, {customer.address.street}, {customer.address.area}, {customer.address.city} - {customer.address.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* Violation & Dispute History */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Violations, Warnings & Fine History</span>
              </h3>

              {myViolations.length === 0 ? (
                <p className="text-xs text-slate-500">No violations on record. Excellent work!</p>
              ) : (
                <div className="space-y-3">
                  {myViolations.map((v) => (
                    <div
                      key={v.id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{v.reason}</span>
                        <span className="font-bold px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
                          {v.status}
                        </span>
                      </div>

                      <p className="text-slate-600">{v.remarks}</p>

                      {v.proofImageUrl && (
                        <div className="mt-1">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">
                            Audited Photo Evidence:
                          </span>
                          <img
                            src={v.proofImageUrl}
                            alt="Violation Evidence"
                            className="w-full max-h-36 object-cover rounded-xl border border-slate-200"
                          />
                        </div>
                      )}

                      {/* Dispute action */}
                      {v.status !== 'Disputed' && v.status !== 'Rejected' && v.status !== 'Fine Paid' && (
                        <div className="pt-1">
                          {disputeReportId === v.id ? (
                            <div className="space-y-2 bg-white p-3 rounded-xl border border-amber-200">
                              <label className="text-[11px] font-bold text-slate-700">
                                Explain Dispute / Challenge Violation:
                              </label>
                              <textarea
                                rows={2}
                                value={disputeReason}
                                onChange={(e) => setDisputeReason(e.target.value)}
                                placeholder="e.g. Bins were segregated; neighbor may have dropped unsegregated packet outside gate."
                                className="w-full p-2 text-xs border rounded-lg"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleDisputeSubmit(v.id)}
                                  className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold"
                                >
                                  Submit Dispute to Admin
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDisputeReportId(null)}
                                  className="px-3 py-1.5 border rounded-lg text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDisputeReportId(v.id)}
                              className="text-[11px] text-amber-700 hover:underline font-semibold"
                            >
                              Dispute this violation with Municipal Admin
                            </button>
                          )}
                        </div>
                      )}

                      {v.status === 'Disputed' && (
                        <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg font-medium">
                          Dispute filed with Admin: "{v.disputeReason}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fines and Payments Records */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>Municipal Fine Payments</span>
              </h3>

              {myFines.length === 0 ? (
                <p className="text-xs text-slate-500">No fines issued.</p>
              ) : (
                <div className="space-y-3">
                  {myFines.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-sm text-slate-900">₹{f.amount}.00</span>
                        <p className="text-slate-500 text-[11px]">Issued: {f.issuedAt}</p>
                        {f.paidAt && (
                          <p className="text-emerald-600 font-medium text-[11px]">
                            Paid on: {f.paidAt}
                          </p>
                        )}
                      </div>

                      {f.status === 'Pending' ? (
                        <button
                          onClick={() => handleOpenPayment(f)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                        >
                          Pay Online
                        </button>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                          ✓ Paid & Cleared
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Customer Bottom Navigation Bar (Mandated: Home | Schedule | Track Worker | Complaints | Notifications | Profile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/90 py-1.5 px-3 z-30 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
              activeTab === 'home' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.home}</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
              activeTab === 'schedule' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.schedule}</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
              activeTab === 'track' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Navigation className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.trackWorker}</span>
          </button>

          <button
            onClick={() => setActiveTab('complaints')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
              activeTab === 'complaints' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.complaints}</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors relative ${
              activeTab === 'notifications' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bell className="w-5 h-5" />
            {mySms.length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
            <span className="text-[10px] mt-0.5">{t.notifications}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
              activeTab === 'profile' ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">{t.profile}</span>
          </button>
        </div>
      </nav>

      {/* Payment Modal */}
      {selectedFine && (
        <PaymentModal
          fine={selectedFine}
          isOpen={isPaymentOpen}
          onClose={() => {
            setIsPaymentOpen(false);
            setSelectedFine(null);
          }}
        />
      )}

      {/* Missed Collection Modal */}
      <MissedCollectionModal
        isOpen={isMissedCollectionOpen}
        onClose={() => setIsMissedCollectionOpen(false)}
      />
    </div>
  );
};
