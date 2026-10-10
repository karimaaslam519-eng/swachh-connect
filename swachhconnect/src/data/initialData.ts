import { 
  Customer, 
  Worker, 
  Address, 
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
  SystemConfig 
} from '../types';

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    houseNumber: 'Plot 104, Green Park',
    street: '2nd Cross Street, Anna Nagar West',
    area: 'Ward 12, Zone 5',
    ward: 'Ward 12',
    city: 'Chennai',
    pincode: '600040',
    latitude: 13.0862,
    longitude: 80.2105,
  },
  {
    id: 'addr-2',
    houseNumber: 'Flat 3B, Sri Maruthi Enclave',
    street: '4th Main Road, Shanthi Colony',
    area: 'Ward 12, Zone 5',
    ward: 'Ward 12',
    city: 'Chennai',
    pincode: '600040',
    latitude: 13.0885,
    longitude: 80.2142,
  },
  {
    id: 'addr-3',
    houseNumber: 'Door 18/2',
    street: 'Kambar Street, Villivakkam Road',
    area: 'Ward 12, Zone 5',
    ward: 'Ward 12',
    city: 'Chennai',
    pincode: '600049',
    latitude: 13.0911,
    longitude: 80.2178,
  },
  {
    id: 'addr-4',
    houseNumber: 'No. 52, Sivasakthi Apartments',
    street: '7th Avenue, Anna Nagar',
    area: 'Ward 12, Zone 5',
    ward: 'Ward 12',
    city: 'Chennai',
    pincode: '600040',
    latitude: 13.0839,
    longitude: 80.2118,
  },
  {
    id: 'addr-5',
    houseNumber: 'House 89',
    street: 'Sundaram Street, Thirumangalam',
    area: 'Ward 12, Zone 5',
    ward: 'Ward 12',
    city: 'Chennai',
    pincode: '600040',
    latitude: 13.0874,
    longitude: 80.2052,
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    userId: 'user-cust-1',
    name: 'Priya Sharma',
    mobile: '9840123456',
    address: INITIAL_ADDRESSES[0],
    violationCount: 2, // 2 violations so far, next violation becomes ₹100 Fine!
    currentStatus: 'Warning 2 Issued',
    assignedWorkerId: 'work-1',
    assignedRouteId: 'route-1'
  },
  {
    id: 'cust-2',
    userId: 'user-cust-2',
    name: 'R. Murugan',
    mobile: '9444087654',
    address: INITIAL_ADDRESSES[1],
    violationCount: 3,
    currentStatus: 'Fine Pending', // Has ₹100 fine to pay right now!
    assignedWorkerId: 'work-1',
    assignedRouteId: 'route-1'
  },
  {
    id: 'cust-3',
    userId: 'user-cust-3',
    name: 'Ananya Iyer',
    mobile: '9884155233',
    address: INITIAL_ADDRESSES[2],
    violationCount: 0,
    currentStatus: 'Clean Record',
    assignedWorkerId: 'work-1',
    assignedRouteId: 'route-1'
  },
  {
    id: 'cust-4',
    userId: 'user-cust-4',
    name: 'Rajesh Kumar',
    mobile: '9790214365',
    address: INITIAL_ADDRESSES[3],
    violationCount: 1,
    currentStatus: 'Warning 1 Issued',
    assignedWorkerId: 'work-1',
    assignedRouteId: 'route-1'
  },
  {
    id: 'cust-5',
    userId: 'user-cust-5',
    name: 'Kavitha Sundaram',
    mobile: '9600128945',
    address: INITIAL_ADDRESSES[4],
    violationCount: 3,
    currentStatus: 'Fine Paid',
    assignedWorkerId: 'work-1',
    assignedRouteId: 'route-1'
  }
];

