package com.karima.swachhconnect.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(val route: String, val enTitle: String, val taTitle: String, val icon: ImageVector) {
    // Customer Screens
    object CustomerHome : Screen("customer_home", "Today", "இன்று", Icons.Default.Home)
    object CustomerTrack : Screen("customer_track", "Track Worker", "கண்காணி", Icons.Default.LocationOn)
    object CustomerComplaints : Screen("customer_complaints", "Grievance", "புகார்", Icons.Default.ReportProblem)
    object CustomerFines : Screen("customer_fines", "Fines & Notices", "அபராதங்கள்", Icons.Default.ReceiptLong)

    // Worker Screens
    object WorkerRoute : Screen("worker_route", "Route", "பாதை", Icons.Default.AltRoute)
    object WorkerDoorsteps : Screen("worker_doorsteps", "Doorsteps", "வாசல்கள்", Icons.Default.FormatListNumbered)
    object WorkerIncentives : Screen("worker_incentives", "Incentives", "ஊக்கத்தொகை", Icons.Default.Payments)

    // Admin Screens
    object AdminDashboard : Screen("admin_dashboard", "Dashboard", "முகப்பு", Icons.Default.Dashboard)
    object AdminAudits : Screen("admin_audits", "Audit Queue", "ஆய்வு", Icons.Default.FactCheck)
    object AdminGrievances : Screen("admin_grievances", "Grievances", "புகார்கள்", Icons.Default.SupportAgent)
    object AdminLedger : Screen("admin_ledger", "Fine & Share", "வரவு செலவு", Icons.Default.AccountBalance)
}

val CustomerNavItems = listOf(
    Screen.CustomerHome,
    Screen.CustomerTrack,
    Screen.CustomerComplaints,
    Screen.CustomerFines
)

val WorkerNavItems = listOf(
    Screen.WorkerRoute,
    Screen.WorkerDoorsteps,
    Screen.WorkerIncentives
)

val AdminNavItems = listOf(
    Screen.AdminDashboard,
    Screen.AdminAudits,
    Screen.AdminGrievances,
    Screen.AdminLedger
)
