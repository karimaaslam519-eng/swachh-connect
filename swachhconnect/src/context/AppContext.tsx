import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  AppLanguage,
  Customer,
  Worker,
  RouteItem,
  PickupSchedule,
  CollectionRecord,
  WasteViolationReport,
  WarningRecord,
  FineRecord,
  PaymentRecord,
  WorkerIncentiveRecord,
  ComplaintRecord,
  SMSLog,
  SystemConfig,
  ViolationReason,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_WORKERS,
  INITIAL_ROUTES,
  INITIAL_SCHEDULES,
  INITIAL_VIOLATIONS,
  INITIAL_WARNINGS,
  INITIAL_FINES,
  INITIAL_PAYMENTS,
  INITIAL_INCENTIVES,
  INITIAL_COMPLAINTS,
  INITIAL_SMS_LOGS,
  INITIAL_CONFIG,
} from '../data/initialData';
import { translations } from '../locales';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: typeof translations['en'];
  
  // Auth
  isLoggedIn: boolean;
  currentUser: any;
  loginWithOtp: (mobile: string, otp: string, role: UserRole) => boolean;
  quickSwitchUser: (role: UserRole, targetId?: string) => void;
  logout: () => void;
  registerCustomer: (name: string, mobile: string, houseNumber: string, street: string, area: string) => void;

  // Data
  customers: Customer[];
  workers: Worker[];
  routes: RouteItem[];
  schedules: PickupSchedule[];
  collections: CollectionRecord[];
  violations: WasteViolationReport[];
  warnings: WarningRecord[];
  fines: FineRecord[];
  payments: PaymentRecord[];
  incentives: WorkerIncentiveRecord[];
  complaints: ComplaintRecord[];
  smsLogs: SMSLog[];
  config: SystemConfig;

  // Actions
  startWorkerRoute: (workerId: string) => void;
  endWorkerRoute: (workerId: string) => void;
  updateWorkerGps: (workerId: string, lat: number, lng: number) => void;
  markWasteCollected: (scheduleId: string, customerId: string, workerId: string, notes?: string) => void;
  reportImproperSegregation: (
    customerId: string, 
    workerId: string, 
    reason: ViolationReason, 
    remarks: string, 
    proofImageUrl: string
  ) => void;
  adminApproveViolation: (reportId: string, adminRemarks: string) => void;
  adminRejectViolation: (reportId: string, adminRemarks: string) => void;
  disputeViolation: (reportId: string, disputeReason: string) => void;
  payFine: (fineId: string, method: 'UPI' | 'Card' | 'Net Banking', upiApp?: string) => Promise<boolean>;
  fileComplaint: (
    customerId: string, 
    scheduleId: string, 
    missedDate: string, 
    reason: string, 
    description: string, 
    photoUrl?: string
  ) => void;
  adminResolveComplaint: (complaintId: string, resolutionNote: string) => void;
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  resetDemoData: () => void;
  activeWorkerId: string;
  activeCustomerId: string;
  setActiveCustomerId: (id: string) => void;
  isSimulatingGps: boolean;
  toggleSimulateGps: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeCustomerId, setActiveCustomerId] = useState<string>('cust-1');
  const [activeWorkerId] = useState<string>('work-1');
  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(true);

  // Core Relational Tables
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [routes] = useState<RouteItem[]>(INITIAL_ROUTES);
  const [schedules, setSchedules] = useState<PickupSchedule[]>(INITIAL_SCHEDULES);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [violations, setViolations] = useState<WasteViolationReport[]>(INITIAL_VIOLATIONS);
  const [warnings, setWarnings] = useState<WarningRecord[]>(INITIAL_WARNINGS);
  const [fines, setFines] = useState<FineRecord[]>(INITIAL_FINES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [incentives, setIncentives] = useState<WorkerIncentiveRecord[]>(INITIAL_INCENTIVES);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(INITIAL_COMPLAINTS);
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>(INITIAL_SMS_LOGS);
  const [config, setConfig] = useState<SystemConfig>(INITIAL_CONFIG);

  const t = translations[language];

  // Current logged in user profile derived
  const currentUser = React.useMemo(() => {
    if (role === 'customer') {
      return customers.find(c => c.id === activeCustomerId) || customers[0];
    } else if (role === 'worker') {
      return workers.find(w => w.id === activeWorkerId) || workers[0];
    } else {
      return {
        id: 'admin-1',
        name: 'Rajan IAS',
        title: 'Commissioner & Special Officer',
        ward: 'Greater Chennai Corporation HQ',
        mobile: '9444000001',
        role: 'admin'
      };
    }
  }, [role, activeCustomerId, activeWorkerId, customers, workers]);

  // Simulated GPS movement along Anna Nagar Route 12-A when worker is active
  useEffect(() => {
    if (!isSimulatingGps) return;
    
    // Smooth loop through waypoints
    const activeWorker = workers.find(w => w.id === activeWorkerId);
    if (!activeWorker || !activeWorker.isRouteActive) return;

    const route = routes[0];
    if (!route) return;

    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % route.waypoints.length;
      const targetWaypoint = route.waypoints[step];
      const jitterLat = (Math.random() - 0.5) * 0.0003;
      const jitterLng = (Math.random() - 0.5) * 0.0003;

      setWorkers(prev => prev.map(w => {
        if (w.id === activeWorkerId) {
          return {
            ...w,
            currentLatitude: targetWaypoint.latitude + jitterLat,
            currentLongitude: targetWaypoint.longitude + jitterLng,
            lastLocationUpdate: `Live GPS active • Near ${targetWaypoint.householdName}`
          };
        }
        return w;
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulatingGps, activeWorkerId, workers, routes]);

  const toggleSimulateGps = () => {
    setIsSimulatingGps(prev => !prev);
  };

  const loginWithOtp = (mobile: string, otp: string, selectedRole: UserRole): boolean => {
    if (otp === '123456' || otp.length === 6) {
      setRole(selectedRole);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const quickSwitchUser = (targetRole: UserRole, targetId?: string) => {
    setRole(targetRole);
    setIsLoggedIn(true);
    if (targetRole === 'customer') {
      if (targetId) setActiveCustomerId(targetId);
      else setActiveCustomerId('cust-1');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const registerCustomer = (name: string, mobile: string, houseNumber: string, street: string, area: string) => {
    const newId = `cust-${Date.now().toString().slice(-4)}`;
    const newAddress = {
      id: `addr-${Date.now().toString().slice(-4)}`,
      houseNumber,
      street,
      area,
      ward: 'Ward 12',
      city: 'Chennai',
      pincode: '600040',
      latitude: 13.0865 + (Math.random() - 0.5) * 0.004,
      longitude: 80.2110 + (Math.random() - 0.5) * 0.004
    };

    const newCustomer: Customer = {
      id: newId,
      userId: `user-${newId}`,
      name,
      mobile,
      address: newAddress,
      violationCount: 0,
      currentStatus: 'Clean Record',
      assignedWorkerId: 'work-1',
      assignedRouteId: 'route-1'
    };

    setCustomers(prev => [newCustomer, ...prev]);
    setActiveCustomerId(newId);
    setRole('customer');
    setIsLoggedIn(true);

    // Create initial schedule
    const newSched: PickupSchedule = {
      id: `sched-${newId}`,
      customerId: newId,
      customerName: name,
      workerId: 'work-1',
      workerName: 'Selvam K.',
      collectionDays: ['Monday', 'Wednesday', 'Friday'],
      wasteType: 'Segregated (Both)',
      expectedTime: '08:00 AM - 08:45 AM',
      todayStatus: 'Scheduled'
    };
    setSchedules(prev => [newSched, ...prev]);

    // Send SMS
    const welcomeSms: SMSLog = {
      id: `sms-${Date.now()}`,
      recipientMobile: mobile,
      recipientName: name,
      message: `[SwachhConnect] Welcome ${name}! Registered for doorstep waste collection at ${houseNumber}, ${street}. Assigned Sanitation Champion: Selvam K.`,
      type: 'Pickup Update',
      status: 'Sent',
      gateway: config.smsProvider,
      sentAt: 'Just now'
    };
    setSmsLogs(prev => [welcomeSms, ...prev]);
  };

  const startWorkerRoute = (workerId: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          isRouteActive: true,
          lastLocationUpdate: 'Route started • Live GPS active'
        };
      }
      return w;
    }));
  };

  const endWorkerRoute = (workerId: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          isRouteActive: false,
          lastLocationUpdate: 'Route completed • GPS stopped'
        };
      }
      return w;
    }));
  };

  const updateWorkerGps = (workerId: string, lat: number, lng: number) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return {
          ...w,
          currentLatitude: lat,
          currentLongitude: lng,
          lastLocationUpdate: 'Real GPS lock verified'
        };
      }
      return w;
    }));
  };

  const markWasteCollected = (scheduleId: string, customerId: string, workerId: string, notes?: string) => {
    const cust = customers.find(c => c.id === customerId);
    const worker = workers.find(w => w.id === workerId);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSchedules(prev => prev.map(s => {
      if (s.id === scheduleId) {
        return {
          ...s,
          todayStatus: 'Collected',
          lastCollectedAt: `Today at ${nowStr}`
        };
      }
      return s;
    }));

    const newRecord: CollectionRecord = {
      id: `col-${Date.now()}`,
      scheduleId,
      customerId,
      customerName: cust?.name || 'Resident',
      workerId,
      householdAddress: cust?.address.street || 'Address',
      status: 'Collected',
      segregationQuality: 'Proper',
      wasteCategory: 'Both Segregated',
      collectedAt: `Today at ${nowStr}`,
      remarks: notes || 'Properly segregated wet and dry waste collected.'
    };
    setCollections(prev => [newRecord, ...prev]);
  };

  // WORKER REPORT: MUST NOT DIRECTLY FINE! SENDS TO ADMIN FOR VERIFICATION
  const reportImproperSegregation = (
    customerId: string,
    workerId: string,
    reason: ViolationReason,
    remarks: string,
    proofImageUrl: string
  ) => {
    const cust = customers.find(c => c.id === customerId);
    const worker = workers.find(w => w.id === workerId);
    const reportId = `viol-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toLocaleString();

    const newReport: WasteViolationReport = {
      id: reportId,
      customerId,
      customerName: cust?.name || 'Resident',
      customerMobile: cust?.mobile || '9999999999',
      workerId,
      workerName: worker?.name || 'Sanitation Worker',
      householdAddress: cust ? `${cust.address.houseNumber}, ${cust.address.street}` : 'Ward 12',
      reportedAt: nowStr,
      proofImageUrl,
      reason,
      remarks,
      status: 'Under Review' // Strictly Under Review until Municipal Admin approves!
    };

    setViolations(prev => [newReport, ...prev]);

    // Update schedule today status to 'Segregation Issue'
    setSchedules(prev => prev.map(s => {
      if (s.customerId === customerId) {
        return { ...s, todayStatus: 'Segregation Issue' };
      }
      return s;
    }));
  };

  // ADMIN APPROVES REPORT -> DETERMINES WARNING 1, WARNING 2, OR ₹100 FINE
  const adminApproveViolation = (reportId: string, adminRemarks: string) => {
    const report = violations.find(v => v.id === reportId);
    if (!report) return;

    const cust = customers.find(c => c.id === report.customerId);
    if (!cust) return;

    const nextViolationCount = cust.violationCount + 1;
    const nowStr = new Date().toLocaleString();

    let newReportStatus: WasteViolationReport['status'] = 'Warning 1 Issued';
    let newCustStatus: Customer['currentStatus'] = 'Warning 1 Issued';

    if (nextViolationCount === 1) {
      newReportStatus = 'Warning 1 Issued';
      newCustStatus = 'Warning 1 Issued';

      // Record Warning
      const warnRec: WarningRecord = {
        id: `warn-${Date.now()}`,
        customerId: cust.id,
        customerName: cust.name,
        reportId: report.id,
        warningLevel: 1,
        issuedAt: nowStr,
        reason: `${report.reason}: ${report.remarks || 'Segregation failure observed'}`,
        smsStatus: 'Sent'
      };
      setWarnings(prev => [warnRec, ...prev]);

      // Send SMS
      const sms: SMSLog = {
        id: `sms-${Date.now()}`,
        recipientMobile: cust.mobile,
        recipientName: cust.name,
        message: `[SwachhConnect - Greater Chennai Corporation] NOTICE: Waste Segregation Warning 1 issued for ${cust.address.houseNumber}. Segregate wet/dry waste into separate bins.`,
        type: 'Warning 1',
        status: 'Sent',
        gateway: config.smsProvider,
        sentAt: 'Just now'
      };
      setSmsLogs(prev => [sms, ...prev]);

    } else if (nextViolationCount === 2) {
      newReportStatus = 'Warning 2 Issued';
      newCustStatus = 'Warning 2 Issued';

      // Record Warning 2
      const warnRec: WarningRecord = {
        id: `warn-${Date.now()}`,
        customerId: cust.id,
        customerName: cust.name,
        reportId: report.id,
        warningLevel: 2,
        issuedAt: nowStr,
        reason: `Second Notice: ${report.reason}. Next violation will impose a ₹100 fine.`,
        smsStatus: 'Sent'
      };
      setWarnings(prev => [warnRec, ...prev]);

      // Send SMS
      const sms: SMSLog = {
        id: `sms-${Date.now()}`,
        recipientMobile: cust.mobile,
        recipientName: cust.name,
        message: `[SwachhConnect] URGENT: Warning 2 issued for ${cust.address.houseNumber}. Repeated segregation violation detected. A 3rd violation will incur an immediate ₹100 fine.`,
        type: 'Warning 2',
        status: 'Sent',
        gateway: config.smsProvider,
        sentAt: 'Just now'
      };
      setSmsLogs(prev => [sms, ...prev]);

    } else {
      // 3rd or subsequent violation -> ₹100 Fine imposed!
      newReportStatus = 'Fine Pending';
      newCustStatus = 'Fine Pending';

      const fineId = `fine-${Date.now().toString().slice(-4)}`;
      const newFine: FineRecord = {
        id: fineId,
        customerId: cust.id,
        customerName: cust.name,
        reportId: report.id,
        amount: config.fineAmount,
        issuedAt: nowStr,
        status: 'Pending',
        smsStatus: 'Sent'
      };
      setFines(prev => [newFine, ...prev]);

      // Link fineId in report
      report.resultingFineId = fineId;

      // Pending Worker incentive record created (will be credited when customer pays!)
      const workerIncentiveAmount = (config.fineAmount * config.incentivePercentage) / 100;
      const newIncentive: WorkerIncentiveRecord = {
        id: `inc-${Date.now()}`,
        workerId: report.workerId,
        workerName: report.workerName,
        fineId: fineId,
        customerName: cust.name,
        amount: workerIncentiveAmount,
        percentage: config.incentivePercentage,
        status: 'Pending',
        createdAt: nowStr
      };
      setIncentives(prev => [newIncentive, ...prev]);

      // Send Fine SMS with Payment link
      const sms: SMSLog = {
        id: `sms-${Date.now()}`,
        recipientMobile: cust.mobile,
        recipientName: cust.name,
        message: `[SwachhConnect] MUNICIPAL PENALTY: 3rd segregation violation verified for ${cust.address.houseNumber}. ₹${config.fineAmount} fine imposed. Pay securely via SwachhConnect app to avoid sanitation disruption.`,
        type: 'Fine Notice',
        status: 'Sent',
        gateway: config.smsProvider,
        sentAt: 'Just now'
      };
      setSmsLogs(prev => [sms, ...prev]);
    }

    // Update Customer record
    setCustomers(prev => prev.map(c => {
      if (c.id === cust.id) {
        return {
          ...c,
          violationCount: nextViolationCount,
          currentStatus: newCustStatus
        };
      }
      return c;
    }));

    // Update Report record
    setViolations(prev => prev.map(v => {
      if (v.id === reportId) {
        return {
          ...v,
          status: newReportStatus,
          adminRemarks: adminRemarks || 'Approved after visual audit of evidence photograph.',
          reviewedAt: nowStr
        };
      }
      return v;
    }));
  };

  // ADMIN REJECTS REPORT -> Does NOT increase violation count
  const adminRejectViolation = (reportId: string, adminRemarks: string) => {
    const nowStr = new Date().toLocaleString();
    setViolations(prev => prev.map(v => {
      if (v.id === reportId) {
        return {
          ...v,
          status: 'Rejected',
          adminRemarks: adminRemarks || 'Rejected: Insufficient proof or ambiguous evidence.',
          reviewedAt: nowStr
        };
      }
      return v;
    }));
  };

  const disputeViolation = (reportId: string, disputeReason: string) => {
    const nowStr = new Date().toLocaleString();
    setViolations(prev => prev.map(v => {
      if (v.id === reportId) {
        return {
          ...v,
          status: 'Disputed',
          disputeReason,
          disputedAt: nowStr
        };
      }
      return v;
    }));

    setCustomers(prev => prev.map(c => {
      const isCust = violations.find(v => v.id === reportId)?.customerId === c.id;
      if (isCust) {
        return { ...c, currentStatus: 'Disputed' };
      }
      return c;
    }));
  };

  // ONLINE PAYMENT FOR ₹100 FINE
  const payFine = async (fineId: string, method: 'UPI' | 'Card' | 'Net Banking', upiApp?: string): Promise<boolean> => {
    const fine = fines.find(f => f.id === fineId);
    if (!fine) return false;

    const cust = customers.find(c => c.id === fine.customerId);
    const nowStr = new Date().toLocaleString();
    const txnId = `TXN-SWC-${Date.now().toString().slice(-8)}`;
    const receiptNum = `REC-TN-CHN-${Date.now().toString().slice(-6)}`;

    // Create Payment record
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      fineId,
      customerId: fine.customerId,
      customerName: cust?.name || 'Citizen',
      amount: fine.amount,
      method,
      upiApp,
      transactionId: txnId,
      status: 'Success',
      timestamp: nowStr,
      receiptNumber: receiptNum
    };
    setPayments(prev => [newPayment, ...prev]);

    // Update Fine record
    setFines(prev => prev.map(f => {
      if (f.id === fineId) {
        return {
          ...f,
          status: 'Paid',
          paidAt: nowStr,
          paymentId: newPayment.id
        };
      }
      return f;
    }));

    // Update Customer record
    setCustomers(prev => prev.map(c => {
      if (c.id === fine.customerId) {
        return {
          ...c,
          currentStatus: 'Fine Paid'
        };
      }
      return c;
    }));

    // Automatically credit Worker Incentive
    setIncentives(prev => prev.map(inc => {
      if (inc.fineId === fineId) {
        return {
          ...inc,
          status: 'Approved',
          paidAt: nowStr
        };
      }
      return inc;
    }));

    // Update Worker balance
    const relatedInc = incentives.find(inc => inc.fineId === fineId);
    if (relatedInc) {
      setWorkers(prev => prev.map(w => {
        if (w.id === relatedInc.workerId) {
          return {
            ...w,
            incentiveBalance: w.incentiveBalance + relatedInc.amount,
            pendingIncentives: Math.max(0, w.pendingIncentives - relatedInc.amount),
            paidIncentives: w.paidIncentives + relatedInc.amount
          };
        }
        return w;
      }));

      // Send SMS to worker regarding incentive credit
      const workerSms: SMSLog = {
        id: `sms-${Date.now() + 1}`,
        recipientMobile: workers.find(w => w.id === relatedInc.workerId)?.mobile || '',
        recipientName: relatedInc.workerName,
        message: `[SwachhConnect Staff] Great news! Citizen has cleared fine #${fineId}. Your segregation incentive of ₹${relatedInc.amount} is approved and credited.`,
        type: 'Payment Receipt',
        status: 'Sent',
        gateway: 'Staff SMS Gateway',
        sentAt: 'Just now'
      };
      setSmsLogs(prev => [workerSms, ...prev]);
    }

    // Send Payment confirmation SMS to citizen
    if (cust) {
      const citizenSms: SMSLog = {
        id: `sms-${Date.now()}`,
        recipientMobile: cust.mobile,
        recipientName: cust.name,
        message: `[SwachhConnect] PAYMENT SUCCESSFUL: ₹${fine.amount} fine received for receipt ${receiptNum}. Thank you for supporting clean waste segregation in Chennai.`,
        type: 'Payment Receipt',
        status: 'Sent',
        gateway: config.smsProvider,
        sentAt: 'Just now'
      };
      setSmsLogs(prev => [citizenSms, ...prev]);
    }

    // Celebrate with confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore in iframe
    }

    return true;
  };

  const fileComplaint = (
    customerId: string,
    scheduleId: string,
    missedDate: string,
    reason: string,
    description: string,
    photoUrl?: string
  ) => {
    const cust = customers.find(c => c.id === customerId);
    const nowStr = new Date().toLocaleString();
    const compId = `comp-${Date.now().toString().slice(-4)}`;

    const newComp: ComplaintRecord = {
      id: compId,
      customerId,
      customerName: cust?.name || 'Resident',
      customerMobile: cust?.mobile || '9999999999',
      scheduleId,
      missedDate,
      reason,
      description,
      photoUrl,
      status: 'Submitted',
      submittedAt: nowStr
    };

    setComplaints(prev => [newComp, ...prev]);

    // Send acknowledgement SMS
    if (cust) {
      const ackSms: SMSLog = {
        id: `sms-${Date.now()}`,
        recipientMobile: cust.mobile,
        recipientName: cust.name,
        message: `[SwachhConnect] Grievance #${compId} received for missed pickup on ${missedDate}. Zonal Officer is reviewing. Tracking ID: ${compId}`,
        type: 'Complaint Update',
        status: 'Sent',
        gateway: config.smsProvider,
        sentAt: 'Just now'
      };
      setSmsLogs(prev => [ackSms, ...prev]);
    }
  };

  const adminResolveComplaint = (complaintId: string, resolutionNote: string) => {
    const nowStr = new Date().toLocaleString();
    const comp = complaints.find(c => c.id === complaintId);

    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status: 'Resolved',
          resolvedAt: nowStr,
          resolutionNote
        };
      }
      return c;
    }));

    if (comp) {
      const resSms: SMSLog = {
        id: `sms-${Date.now()}`,
        recipientMobile: comp.customerMobile,
        recipientName: comp.customerName,
        message: `[SwachhConnect] Grievance #${complaintId} resolved: "${resolutionNote}". Thank you for helping keep our city clean.`,
        type: 'Complaint Update',
        status: 'Sent',
        gateway: config.smsProvider,
        sentAt: 'Just now'
      };
      setSmsLogs(prev => [resSms, ...prev]);
    }
  };

  const updateConfig = (newConfig: Partial<SystemConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetDemoData = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setWorkers(INITIAL_WORKERS);
    setSchedules(INITIAL_SCHEDULES);
    setViolations(INITIAL_VIOLATIONS);
    setWarnings(INITIAL_WARNINGS);
    setFines(INITIAL_FINES);
    setPayments(INITIAL_PAYMENTS);
    setIncentives(INITIAL_INCENTIVES);
    setComplaints(INITIAL_COMPLAINTS);
    setSmsLogs(INITIAL_SMS_LOGS);
    setConfig(INITIAL_CONFIG);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        t,
        isLoggedIn,
        currentUser,
        loginWithOtp,
        quickSwitchUser,
        logout,
        registerCustomer,
        customers,
        workers,
        routes,
        schedules,
        collections,
        violations,
        warnings,
        fines,
        payments,
        incentives,
        complaints,
        smsLogs,
        config,
        startWorkerRoute,
        endWorkerRoute,
        updateWorkerGps,
        markWasteCollected,
        reportImproperSegregation,
        adminApproveViolation,
        adminRejectViolation,
        disputeViolation,
        payFine,
        fileComplaint,
        adminResolveComplaint,
        updateConfig,
        resetDemoData,
        activeWorkerId,
        activeCustomerId,
        setActiveCustomerId,
        isSimulatingGps,
        toggleSimulateGps,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
