package com.karima.swachhconnect.data

import com.karima.swachhconnect.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.*

class SwachhRepository {

    private val _currentRole = MutableStateFlow(Role.CUSTOMER)
    val currentRole: StateFlow<Role> = _currentRole.asStateFlow()

    private val _currentLanguage = MutableStateFlow(Language.ENGLISH)
    val currentLanguage: StateFlow<Language> = _currentLanguage.asStateFlow()

    private val _customer = MutableStateFlow(
        Customer(
            id = "CUST-104",
            name = "Ramesh Kumar",
            phone = "+91 98401 23456",
            houseNumber = "14/B",
            street = "Anna Nagar 2nd Avenue",
            ward = "Ward 14 (Central Zone)",
            pinCode = "600040",
            otp = "4821",
            segregationScore = 92,
            todayStatus = PickupStatus.PENDING,
            assignedWorkerId = "WRK-001",
            scheduledTimeSlot = "07:30 AM - 08:30 AM",
            violationsCount = 1,
            activeFineAmount = 0.0
        )
    )
    val customer: StateFlow<Customer> = _customer.asStateFlow()

    private val _worker = MutableStateFlow(
        Worker(
            id = "WRK-001",
            name = "Murugan K",
            employeeId = "MUNI-SAN-2024-88",
            phone = "+91 98409 87654",
            ward = "Ward 14 (Anna Nagar)",
            vehicleNumber = "TN-01-AB-1234",
            isRouteActive = true,
            totalAssigned = 28,
            completedCount = 19,
            flaggedCount = 2,
            incentiveBalance = 320.0, // 40% of cleared fines
            currentLat = 13.0850,
            currentLng = 80.2101
        )
    )
    val worker: StateFlow<Worker> = _worker.asStateFlow()

