package com.karima.swachhconnect.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.karima.swachhconnect.model.Grievance
import com.karima.swachhconnect.model.Violation
import com.karima.swachhconnect.model.ViolationTier
import com.karima.swachhconnect.theme.*
import com.karima.swachhconnect.viewmodel.SwachhViewModel

@Composable
fun AdminScreen(viewModel: SwachhViewModel, selectedTab: Int = 0) {
    val worker by viewModel.worker.collectAsState()
    val households by viewModel.households.collectAsState()
    val violations by viewModel.violations.collectAsState()
    val grievances by viewModel.grievances.collectAsState()

    val pendingAudits = violations.filter { !it.auditedByAdmin }
    val completedPickups = households.count { it.status == com.karima.swachhconnect.model.PickupStatus.COLLECTED }
    val totalViolationsCount = violations.size
    val warningsCount = violations.count { it.tier != ViolationTier.FINE_TIER_3 }
    val finesCollected = violations.filter { it.isPaid }.sumOf { it.fineAmount }
    val workerIncentives = finesCollected * 0.40

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // 1. Municipal Command Header
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = PureWhite),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        viewModel.tr("Municipal Solid Waste Command Center", "நகராட்சி கழிவு மேலாண்மை கட்டளை மையம்"),
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = Slate900
                    )
                    Text(
                        "Greater Chennai Corporation • Central Zone (Ward 14)",
                        fontSize = 11.sp,
                        color = Slate500
                    )
                }
            }
        }

        // 2. 11 KPI Metrics Grid/Scroll
        if (selectedTab == 0) {
            item {
                Text(
                    viewModel.tr("Key Performance Indicators (11 KPIs)", "முக்கிய செயல்திறன் குறிகாட்டிகள் (11 KPIs)"),
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Slate900
                )
            }

            item {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        KpiCard(Modifier.weight(1f), "Households", households.size.toString(), Emerald700, Emerald50)
                        KpiCard(Modifier.weight(1f), "Active Workers", if (worker.isRouteActive) "1 Online" else "0", Sky700, Sky50)
                        KpiCard(Modifier.weight(1f), "Pickups Done", completedPickups.toString(), Emerald700, Emerald50)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        KpiCard(Modifier.weight(1f), "Missed", "0", Slate700, Slate100)
                        KpiCard(Modifier.weight(1f), "Violations", totalViolationsCount.toString(), Amber700, Amber50)
                        KpiCard(Modifier.weight(1f), "Pending Audit", pendingAudits.size.toString(), Red700, Red50)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        KpiCard(Modifier.weight(1f), "Warnings", warningsCount.toString(), Amber700, Amber50)
                        KpiCard(Modifier.weight(1f), "Fines Paid", "₹${finesCollected.toInt()}", Emerald700, Emerald50)
                        KpiCard(Modifier.weight(1f), "Worker 40%", "₹${workerIncentives.toInt()}", Emerald700, Emerald100)
                    }
                }
            }
        }

        // 3. Photo Evidence Audit Queue
        if (selectedTab == 1 || selectedTab == 0) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        viewModel.tr("Photo Evidence Audit Queue", "புகைப்பட ஆய்வு வரிசை"),
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Slate900
                )
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (pendingAudits.isNotEmpty()) Red100 else Emerald100
                ) {
                    Text(
                        "${pendingAudits.size} Pending",
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (pendingAudits.isNotEmpty()) Red700 else Emerald800
                    )
                }
            }
        }

        if (pendingAudits.isEmpty()) {
            item {
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = PureWhite),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(modifier = Modifier.padding(16.dp), contentAlignment = Alignment.Center) {
                        Text(
                            viewModel.tr(
                                "All flagged doorstep reports have been audited by Municipal Authority.",
                                "அனைத்து மீறல் பதிவுகளும் நகராட்சி அதிகாரியால் ஆய்வு செய்யப்பட்டுவிட்டன."
                            ),
                            fontSize = 12.sp,
                            color = Slate500
                        )
                    }
                }
            }
        } else {
            items(pendingAudits) { auditItem ->
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = PureWhite),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Amber500),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "Doorstep: ${auditItem.houseNumber} (${auditItem.residentName})",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = Slate900
                            )
                            Text(auditItem.date, fontSize = 11.sp, color = Slate500)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            "Reported Reason: ${auditItem.reason}",
                            fontSize = 11.sp,
                            color = Slate700
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        // Photo preview container
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Slate100,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(60.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Image, contentDescription = null, tint = Slate600)
                                Spacer(modifier = Modifier.width(8.dp))
                                Column {
                                    Text("Evidence Photo Attached", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Slate800)
                                    Text("Ward 14 • Sanitation Champion Murugan K", fontSize = 10.sp, color = Slate500)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = { viewModel.adminAuditViolation(auditItem.id, true) },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(38.dp),
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                            ) {
                                Text(viewModel.tr("Approve", "ஒப்புதல் செய்"), fontSize = 11.sp)
                            }
                            OutlinedButton(
                                onClick = { viewModel.adminAuditViolation(auditItem.id, false) },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(38.dp),
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.outlinedButtonColors(containerColor = Red50),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Red600)
                            ) {
                                Text(viewModel.tr("Reject", "நிராகரி"), fontSize = 11.sp, color = Red700)
                            }
                        }
                    }
                }
            }
        } // end of if (selectedTab == 1 || selectedTab == 0)

        // TAB 2: GRIEVANCE TRACKING
        if (selectedTab == 2 || selectedTab == 0) {
            // 4. Grievance Tracking
            item {
                Text(
                    viewModel.tr("Citizen Grievance Resolution", "குடிமக்கள் புகார் தீர்வு"),
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    color = Slate900
                )
            }

            items(grievances) { grv ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = PureWhite),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                "${grv.category} • Doorstep ${grv.houseNumber}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = Slate900
                            )
                            Surface(
                                shape = RoundedCornerShape(6.dp),
                                color = if (grv.status == "RESOLVED") Emerald100 else Amber100
                            ) {
                                Text(
                                    grv.status,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (grv.status == "RESOLVED") Emerald800 else Amber800
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(grv.description, fontSize = 11.sp, color = Slate700)
                        if (grv.resolutionNote != null) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("Resolution: ${grv.resolutionNote}", fontSize = 10.sp, color = Emerald700)
                        }
                    }
                }
            }
        }

        // TAB 3: MUNICIPAL FINE & 40% WORKER INCENTIVE LEDGER
        if (selectedTab == 3 || selectedTab == 0) {
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = PureWhite),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            viewModel.tr("Municipal Revenue & 40% Payout Ledger", "நகராட்சி வருவாய் & 40% ஊக்கத்தொகை"),
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = Slate900
                        )
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("Total Fines Collected", fontSize = 11.sp, color = Slate500)
                                Text("₹${finesCollected.toInt()}.00", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Slate900)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("40% Disbursed to Worker", fontSize = 11.sp, color = Slate500)
                                Text("₹${workerIncentives.toInt()}.00", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Emerald700)
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))
                        Divider(color = Slate200)
                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            "Municipal Bylaw: 40% of collected segregation fines is automatically credited to the ward sanitation worker's registered bank account via GCC ECS. 60% is retained for ward sanitation infrastructure.",
                            fontSize = 10.sp,
                            color = Slate600,
                            lineHeight = 14.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun KpiCard(
    modifier: Modifier,
    title: String,
    value: String,
    textColor: Color,
    bgColor: Color
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = bgColor)
    ) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(title, fontSize = 10.sp, color = Slate600, maxLines = 1)
            Spacer(modifier = Modifier.height(2.dp))
            Text(value, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = textColor)
        }
    }
}