export const INITIAL_WORKERS: Worker[] = [
  {
    id: 'work-1',
    userId: 'user-work-1',
    name: 'Selvam K.',
    mobile: '9841098765',
    workerCode: 'SW-CHN-1204',
    vehicleNumber: 'TN 02 BL 4892 (Battery EV Tipper)',
    rating: 4.9,
    assignedWard: 'Ward 12 (Anna Nagar)',
    assignedRouteId: 'route-1',
    isRouteActive: true,
    currentLatitude: 13.0871,
    currentLongitude: 80.2112,
    lastLocationUpdate: 'Just now (GPS active)',
    incentiveBalance: 120, // ₹120 earned so far
    pendingIncentives: 40,
    paidIncentives: 80
  },
  {
    id: 'work-2',
    userId: 'user-work-2',
    name: 'M. Venkatesh',
    mobile: '9841765432',
    workerCode: 'SW-CHN-1208',
    vehicleNumber: 'TN 02 CZ 1109 (Hydraulic Compactor)',
    rating: 4.8,
    assignedWard: 'Ward 12 (North Sector)',
    assignedRouteId: 'route-2',
    isRouteActive: false,
    currentLatitude: 13.0905,
    currentLongitude: 80.2160,
    lastLocationUpdate: '45 mins ago',
    incentiveBalance: 80,
    pendingIncentives: 0,
    paidIncentives: 80
  },
  {
    id: 'work-3',
    userId: 'user-work-3',
    name: 'Lakshmi Ammal',
    mobile: '9445123980',
    workerCode: 'SW-CHN-1215',
    vehicleNumber: 'TN 02 DK 9921 (Clean E-Cart)',
    rating: 4.95,
    assignedWard: 'Ward 12 (Market Sector)',
    assignedRouteId: 'route-1',
    isRouteActive: false,
    currentLatitude: 13.0845,
    currentLongitude: 80.2090,
    lastLocationUpdate: '2 hours ago',
    incentiveBalance: 160,
    pendingIncentives: 40,
    paidIncentives: 120
  }
];

export const INITIAL_ROUTES: RouteItem[] = [
  {
    id: 'route-1',
    name: 'Route 12-A: Anna Nagar West & Shanthi Colony',
    ward: 'Ward 12',
    totalHouseholds: 5,
    waypoints: [
      {
        id: 'wp-1',
        householdId: 'cust-1',
        householdName: 'Priya Sharma',
        address: 'Plot 104, 2nd Cross, Anna Nagar',
        latitude: 13.0862,
        longitude: 80.2105,
        order: 1,
        isCollected: true,
        hasViolation: false
      },
      {
        id: 'wp-2',
        householdId: 'cust-4',
        householdName: 'Rajesh Kumar',
        address: 'No. 52, 7th Avenue',
        latitude: 13.0839,
        longitude: 80.2118,
        order: 2,
        isCollected: true,
        hasViolation: false
      },
      {
        id: 'wp-3',
        householdId: 'cust-2',
        householdName: 'R. Murugan',
        address: 'Flat 3B, Sri Maruthi Enclave',
        latitude: 13.0885,
        longitude: 80.2142,
        order: 3,
        isCollected: false,
        hasViolation: true
      },
      {
        id: 'wp-4',
        householdId: 'cust-3',
        householdName: 'Ananya Iyer',
        address: 'Door 18/2, Kambar Street',
        latitude: 13.0911,
        longitude: 80.2178,
        order: 4,
        isCollected: false,
        hasViolation: false
      },
      {
        id: 'wp-5',
        householdId: 'cust-5',
        householdName: 'Kavitha Sundaram',
        address: 'House 89, Sundaram Street',
        latitude: 13.0874,
        longitude: 80.2052,
        order: 5,
        isCollected: false,
        hasViolation: false
      }
    ]
  }
];

