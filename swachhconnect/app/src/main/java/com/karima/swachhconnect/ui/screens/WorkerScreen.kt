package com.karima.swachhconnect.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.karima.swachhconnect.model.Household
import com.karima.swachhconnect.model.PickupStatus
import com.karima.swachhconnect.theme.*
import com.karima.swachhconnect.viewmodel.SwachhViewModel

@Composable
fun WorkerScreen(viewModel: SwachhViewModel, selectedTab: Int = 0) {
    val worker by viewModel.worker.collectAsState()
    val households by viewModel.households.collectAsState()

    var flaggingHousehold by remember { mutableStateOf<Household?>(null) }
    var violationReason by remember { mutableStateOf("Wet & Dry Mixed in Green Bin") }
    var violationNotes by remember { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // 1. Worker Profile & Route Toggle Header
        if (selectedTab == 0) {
            item {
                Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = PureWhite),
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "${worker.name} • ${worker.employeeId}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = Slate900
                            )
                            Text(
                                text = "${worker.ward} • ${worker.vehicleNumber}",
                                fontSize = 11.sp,
                                color = Slate500
                            )
                        }

                        // Route Status Indicator
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (worker.isRouteActive) Emerald100 else Slate200
                        ) {
                            Text(
                                text = if (worker.isRouteActive) "ROUTE ACTIVE" else "OFF DUTY",
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (worker.isRouteActive) Emerald800 else Slate600
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Start/End Route Big Button
                    Button(
                        onClick = { viewModel.toggleRoute() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (worker.isRouteActive) Red600 else Emerald600
                        )
                    ) {
                        Icon(
                            if (worker.isRouteActive) Icons.Default.Stop else Icons.Default.PlayArrow,
                            contentDescription = null,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (worker.isRouteActive)
                                viewModel.tr("End Collection Route", "சேகரிப்பு பயணத்தை முடிக்கவும்")
                            else
                                viewModel.tr("Start Collection Route", "சேகரிப்பு பயணத்தைத் தொடங்கவும்"),
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Privacy Safeguard Notice
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Slate100,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(modifier = Modifier.padding(8.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Shield, contentDescription = null, tint = Emerald700, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = viewModel.tr(
                                    "Privacy Safeguard: Worker GPS coordinates are strictly broadcasted only during active route duty hours.",
                                    "தனியுரிமை பாதுகாப்பு: பணி நேரத்தில் மட்டுமே GPS இருப்பிடம் கண்காணிக்கப்படுகிறது."
                                ),
                                fontSize = 10.sp,
                                color = Slate600,
                                lineHeight = 13.sp
                            )
                        }
                    }
                }
            }
        } // end of if (selectedTab == 0)

        // 2. 40% Incentive Accrual Card
        if (selectedTab == 2 || selectedTab == 0) {
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Emerald50),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Emerald100),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = viewModel.tr("My Segregation Incentive Balance", "எனது ஊக்கத்தொகை இருப்பு"),
                                fontSize = 11.sp,
                                color = Emerald900,
                                fontWeight = FontWeight.Medium
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "₹${worker.incentiveBalance.toInt()}.00",
                                fontSize = 22.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Emerald800
                            )
                            Text(
                                text = viewModel.tr(
                                    "40% directly credited on each municipal fine clearance",
                                    "அபராதம் செலுத்தப்பட்டதும் 40% நேரடி வரவு"
                                ),
                                fontSize = 10.sp,
                                color = Emerald700
                            )
                        }

                        Box(
                            modifier = Modifier
                                .size(46.dp)
                                .clip(CircleShape)
                                .background(Emerald600),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Payments, contentDescription = null, tint = PureWhite, modifier = Modifier.size(24.dp))
                        }
                    }
                }
            }
        }

        // 3. Ward Household Collection Queue
        if (selectedTab == 1 || selectedTab == 0) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = viewModel.tr(
                            "Assigned Households (${worker.completedCount}/${worker.totalAssigned})",
                            "ஒதுக்கப்பட்ட வீடுகள் (${worker.completedCount}/${worker.totalAssigned})"
                        ),
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Slate900
                    )
                    Text(
                        text = "${worker.flaggedCount} Flagged",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Red600
                    )
                }
            }

            // Household items
            items(households) { item ->
            Card(
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = PureWhite),
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    when (item.status) {
                        PickupStatus.COLLECTED -> Emerald500
                        PickupStatus.FLAGGED_IMPROPER -> Red600
                        PickupStatus.PENDING -> Slate200
                    }
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(32.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(
                                        when (item.status) {
                                            PickupStatus.COLLECTED -> Emerald100
                                            PickupStatus.FLAGGED_IMPROPER -> Red100
                                            PickupStatus.PENDING -> Slate100
                                        }
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    item.houseNumber,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 11.sp,
                                    color = when (item.status) {
                                        PickupStatus.COLLECTED -> Emerald800
                                        PickupStatus.FLAGGED_IMPROPER -> Red700
                                        PickupStatus.PENDING -> Slate700
                                    }
                                )
                            }
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(item.residentName, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Slate900)
                                Text("${item.address} • Slot: ${item.timeSlot}", fontSize = 10.sp, color = Slate500)
                            }
                        }

                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = when (item.status) {
                                PickupStatus.COLLECTED -> Emerald100
                                PickupStatus.FLAGGED_IMPROPER -> Red100
                                PickupStatus.PENDING -> Sky100
                            }
                        ) {
                            Text(
                                text = when (item.status) {
                                    PickupStatus.COLLECTED -> viewModel.tr("Collected", "பெறப்பட்டது")
                                    PickupStatus.FLAGGED_IMPROPER -> viewModel.tr("Flagged", "புகாரானது")
                                    PickupStatus.PENDING -> viewModel.tr("Pending", "நிலுவை")
                                },
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = when (item.status) {
                                    PickupStatus.COLLECTED -> Emerald800
                                    PickupStatus.FLAGGED_IMPROPER -> Red700
                                    PickupStatus.PENDING -> Sky700
                                }
                            )
                        }
                    }

                    if (item.status == PickupStatus.PENDING) {
                        Spacer(modifier = Modifier.height(12.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            // 1-Tap Mark Collected
                            Button(
                                onClick = { viewModel.markHouseholdCollected(item.id) },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(44.dp),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                            ) {
                                Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    viewModel.tr("1. Collected", "1. கழிவு பெறப்பட்டது"),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            // Flag Improper Segregation Button
                            OutlinedButton(
                                onClick = { flaggingHousehold = item },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(44.dp),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.outlinedButtonColors(containerColor = Amber50),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Amber600)
                            ) {
                                Icon(Icons.Default.Warning, contentDescription = null, tint = Amber700, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    viewModel.tr("2. Flag Segregation", "2. தவறான பிரிப்பு"),
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Amber700
                                )
                            }
                        }
                    } else if (item.status == PickupStatus.FLAGGED_IMPROPER) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            "Flagged: ${item.violationReason ?: "Improper segregation"}",
                            fontSize = 10.sp,
                            color = Red600
                        )
                    }
                }
            }
        }
    } // end of if (selectedTab == 1 || selectedTab == 0)

    // Modal Dialog: Flagging Improper Segregation with Mandatory Photo Proof
    if (flaggingHousehold != null) {
        val target = flaggingHousehold!!
        AlertDialog(
            onDismissRequest = { flaggingHousehold = null },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.CameraAlt, contentDescription = null, tint = Amber600)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        viewModel.tr("Flag Segregation Violation", "கழிவு பிரிப்பு மீறல் பதிவு"),
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        "Doorstep: ${target.houseNumber} (${target.residentName})",
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        color = Slate800
                    )
                    Text(
                        viewModel.tr(
                            "Worker reports flag households for municipal audit and never directly impose fines.",
                            "பணியாளர் பதிவு செய்யும் மீறல்கள் நகராட்சி ஆய்வுக்குப் பிறகே உறுதி செய்யப்படும்."
                        ),
                        fontSize = 10.sp,
                        color = Slate500,
                        lineHeight = 13.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(viewModel.tr("Violation Category", "மீறல் வகை"), fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    listOf(
                        "Wet & Dry Mixed in Green Bin",
                        "Sanitary / Medical Waste Unwrapped",
                        "Plastic & Metal Dumped in Organic Bio-Waste"
                    ).forEach { r ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(vertical = 1.dp)
                        ) {
                            RadioButton(
                                selected = violationReason == r,
                                onClick = { violationReason = r },
                                colors = RadioButtonDefaults.colors(selectedColor = Amber600)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(r, fontSize = 11.sp, color = Slate800)
                        }
                    }

                    // Mandatory Photo Evidence Capture Box
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Slate100,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Slate300),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(64.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.Center
                        ) {
                            Icon(Icons.Default.CameraAlt, contentDescription = null, tint = Slate600)
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text("Photo Evidence Captured", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = Slate800)
                                Text("Evidence-VIO-${target.houseNumber}.jpg (Geo-tagged)", fontSize = 9.sp, color = Slate500)
                            }
                        }
                    }

                    OutlinedTextField(
                        value = violationNotes,
                        onValueChange = { violationNotes = it },
                        label = { Text(viewModel.tr("Optional Worker Remarks", "கூடுதல் குறிப்பு")) },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 2
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.flagImproperSegregation(target.id, violationReason)
                        flaggingHousehold = null
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Amber600)
                ) {
                    Text(viewModel.tr("Submit for Municipal Audit", "ஆய்வுக்கு அனுப்பு"))
                }
            },
            dismissButton = {
                TextButton(onClick = { flaggingHousehold = null }) {
                    Text(viewModel.tr("Cancel", "ரத்து"))
                }
            }
        )
    }
}
