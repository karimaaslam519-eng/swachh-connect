export type UserRole = 'customer' | 'worker' | 'admin';
export type AppLanguage = 'en' | 'ta';

export interface Address {
  id: string;
  houseNumber: string;
  street: string;
  area: string;
  ward: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  mobile: string;
  email?: string;
  avatar: string;
  addressId?: string;
  ward?: string;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  address: Address;
  violationCount: number; // 0, 1, 2, 3+
  currentStatus: 'Clean Record' | 'Warning 1 Issued' | 'Warning 2 Issued' | 'Fine Pending' | 'Fine Paid' | 'Disputed';
  assignedWorkerId: string;
  assignedRouteId: string;
}

export interface Worker {
  id: string;
  userId: string;
  name: string;
  mobile: string;
  workerCode: string;
  vehicleNumber: string;
  rating: number;
  assignedWard: string;
  assignedRouteId: string;
  isRouteActive: boolean;
  currentLatitude: number;
  currentLongitude: number;
  lastLocationUpdate: string;
  incentiveBalance: number;
  pendingIncentives: number;
  paidIncentives: number;
}

export interface Waypoint {
  id: string;
  householdId: string;
  householdName: string;
  address: string;
  latitude: number;
  longitude: number;
  order: number;
  isCollected: boolean;
  hasViolation: boolean;
}

export interface RouteItem {
  id: string;
  name: string;
  ward: string;
  totalHouseholds: number;
  waypoints: Waypoint[];
}

export interface PickupSchedule {
  id: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  collectionDays: string[]; // e.g. ['Mon', 'Wed', 'Fri']
  wasteType: 'Wet Waste' | 'Dry Waste' | 'Segregated (Both)';
  expectedTime: string; // e.g. '07:30 AM - 08:30 AM'
  todayStatus: 'Scheduled' | 'In-Progress' | 'Collected' | 'Segregation Issue' | 'Missed';
  lastCollectedAt?: string;
}

export interface CollectionRecord {
  id: string;
  scheduleId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  householdAddress: string;
  status: 'Collected' | 'Improperly Segregated' | 'Pending' | 'Missed';
  segregationQuality: 'Proper' | 'Improper';
  wasteCategory: 'Wet Waste' | 'Dry Waste' | 'Both Segregated';
  collectedAt?: string;
  remarks?: string;
}

export type ViolationReason = 
  | 'Wet and dry waste mixed'
  | 'Plastic mixed with organic waste'
  | 'Improper segregation'
  | 'Hazardous/Medical waste mixed'
  | 'Other';

export interface WasteViolationReport {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  workerId: string;
  workerName: string;
  householdAddress: string;
  reportedAt: string;
  proofImageUrl: string;
  reason: ViolationReason;
  remarks: string;
  status: 'Under Review' | 'Warning 1 Issued' | 'Warning 2 Issued' | 'Fine Pending' | 'Fine Paid' | 'Disputed' | 'Rejected';
  adminRemarks?: string;
  reviewedAt?: string;
  disputeReason?: string;
  disputedAt?: string;
  resultingFineId?: string;
}

export interface WarningRecord {
  id: string;
  customerId: string;
  customerName: string;
  reportId: string;
  warningLevel: 1 | 2;
  issuedAt: string;
  reason: string;
  smsStatus: 'Sent' | 'Pending' | 'Failed';
}

export interface FineRecord {
  id: string;
  customerId: string;
  customerName: string;
  reportId: string;
  amount: number; // default ₹100
  issuedAt: string;
  status: 'Pending' | 'Paid' | 'Disputed' | 'Cancelled';
  smsStatus: 'Sent' | 'Pending' | 'Failed';
  paymentId?: string;
  paidAt?: string;
  disputeNote?: string;
}

export interface PaymentRecord {
  id: string;
  fineId: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: 'UPI' | 'Card' | 'Net Banking';
  upiApp?: string;
  transactionId: string;
  status: 'Success' | 'Processing' | 'Failed';
  timestamp: string;
  receiptNumber: string;
}

export interface WorkerIncentiveRecord {
  id: string;
  workerId: string;
  workerName: string;
  fineId: string;
  customerName: string;
  amount: number; // e.g. ₹40
  percentage: number; // e.g. 40%
  status: 'Pending' | 'Approved' | 'Paid';
  createdAt: string;
  paidAt?: string;
}

export interface ComplaintRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  scheduleId: string;
  missedDate: string;
  reason: string;
  description: string;
  photoUrl?: string;
  status: 'Submitted' | 'Under Review' | 'Resolved';
  submittedAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface SMSLog {
  id: string;
  recipientMobile: string;
  recipientName: string;
  message: string;
  type: 'Warning 1' | 'Warning 2' | 'Fine Notice' | 'Pickup Update' | 'Complaint Update' | 'OTP' | 'Payment Receipt';
  status: 'Sent' | 'Pending' | 'Failed';
  gateway: string;
  sentAt: string;
}

export interface SystemConfig {
  fineAmount: number;
  incentivePercentage: number;
  smsProvider: 'Fast2SMS' | 'Twilio' | 'MSG91';
  smsApiKey: string;
  cloudStorageBucket: string;
  allowDisputes: boolean;
}