export const INITIAL_SCHEDULES: PickupSchedule[] = [
  {
    id: 'sched-1',
    customerId: 'cust-1',
    customerName: 'Priya Sharma',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    collectionDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    wasteType: 'Segregated (Both)',
    expectedTime: '07:30 AM - 08:30 AM',
    todayStatus: 'Collected',
    lastCollectedAt: 'Today at 08:05 AM'
  },
  {
    id: 'sched-2',
    customerId: 'cust-2',
    customerName: 'R. Murugan',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    collectionDays: ['Daily Doorstep Collection'],
    wasteType: 'Segregated (Both)',
    expectedTime: '08:15 AM - 09:00 AM',
    todayStatus: 'Segregation Issue',
    lastCollectedAt: 'Yesterday at 08:20 AM'
  },
  {
    id: 'sched-3',
    customerId: 'cust-3',
    customerName: 'Ananya Iyer',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    collectionDays: ['Monday', 'Wednesday', 'Friday'],
    wasteType: 'Wet Waste',
    expectedTime: '08:45 AM - 09:30 AM',
    todayStatus: 'In-Progress'
  },
  {
    id: 'sched-4',
    customerId: 'cust-4',
    customerName: 'Rajesh Kumar',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    collectionDays: ['Tuesday', 'Thursday', 'Saturday'],
    wasteType: 'Dry Waste',
    expectedTime: '07:45 AM - 08:15 AM',
    todayStatus: 'Collected',
    lastCollectedAt: 'Today at 07:55 AM'
  },
  {
    id: 'sched-5',
    customerId: 'cust-5',
    customerName: 'Kavitha Sundaram',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    collectionDays: ['Daily Doorstep Collection'],
    wasteType: 'Segregated (Both)',
    expectedTime: '09:00 AM - 09:45 AM',
    todayStatus: 'Scheduled'
  }
];

// Clean base64 sample images representing proof of improper waste segregation
export const SAMPLE_EVIDENCE_IMAGES = {
  mixedBags: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
  plasticOrganic: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
  unsegregatedBins: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=600&q=80'
};

export const INITIAL_VIOLATIONS: WasteViolationReport[] = [
  {
    id: 'viol-101',
    customerId: 'cust-2',
    customerName: 'R. Murugan',
    customerMobile: '9444087654',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    householdAddress: 'Flat 3B, Sri Maruthi Enclave, Shanthi Colony',
    reportedAt: '2026-09-10 08:25 AM',
    proofImageUrl: SAMPLE_EVIDENCE_IMAGES.mixedBags,
    reason: 'Wet and dry waste mixed',
    remarks: 'Plastic carry bags and milk packets dump mixed with food waste and vegetable peels.',
    status: 'Fine Pending',
    adminRemarks: 'Verified by Municipal Zonal Officer. 3rd repeated offense recorded. ₹100 fine sanctioned under Solid Waste Management Bylaws 2016.',
    reviewedAt: '2026-09-10 10:15 AM',
    resultingFineId: 'fine-201'
  },
  {
    id: 'viol-102',
    customerId: 'cust-1',
    customerName: 'Priya Sharma',
    customerMobile: '9840123456',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    householdAddress: 'Plot 104, Green Park, 2nd Cross St, Anna Nagar',
    reportedAt: '2026-09-08 08:10 AM',
    proofImageUrl: SAMPLE_EVIDENCE_IMAGES.plasticOrganic,
    reason: 'Plastic mixed with organic waste',
    remarks: 'Single-use plastic cutlery and courier wrappers found in green wet bin.',
    status: 'Warning 2 Issued',
    adminRemarks: 'Second warning approved. Citizen notified via SMS. Next violation will incur ₹100 fine.',
    reviewedAt: '2026-09-08 11:30 AM'
  },
  {
    id: 'viol-103',
    customerId: 'cust-4',
    customerName: 'Rajesh Kumar',
    customerMobile: '9790214365',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    householdAddress: 'No. 52, 7th Avenue, Anna Nagar',
    reportedAt: '2026-09-05 07:50 AM',
    proofImageUrl: SAMPLE_EVIDENCE_IMAGES.unsegregatedBins,
    reason: 'Improper segregation',
    remarks: 'Cardboard soaked with kitchen waste, bins swapped.',
    status: 'Warning 1 Issued',
    adminRemarks: 'First advisory warning issued with waste segregation educational pamphlet.',
    reviewedAt: '2026-09-05 09:40 AM'
  },
  {
    id: 'viol-104',
    customerId: 'cust-1',
    customerName: 'Priya Sharma',
    customerMobile: '9840123456',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    householdAddress: 'Plot 104, Green Park, 2nd Cross St, Anna Nagar',
    reportedAt: '2026-09-11 07:45 AM',
    proofImageUrl: SAMPLE_EVIDENCE_IMAGES.plasticOrganic,
    reason: 'Wet and dry waste mixed',
    remarks: 'Unsegregated polythene bags left outside gate.',
    status: 'Under Review', // Waiting for admin to review right now!
    adminRemarks: undefined
  }
];