    private val _households = MutableStateFlow(
        listOf(
            Household("H-101", "12/A", "S. Anandan", "+91 98401 11001", "Anna Nagar 1st Cross", PickupStatus.COLLECTED, "07:00 AM", 13.0841, 80.2090),
            Household("H-102", "12/B", "Priya Sundaram", "+91 98401 11002", "Anna Nagar 1st Cross", PickupStatus.COLLECTED, "07:15 AM", 13.0844, 80.2094),
            Household("H-103", "14/A", "Mohammed Farooq", "+91 98401 11003", "Anna Nagar 2nd Avenue", PickupStatus.COLLECTED, "07:30 AM", 13.0848, 80.2098),
            Household("H-104", "14/B", "Ramesh Kumar (You)", "+91 98401 23456", "Anna Nagar 2nd Avenue", PickupStatus.PENDING, "07:45 AM", 13.0852, 80.2104),
            Household("H-105", "16/A", "Kavitha R", "+91 98401 11005", "Anna Nagar 3rd Main Rd", PickupStatus.FLAGGED_IMPROPER, "08:00 AM", 13.0856, 80.2110, isSegregated = false, photoEvidenceUrl = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400", violationReason = "Mixed sanitary & wet food waste in green bin"),
            Household("H-106", "16/B", "G. Balaji", "+91 98401 11006", "Anna Nagar 3rd Main Rd", PickupStatus.PENDING, "08:15 AM", 13.0860, 80.2115),
            Household("H-107", "18/A", "Sunita Nair", "+91 98401 11007", "Anna Nagar 4th Avenue", PickupStatus.PENDING, "08:30 AM", 13.0865, 80.2120),
            Household("H-108", "18/B", "V. Krishnan", "+91 98401 11008", "Anna Nagar 4th Avenue", PickupStatus.PENDING, "08:45 AM", 13.0870, 80.2125)
        )
    )
    val households: StateFlow<List<Household>> = _households.asStateFlow()

    private val _violations = MutableStateFlow(
        listOf(
            Violation(
                id = "VIO-2024-0901",
                householdId = "H-104",
                residentName = "Ramesh Kumar",
                houseNumber = "14/B",
                ward = "Ward 14",
                date = "2026-09-02",
                time = "07:48 AM",
                tier = ViolationTier.WARNING_1,
                reason = "Plastic wrappers mixed inside organic wet waste bin",
                fineAmount = 0.0,
                isPaid = true,
                photoUrl = "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=400",
                auditedByAdmin = true,
                approved = true,
                reportingWorkerId = "WRK-001"
            ),
            Violation(
                id = "VIO-2024-0908",
                householdId = "H-105",
                residentName = "Kavitha R",
                houseNumber = "16/A",
                ward = "Ward 14",
                date = "2026-09-08",
                time = "08:05 AM",
                tier = ViolationTier.FINE_TIER_3,
                reason = "Unsegregated medical waste & batteries dumped in bio bin",
                fineAmount = 100.0,
                isPaid = false,
                photoUrl = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
                auditedByAdmin = true,
                approved = true,
                reportingWorkerId = "WRK-001"
            )
        )
    )
    val violations: StateFlow<List<Violation>> = _violations.asStateFlow()

    private val _grievances = MutableStateFlow(
        listOf(
            Grievance(
                id = "GRV-1001",
                customerId = "CUST-104",
                customerName = "Ramesh Kumar",
                houseNumber = "14/B",
                date = "2026-09-05",
                category = "Delayed Collection",
                description = "Truck arrived 45 minutes past the scheduled window on Monday morning.",
                status = "RESOLVED",
                resolutionNote = "Driver vehicle flat tyre resolved; route realigned."
            )
        )
    )
    val grievances: StateFlow<List<Grievance>> = _grievances.asStateFlow()

    private val _smsOutbox = MutableStateFlow(
        listOf(
            SMSNotification(
                id = "SMS-001",
                toPhone = "+91 98401 23456",
                recipientName = "Ramesh Kumar (14/B)",
                message = "[SWACHH-TN] Warning 1: Unsegregated dry plastic detected in wet bin on 02-Sep. Please segregate wet/dry waste to prevent municipal penalty under Bylaw 44A.",
                timestamp = "02-Sep 08:12 AM",
                type = "WARNING",
                status = "SENT"
            ),
            SMSNotification(
                id = "SMS-002",
                toPhone = "+91 98401 11005",
                recipientName = "Kavitha R (16/A)",
                message = "[SWACHH-TN] Notice: Repeated segregation violation at 16/A. Municipal fine of ₹100 imposed. Pay online via SwachhConnect to avoid garbage refusal: https://swachh.gov.in/p/VIO-0908",
                timestamp = "08-Sep 08:30 AM",
                type = "FINE_NOTICE",
                status = "SENT"
            )
        )
    )
    val smsOutbox: StateFlow<List<SMSNotification>> = _smsOutbox.asStateFlow()

    fun setRole(role: Role) {
        _currentRole.value = role
    }

    fun setLanguage(language: Language) {
        _currentLanguage.value = language
    }

    fun toggleRoute() {
        val current = _worker.value
        val newState = !current.isRouteActive
        _worker.value = current.copy(isRouteActive = newState)
    }

    fun markHouseholdCollected(householdId: String) {
        _households.value = _households.value.map {
            if (it.id == householdId) it.copy(status = PickupStatus.COLLECTED, isSegregated = true) else it
        }
        val current = _worker.value
        _worker.value = current.copy(completedCount = current.completedCount + 1)
        if (householdId == "H-104") {
            _customer.value = _customer.value.copy(todayStatus = PickupStatus.COLLECTED)
        }
    }

    fun flagImproperSegregation(householdId: String, reason: String, photoUrl: String?) {
        val target = _households.value.find { it.id == householdId } ?: return
        _households.value = _households.value.map {
            if (it.id == householdId) it.copy(
                status = PickupStatus.FLAGGED_IMPROPER,
                isSegregated = false,
                photoEvidenceUrl = photoUrl ?: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
                violationReason = reason
            ) else it
        }

        val currentW = _worker.value
        _worker.value = currentW.copy(flaggedCount = currentW.flaggedCount + 1)

        // Count previous violations for this household
        val previousCount = _violations.value.count { it.householdId == householdId }
        val newCount = previousCount + 1
        val tier = when (newCount) {
            1 -> ViolationTier.WARNING_1
            2 -> ViolationTier.WARNING_2
            else -> ViolationTier.FINE_TIER_3
        }
        val fineAmount = if (tier == ViolationTier.FINE_TIER_3) 100.0 else 0.0

        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val timeFormat = SimpleDateFormat("hh:mm a", Locale.getDefault())
        val now = Date()

        val newViolation = Violation(
            id = "VIO-${System.currentTimeMillis() % 100000}",
            householdId = householdId,
            residentName = target.residentName,
            houseNumber = target.houseNumber,
            ward = "Ward 14",
            date = dateFormat.format(now),
            time = timeFormat.format(now),
            tier = tier,
            reason = reason,
            fineAmount = fineAmount,
            isPaid = false,
            photoUrl = photoUrl ?: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400",
            auditedByAdmin = false,
            approved = false,
            reportingWorkerId = currentW.id
        )
        _violations.value = listOf(newViolation) + _violations.value

        // Dispatch SMS
        val smsText = when (tier) {
            ViolationTier.WARNING_1 -> "[SWACHH-TN] Warning 1: Unsegregated waste flagged at ${target.houseNumber}. Reason: $reason. No fine charged. Please segregate wet/dry properly."
            ViolationTier.WARNING_2 -> "[SWACHH-TN] Urgent Warning 2: Improper segregation flagged at ${target.houseNumber}. Final warning before ₹100 fine imposition under Bylaw 44A."
            ViolationTier.FINE_TIER_3 -> "[SWACHH-TN] Penalty Notice: Tier 3 repeated segregation violation at ${target.houseNumber}. ₹100 Fine imposed. Pay online: https://swachh.gov.in/p/${newViolation.id}"
        }
        val sms = SMSNotification(
            id = "SMS-${System.currentTimeMillis() % 10000}",
            toPhone = target.phone,
            recipientName = "${target.residentName} (${target.houseNumber})",
            message = smsText,
            timestamp = "Today ${timeFormat.format(now)}",
            type = if (tier == ViolationTier.FINE_TIER_3) "FINE_NOTICE" else "WARNING",
            status = "SENT"
        )
        _smsOutbox.value = listOf(sms) + _smsOutbox.value

        if (householdId == "H-104") {
            _customer.value = _customer.value.copy(
                todayStatus = PickupStatus.FLAGGED_IMPROPER,
                violationsCount = _customer.value.violationsCount + 1,
                activeFineAmount = _customer.value.activeFineAmount + fineAmount
            )
        }
    }

    fun payFine(violationId: String, paymentMode: String): Boolean {
        var workerIdToCredit: String? = null
        var fineAmountPaid = 0.0

        _violations.value = _violations.value.map {
            if (it.id == violationId && !it.isPaid) {
                workerIdToCredit = it.reportingWorkerId
                fineAmountPaid = it.fineAmount
                it.copy(isPaid = true)
            } else it
        }

        // Automatic 40% incentive transfer to the reporting sanitation worker!
        if (fineAmountPaid > 0.0) {
            val incentiveCredit = fineAmountPaid * 0.40 // 40% = ₹40 for ₹100 fine
            val w = _worker.value
            _worker.value = w.copy(incentiveBalance = w.incentiveBalance + incentiveCredit)

            // Update customer active fines
            val c = _customer.value
            val remaining = (c.activeFineAmount - fineAmountPaid).coerceAtLeast(0.0)
            _customer.value = c.copy(activeFineAmount = remaining)

            // Dispatch SMS Receipt
            val sms = SMSNotification(
                id = "SMS-${System.currentTimeMillis() % 10000}",
                toPhone = c.phone,
                recipientName = c.name,
                message = "[SWACHH-TN] Payment Success: ₹${fineAmountPaid.toInt()} municipal fine cleared via $paymentMode. Ref: SWACHH-PAY-${System.currentTimeMillis() % 100000}. ₹${incentiveCredit.toInt()} credited to sanitation champion Murugan K.",
                timestamp = "Just now",
                type = "PAYMENT",
                status = "SENT"
            )
            _smsOutbox.value = listOf(sms) + _smsOutbox.value
            return true
        }
        return false
    }

    fun submitGrievance(category: String, description: String) {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        val c = _customer.value
        val g = Grievance(
            id = "GRV-${System.currentTimeMillis() % 10000}",
            customerId = c.id,
            customerName = c.name,
            houseNumber = c.houseNumber,
            date = dateFormat.format(Date()),
            category = category,
            description = description,
            status = "PENDING"
        )
        _grievances.value = listOf(g) + _grievances.value
    }

    fun adminAuditViolation(violationId: String, approve: Boolean) {
        _violations.value = _violations.value.map {
            if (it.id == violationId) it.copy(auditedByAdmin = true, approved = approve) else it
        }
    }

    fun adminResolveGrievance(grievanceId: String, note: String) {
        _grievances.value = _grievances.value.map {
            if (it.id == grievanceId) it.copy(status = "RESOLVED", resolutionNote = note) else it
        }
    }

    fun refreshOtp(): String {
        val newOtp = (1000..9999).random().toString()
        _customer.value = _customer.value.copy(otp = newOtp)
        return newOtp
    }
}
