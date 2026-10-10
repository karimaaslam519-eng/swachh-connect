export const MYSQL_SCHEMA_DDL = `-- SwachhConnect Relational MySQL Database DDL
-- Engine: InnoDB, Charset: utf8mb4, Collation: utf8mb4_unicode_ci

CREATE DATABASE IF NOT EXISTS swachhconnect_db;
USE swachhconnect_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    role ENUM('CUSTOMER', 'WORKER', 'ADMIN') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,
    avatar_url VARCHAR(255) NULL,
    preferred_language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_mobile (mobile)
) ENGINE=InnoDB;

-- 2. Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id VARCHAR(36) PRIMARY KEY,
    house_number VARCHAR(100) NOT NULL,
    street VARCHAR(150) NOT NULL,
    area VARCHAR(100) NOT NULL,
    ward VARCHAR(50) NOT NULL,
    city VARCHAR(80) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ward (ward)
) ENGINE=InnoDB;

-- 3. Routes Table
CREATE TABLE IF NOT EXISTS routes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    ward VARCHAR(50) NOT NULL,
    total_households INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Workers Table
CREATE TABLE IF NOT EXISTS workers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    worker_code VARCHAR(30) UNIQUE NOT NULL,
    vehicle_number VARCHAR(40) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    assigned_ward VARCHAR(50) NOT NULL,
    assigned_route_id VARCHAR(36) NULL,
    is_route_active BOOLEAN DEFAULT FALSE,
    current_latitude DECIMAL(10, 7) NULL,
    current_longitude DECIMAL(10, 7) NULL,
    last_location_update TIMESTAMP NULL,
    incentive_balance DECIMAL(10, 2) DEFAULT 0.00,
    pending_incentives DECIMAL(10, 2) DEFAULT 0.00,
    paid_incentives DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_route_id) REFERENCES routes(id) ON DELETE SET NULL,
    INDEX idx_worker_route (assigned_route_id),
    INDEX idx_worker_active (is_route_active)
) ENGINE=InnoDB;

-- 5. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    address_id VARCHAR(36) NOT NULL,
    violation_count INT DEFAULT 0,
    current_status ENUM('Clean Record', 'Warning 1 Issued', 'Warning 2 Issued', 'Fine Pending', 'Fine Paid', 'Disputed') DEFAULT 'Clean Record',
    assigned_worker_id VARCHAR(36) NULL,
    assigned_route_id VARCHAR(36) NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_worker_id) REFERENCES workers(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_route_id) REFERENCES routes(id) ON DELETE SET NULL,
    INDEX idx_customer_worker (assigned_worker_id)
) ENGINE=InnoDB;

-- 6. Pickup Schedules Table
CREATE TABLE IF NOT EXISTS pickup_schedules (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    worker_id VARCHAR(36) NOT NULL,
    collection_days VARCHAR(255) NOT NULL, -- JSON or comma separated e.g. 'Mon,Wed,Fri'
    waste_type VARCHAR(50) NOT NULL,
    expected_time VARCHAR(50) NOT NULL,
    today_status ENUM('Scheduled', 'In-Progress', 'Collected', 'Segregation Issue', 'Missed') DEFAULT 'Scheduled',
    last_collected_at TIMESTAMP NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE RESTRICT,
    INDEX idx_sched_customer (customer_id)
) ENGINE=InnoDB;

-- 7. Collections Table
CREATE TABLE IF NOT EXISTS collections (
    id VARCHAR(36) PRIMARY KEY,
    schedule_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    worker_id VARCHAR(36) NOT NULL,
    status ENUM('Collected', 'Improperly Segregated', 'Pending', 'Missed') NOT NULL,
    segregation_quality ENUM('Proper', 'Improper') NOT NULL,
    waste_category VARCHAR(50) NOT NULL,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT NULL,
    FOREIGN KEY (schedule_id) REFERENCES pickup_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 8. Waste Violation Reports Table
CREATE TABLE IF NOT EXISTS waste_violation_reports (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    worker_id VARCHAR(36) NOT NULL,
    proof_image_url VARCHAR(500) NOT NULL,
    reason ENUM('Wet and dry waste mixed', 'Plastic mixed with organic waste', 'Improper segregation', 'Hazardous/Medical waste mixed', 'Other') NOT NULL,
    remarks TEXT NULL,
    status ENUM('Under Review', 'Warning 1 Issued', 'Warning 2 Issued', 'Fine Pending', 'Fine Paid', 'Disputed', 'Rejected') DEFAULT 'Under Review',
    admin_remarks TEXT NULL,
    reviewed_at TIMESTAMP NULL,
    dispute_reason TEXT NULL,
    disputed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE RESTRICT,
    INDEX idx_violation_status (status)
) ENGINE=InnoDB;

-- 9. Warnings Table
CREATE TABLE IF NOT EXISTS warnings (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    report_id VARCHAR(36) NOT NULL,
    warning_level TINYINT NOT NULL CHECK (warning_level IN (1, 2)),
    reason TEXT NOT NULL,
    sms_status ENUM('Sent', 'Pending', 'Failed') DEFAULT 'Sent',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (report_id) REFERENCES waste_violation_reports(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. Fines Table
CREATE TABLE IF NOT EXISTS fines (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    report_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) DEFAULT 100.00,
    status ENUM('Pending', 'Paid', 'Disputed', 'Cancelled') DEFAULT 'Pending',
    sms_status ENUM('Sent', 'Pending', 'Failed') DEFAULT 'Sent',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (report_id) REFERENCES waste_violation_reports(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(36) PRIMARY KEY,
    fine_id VARCHAR(36) UNIQUE NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    method ENUM('UPI', 'Card', 'Net Banking') NOT NULL,
    transaction_id VARCHAR(80) UNIQUE NOT NULL,
    receipt_number VARCHAR(80) UNIQUE NOT NULL,
    status ENUM('Success', 'Processing', 'Failed') DEFAULT 'Success',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fine_id) REFERENCES fines(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 12. Worker Incentives Table
CREATE TABLE IF NOT EXISTS worker_incentives (
    id VARCHAR(36) PRIMARY KEY,
    worker_id VARCHAR(36) NOT NULL,
    fine_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    percentage DECIMAL(5, 2) DEFAULT 40.00,
    status ENUM('Pending', 'Approved', 'Paid') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE RESTRICT,
    FOREIGN KEY (fine_id) REFERENCES fines(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 13. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL,
    schedule_id VARCHAR(36) NOT NULL,
    missed_date DATE NOT NULL,
    reason VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    photo_url VARCHAR(500) NULL,
    status ENUM('Submitted', 'Under Review', 'Resolved') DEFAULT 'Submitted',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    resolution_note TEXT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (schedule_id) REFERENCES pickup_schedules(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 14. Notifications & SMS Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    recipient_mobile VARCHAR(15) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status ENUM('Sent', 'Pending', 'Failed') DEFAULT 'Sent',
    gateway VARCHAR(100) DEFAULT 'Fast2SMS Gateway',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sms_mobile (recipient_mobile)
) ENGINE=InnoDB;

-- 15. Location Tracking Records Table
CREATE TABLE IF NOT EXISTS location_tracking_records (
    id VARCHAR(36) PRIMARY KEY,
    worker_id VARCHAR(36) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    speed_kmh DECIMAL(5, 2) NULL,
    is_route_active BOOLEAN DEFAULT TRUE,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    INDEX idx_tracking_worker (worker_id, recorded_at)
) ENGINE=InnoDB;
`;