export const INITIAL_WARNINGS: WarningRecord[] = [
  {
    id: 'warn-1',
    customerId: 'cust-1',
    customerName: 'Priya Sharma',
    reportId: 'viol-prev-1',
    warningLevel: 1,
    issuedAt: '2026-08-20 10:00 AM',
    reason: 'Improper segregation: Dry recyclables placed inside wet waste bucket.',
    smsStatus: 'Sent'
  },
  {
    id: 'warn-2',
    customerId: 'cust-1',
    customerName: 'Priya Sharma',
    reportId: 'viol-102',
    warningLevel: 2,
    issuedAt: '2026-09-08 11:30 AM',
    reason: 'Second notice: Plastic cutlery mixed with kitchen waste. Please segregate strictly.',
    smsStatus: 'Sent'
  },
  {
    id: 'warn-3',
    customerId: 'cust-4',
    customerName: 'Rajesh Kumar',
    reportId: 'viol-103',
    warningLevel: 1,
    issuedAt: '2026-09-05 09:40 AM',
    reason: 'First notice: Cardboard soaked with wet waste. Keep dry waste clean and dry.',
    smsStatus: 'Sent'
  }
];

export const INITIAL_FINES: FineRecord[] = [
  {
    id: 'fine-201',
    customerId: 'cust-2',
    customerName: 'R. Murugan',
    reportId: 'viol-101',
    amount: 100,
    issuedAt: '2026-09-10 10:15 AM',
    status: 'Pending', // Pending payment!
    smsStatus: 'Sent'
  },
  {
    id: 'fine-202',
    customerId: 'cust-5',
    customerName: 'Kavitha Sundaram',
    reportId: 'viol-old-5',
    amount: 100,
    issuedAt: '2026-09-01 02:00 PM',
    status: 'Paid',
    smsStatus: 'Sent',
    paymentId: 'pay-301',
    paidAt: '2026-09-02 04:12 PM'
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-301',
    fineId: 'fine-202',
    customerId: 'cust-5',
    customerName: 'Kavitha Sundaram',
    amount: 100,
    method: 'UPI',
    upiApp: 'Google Pay',
    transactionId: 'TXN-SWC-90821948',
    status: 'Success',
    timestamp: '2026-09-02 04:12 PM',
    receiptNumber: 'REC-TN-CHN-2026-0841'
  }
];

export const INITIAL_INCENTIVES: WorkerIncentiveRecord[] = [
  {
    id: 'inc-1',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    fineId: 'fine-202',
    customerName: 'Kavitha Sundaram',
    amount: 40, // 40% of ₹100 fine
    percentage: 40,
    status: 'Paid',
    createdAt: '2026-09-02 04:15 PM',
    paidAt: '2026-09-05 10:00 AM'
  },
  {
    id: 'inc-2',
    workerId: 'work-1',
    workerName: 'Selvam K.',
    fineId: 'fine-201',
    customerName: 'R. Murugan',
    amount: 40,
    percentage: 40,
    status: 'Pending', // Will unlock when Murugan pays!
    createdAt: '2026-09-10 10:20 AM'
  },
  {
    id: 'inc-3',
    workerId: 'work-2',
    workerName: 'M. Venkatesh',
    fineId: 'fine-prior-9',
    customerName: 'S. Alagappan',
    amount: 40,
    percentage: 40,
    status: 'Paid',
    createdAt: '2026-08-28 11:30 AM',
    paidAt: '2026-09-01 10:00 AM'
  }
];

