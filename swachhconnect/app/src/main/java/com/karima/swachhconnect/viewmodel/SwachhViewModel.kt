package com.karima.swachhconnect.viewmodel

import androidx.lifecycle.ViewModel
import com.karima.swachhconnect.data.SwachhRepository
import com.karima.swachhconnect.model.*
import kotlinx.coroutines.flow.StateFlow

class SwachhViewModel(
    val repository: SwachhRepository = SwachhRepository()
) : ViewModel() {

    val currentRole: StateFlow<Role> = repository.currentRole
    val currentLanguage: StateFlow<Language> = repository.currentLanguage
    val customer: StateFlow<Customer> = repository.customer
    val worker: StateFlow<Worker> = repository.worker
    val households: StateFlow<List<Household>> = repository.households
    val violations: StateFlow<List<Violation>> = repository.violations
    val grievances: StateFlow<List<Grievance>> = repository.grievances
    val smsOutbox: StateFlow<List<SMSNotification>> = repository.smsOutbox

    fun setRole(role: Role) = repository.setRole(role)
    fun setLanguage(language: Language) = repository.setLanguage(language)
    fun toggleRoute() = repository.toggleRoute()
    fun markHouseholdCollected(id: String) = repository.markHouseholdCollected(id)
    fun flagImproperSegregation(id: String, reason: String, photoUrl: String? = null) =
        repository.flagImproperSegregation(id, reason, photoUrl)
    fun payFine(violationId: String, method: String) = repository.payFine(violationId, method)
    fun submitGrievance(category: String, description: String) = repository.submitGrievance(category, description)
    fun adminAuditViolation(id: String, approve: Boolean) = repository.adminAuditViolation(id, approve)
    fun adminResolveGrievance(id: String, note: String) = repository.adminResolveGrievance(id, note)
    fun refreshOtp() = repository.refreshOtp()

    // Bilingual String Localizer Helper
    fun tr(en: String, ta: String): String {
        return if (currentLanguage.value == Language.TAMIL) ta else en
    }
}