export const SPRING_BOOT_CONTROLLER_SPEC = `
/**
 * SwachhConnect - Spring Boot 3.x REST API Architecture
 * Package: com.swachhconnect.api.controller
 */

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class SwachhConnectApiController {

    // 1. Authentication & OTP
    @PostMapping("/auth/otp/send")
    public ResponseEntity<OtpResponse> sendOtp(@Valid @RequestBody OtpRequest request);

    @PostMapping("/auth/otp/verify")
    public ResponseEntity<AuthTokenResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request);

    // 2. Customer APIs
    @GetMapping("/customers/{id}/dashboard")
    public ResponseEntity<CustomerDashboardDTO> getCustomerDashboard(@PathVariable String id);

    @GetMapping("/customers/{id}/schedule")
    public ResponseEntity<PickupScheduleDTO> getSchedule(@PathVariable String id);

    @GetMapping("/customers/{id}/worker/live-location")
    public ResponseEntity<WorkerLiveLocationDTO> getWorkerLiveLocation(@PathVariable String id);

    @PostMapping("/complaints/missed-pickup")
    public ResponseEntity<ComplaintDTO> fileMissedCollectionComplaint(
        @RequestPart("complaint") ComplaintRequest request,
        @RequestPart(value = "proofPhoto", required = false) MultipartFile proofPhoto);

    // 3. Worker Operations & Route Tracking
    @GetMapping("/workers/{id}/route")
    public ResponseEntity<WorkerRouteDTO> getAssignedRoute(@PathVariable String id);

    @PostMapping("/workers/{id}/route/start")
    public ResponseEntity<StatusResponse> startRoute(@PathVariable String id);

    @PostMapping("/workers/{id}/route/end")
    public ResponseEntity<StatusResponse> endRoute(@PathVariable String id);

    @PostMapping("/workers/{id}/location/update")
    public ResponseEntity<StatusResponse> updateGpsLocation(
        @PathVariable String id, @RequestBody GpsCoordinateDTO coords);

    @PostMapping("/collections/mark")
    public ResponseEntity<CollectionRecordDTO> markCollection(@RequestBody CollectionActionRequest request);

    @PostMapping("/violations/report")
    public ResponseEntity<ViolationReportDTO> reportImproperSegregation(
        @RequestPart("report") ViolationReportRequest request,
        @RequestPart("evidencePhoto") MultipartFile evidencePhoto);

    // 4. Admin Verification & Enforcement
    @GetMapping("/admin/dashboard-stats")
    public ResponseEntity<AdminDashboardStatsDTO> getAdminDashboardStats();

    @PostMapping("/admin/violations/{id}/approve")
    public ResponseEntity<ViolationApprovalResultDTO> approveViolation(
        @PathVariable String id, @RequestBody AdminAuditRequest request);

    @PostMapping("/admin/violations/{id}/reject")
    public ResponseEntity<StatusResponse> rejectViolation(
        @PathVariable String id, @RequestBody AdminAuditRequest request);

    @PostMapping("/admin/complaints/{id}/resolve")
    public ResponseEntity<StatusResponse> resolveComplaint(
        @PathVariable String id, @RequestBody ComplaintResolutionRequest request);

    // 5. Payment Gateway (₹100 Fine)
    @PostMapping("/payments/fines/{fineId}/checkout")
    public ResponseEntity<PaymentOrderResponse> createPaymentOrder(@PathVariable String fineId);

    @PostMapping("/payments/verify-signature")
    public ResponseEntity<PaymentReceiptDTO> verifyAndCloseFine(@RequestBody PaymentCallbackDTO callback);

    // 6. Worker Incentives
    @GetMapping("/workers/{id}/incentives")
    public ResponseEntity<IncentiveHistoryDTO> getWorkerIncentives(@PathVariable String id);
}
`;

export const SPRING_BOOT_ENDPOINTS = SPRING_BOOT_CONTROLLER_SPEC;