export const INITIAL_COMPLAINTS: ComplaintRecord[] = [
  {
    id: 'comp-501',
    customerId: 'cust-1',
    customerName: 'Priya Sharma',
    customerMobile: '9840123456',
    scheduleId: 'sched-1',
    missedDate: '2026-09-09',
    reason: 'Vehicle did not arrive in morning window',
    description: 'Waste bin was kept outside at 7:15 AM as instructed, but collection was missed on Wednesday.',
    photoUrl: SAMPLE_EVIDENCE_IMAGES.unsegregatedBins,
    status: 'Resolved',
    submittedAt: '2026-09-09 11:15 AM',
    resolvedAt: '2026-09-09 03:30 PM',
    resolutionNote: 'Special relief vehicle TN 02 BL 4892 dispatched; bin collected at 3:15 PM.'
  },
  {
    id: 'comp-502',
    customerId: 'cust-3',
    customerName: 'Ananya Iyer',
    customerMobile: '9884155233',
    scheduleId: 'sched-3',
    missedDate: '2026-09-11',
    reason: 'Skipped household',
    description: 'Worker passed the lane earlier without ringing bell or clearing door 18/2.',
    status: 'Under Review',
    submittedAt: '2026-09-11 08:50 AM'
  }
];

export const INITIAL_SMS_LOGS: SMSLog[] = [
  {
    id: 'sms-1',
    recipientMobile: '9840123456',
    recipientName: 'Priya Sharma',
    message: '[SwachhConnect - Greater Chennai Corporation] NOTICE: Waste Segregation Warning 1 issued for Plot 104. Please separate wet and dry waste before 8:00 AM.',
    type: 'Warning 1',
    status: 'Sent',
    gateway: 'Govt Fast2SMS Gateway (Route 4)',
    sentAt: '2026-08-20 10:01 AM'
  },
  {
    id: 'sms-2',
    recipientMobile: '9840123456',
    recipientName: 'Priya Sharma',
    message: '[SwachhConnect] URGENT: Warning 2 issued for Plot 104. Plastic found in organic waste. A 3rd repeated violation will attract an automatic ₹100 fine.',
    type: 'Warning 2',
    status: 'Sent',
    gateway: 'Govt Fast2SMS Gateway (Route 4)',
    sentAt: '2026-09-08 11:31 AM'
  },
  {
    id: 'sms-3',
    recipientMobile: '9444087654',
    recipientName: 'R. Murugan',
    message: '[SwachhConnect] MUNICIPAL PENALTY: 3rd segregation violation verified for Flat 3B. ₹100 fine imposed under Bylaws. Pay securely at: https://swachh.gov.in/p/201',
    type: 'Fine Notice',
    status: 'Sent',
    gateway: 'Govt Fast2SMS Gateway (Route 4)',
    sentAt: '2026-09-10 10:16 AM'
  },
  {
    id: 'sms-4',
    recipientMobile: '9840123456',
    recipientName: 'Priya Sharma',
    message: '[SwachhConnect] Grievance #comp-501 resolved. Special collection vehicle completed pickup. Thank you for your cooperation.',
    type: 'Complaint Update',
    status: 'Sent',
    gateway: 'Govt Fast2SMS Gateway (Route 4)',
    sentAt: '2026-09-09 03:32 PM'
  },
  {
    id: 'sms-5',
    recipientMobile: '9841098765',
    recipientName: 'Selvam K.',
    message: '[SwachhConnect Staff] Great job! ₹40 segregation incentive credited to your balance for fine #fine-202.',
    type: 'Payment Receipt',
    status: 'Sent',
    gateway: 'Staff SMS Gateway',
    sentAt: '2026-09-02 04:16 PM'
  }
];

export const INITIAL_CONFIG: SystemConfig = {
  fineAmount: 100,
  incentivePercentage: 40,
  smsProvider: 'Fast2SMS',
  smsApiKey: 'SWC_SECURE_FAST2SMS_PROD_849204',
  cloudStorageBucket: 'gs://swachhconnect-evidence-vault-chennai',
  allowDisputes: true
};
