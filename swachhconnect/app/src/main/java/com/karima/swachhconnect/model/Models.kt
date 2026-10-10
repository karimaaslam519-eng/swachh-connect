package com.karima.swachhconnect.model

enum class Role {
    CUSTOMER,
    WORKER,
    ADMIN
}

enum class Language(val code: String, val displayName: String) {
    ENGLISH("en", "English"),
    TAMIL("ta", "தமிழ்")
}

enum class PickupStatus {
    PENDING,
    COLLECTED,
    FLAGGED_IMPROPER
}

data class Customer(
    val id: String,
    val name: String,
    val phone: String,
    val houseNumber: String,
    val street: String,
    val ward: String,
    val pinCode: String,
    val otp: String,
    val segregationScore: Int, // e.g. 94 out of 100
    val todayStatus: PickupStatus,
    val assignedWorkerId: String,
    val scheduledTimeSlot: String,
    val violationsCount: Int,
    val activeFineAmount: Double
)

data class Worker(
    val id: String,
    val name: String,
    val employeeId: String,
    val phone: String,
    val ward: String,
    val vehicleNumber: String,
    val isRouteActive: Boolean,
    val totalAssigned: Int,
    val completedCount: Int,
    val flaggedCount: Int,
    val incentiveBalance: Double,
    val currentLat: Double,
    val currentLng: Double
)

data class Household(
    val id: String,
    val houseNumber: String,
    val residentName: String,
    val phone: String,
    val address: String,
    val status: PickupStatus,
    val timeSlot: String,
    val lat: Double,
    val lng: Double,
    val isSegregated: Boolean = true,
    val photoEvidenceUrl: String? = null,
    val violationReason: String? = null,
    val audited: Boolean = false
)

enum class ViolationTier {
    WARNING_1,
    WARNING_2,
    FINE_TIER_3
}

data class Violation(
    val id: String,
    val householdId: String,
    val residentName: String,
    val houseNumber: String,
    val ward: String,
    val date: String,
    val time: String,
    val tier: ViolationTier,
    val reason: String,
    val fineAmount: Double,
    val isPaid: Boolean,
    val photoUrl: String,
    val auditedByAdmin: Boolean,
    val approved: Boolean,
    val reportingWorkerId: String
)

data class Grievance(
    val id: String,
    val customerId: String,
    val customerName: String,
    val houseNumber: String,
    val date: String,
    val category: String,
    val description: String,
    val status: String, // "PENDING", "IN_PROGRESS", "RESOLVED"
    val resolutionNote: String? = null
)

data class SMSNotification(
    val id: String,
    val toPhone: String,
    val recipientName: String,
    val message: String,
    val timestamp: String,
    val type: String, // "WARNING", "FINE_NOTICE", "OTP", "GRIEVANCE"
    val status: String // "SENT", "PENDING"
)

data class AdminKPIs(
    val totalHouseholds: Int,
    val activeWorkers: Int,
    val scheduledPickups: Int,
    val completedPickups: Int,
    val missedPickups: Int,
    val totalViolations: Int,
    val pendingAudits: Int,
    val warningsIssued: Int,
    val finesCollected: Double,
    val workerIncentivesPaid: Double,
    val activeGrievances: Int
)
