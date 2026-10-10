package com.karima.swachhconnect.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.karima.swachhconnect.model.PickupStatus
import com.karima.swachhconnect.model.ViolationTier
import com.karima.swachhconnect.theme.*
import com.karima.swachhconnect.viewmodel.SwachhViewModel

@Composable
fun CustomerScreen(viewModel: SwachhViewModel, selectedTab: Int = 0) {
    val customer by viewModel.customer.collectAsState()
    val worker by viewModel.worker.collectAsState()
    val violations by viewModel.violations.collectAsState()
    val grievances by viewModel.grievances.collectAsState()

    var showGrievanceDialog by remember { mutableStateOf(false) }
    var showPaymentDialog by remember { mutableStateOf(false) }
    var showReceiptDialog by remember { mutableStateOf(false) }
    var selectedPaymentMode by remember { mutableStateOf("UPI") }

    val myViolations = violations.filter { it.householdId == "H-104" }
    val unpaidFine = myViolations.find { !it.isPaid && it.fineAmount > 0.0 }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Slate50)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // 0. Top Resident Household Banner (Matching AI Studio Preview)
        item {
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = Emerald700,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(PureWhite.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = customer.name.firstOrNull()?.toString() ?: "P",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = PureWhite
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = customer.name,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = PureWhite
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = Emerald500.copy(alpha = 0.3f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.4f))
                            ) {
                                Text(
                                    text = customer.ward,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald100,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Text(
                            text = customer.address,
                            fontSize = 11.sp,
                            color = Emerald100.copy(alpha = 0.9f)
                        )
                    }
                }
            }
        }

        // Urgent Fine Pending Banner (If ₹100 fine active)
        if (unpaidFine != null) {
            item {
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = Red600,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                            Icon(Icons.Default.Warning, contentDescription = null, tint = PureWhite, modifier = Modifier.size(24.dp))
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "MUNICIPAL FINE IMPOSED",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Black,
                                    color = PureWhite.copy(alpha = 0.9f)
                                )
                                Text(
                                    text = "₹${unpaidFine.fineAmount.toInt()} Due • Mixed Waste",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = PureWhite
                                )
                            }
                        }
                        Button(
                            onClick = { showPaymentDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = PureWhite),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = "Pay Online",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Red600
                            )
                        }
                    }
                }
            }
        }

        // TAB 0: HOME / TODAY
        if (selectedTab == 0) {
            // 1. Pickup Status Hero Card
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = when (customer.todayStatus) {
                            PickupStatus.PENDING -> Sky50
                            PickupStatus.COLLECTED -> Emerald50
                            PickupStatus.FLAGGED_IMPROPER -> Red50
                        }
                    ),
                    border = androidx.compose.foundation.BorderStroke(
                        1.dp,
                        when (customer.todayStatus) {
                            PickupStatus.PENDING -> Sky600
                            PickupStatus.COLLECTED -> Emerald600
                            PickupStatus.FLAGGED_IMPROPER -> Red600
                        }
                    ),
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
                                    text = viewModel.tr("Today's Doorstep Collection", "இன்றைய வாசல் சேகரிப்பு"),
                                    fontSize = 12.sp,
                                    color = Slate500,
                                    fontWeight = FontWeight.Medium
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = when (customer.todayStatus) {
                                        PickupStatus.PENDING -> viewModel.tr("Awaiting Waste Pickup", "சேகரிப்புக்காக காத்திருக்கிறது")
                                        PickupStatus.COLLECTED -> viewModel.tr("Waste Successfully Collected", "கழிவு வெற்றிகரமாக பெறப்பட்டது")
                                        PickupStatus.FLAGGED_IMPROPER -> viewModel.tr("Improper Segregation Flagged", "தவறான பிரிப்பு கண்டறியப்பட்டது")
                                    },
                                    fontSize = 17.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Slate900
                                )
                            }

                            Box(
                                modifier = Modifier
                                    .size(42.dp)
                                    .clip(CircleShape)
                                    .background(
                                        when (customer.todayStatus) {
                                            PickupStatus.PENDING -> Sky600
                                            PickupStatus.COLLECTED -> Emerald600
                                            PickupStatus.FLAGGED_IMPROPER -> Red600
                                        }
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = when (customer.todayStatus) {
                                        PickupStatus.PENDING -> Icons.Default.Schedule
                                        PickupStatus.COLLECTED -> Icons.Default.CheckCircle
                                        PickupStatus.FLAGGED_IMPROPER -> Icons.Default.Warning
                                    },
                                    contentDescription = null,
                                    tint = PureWhite,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        Divider(color = Slate200)
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(
                                    viewModel.tr("Scheduled Window", "திட்டமிடப்பட்ட நேரம்"),
                                    fontSize = 11.sp,
                                    color = Slate500
                                )
                                Text(
                                    customer.scheduledTimeSlot,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Slate800
                                )
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    viewModel.tr("Segregation Score", "பிரிப்பு மதிப்பீடு"),
                                    fontSize = 11.sp,
                                    color = Slate500
                                )
                                Text(
                                    "${customer.segregationScore}/100",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald700
                                )
                            }
                        }
                    }
                }
            }

            // 2. Doorstep 4-Digit OTP Verification Card
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
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.VpnKey, contentDescription = null, tint = Emerald600, modifier = Modifier.size(20.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    viewModel.tr("Doorstep Verification OTP", "வாசல் சரிபார்ப்பு OTP"),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Slate900
                                )
                            }
                            TextButton(onClick = { viewModel.refreshOtp() }) {
                                Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(16.dp), tint = Emerald600)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(viewModel.tr("Refresh", "புதுப்பி"), fontSize = 12.sp, color = Emerald600)
                            }
                        }

                        Text(
                            viewModel.tr(
                                "Share this 4-digit code with your sanitation champion upon doorstep collection",
                                "கழிவு சேகரிக்கும் போது தூய்மை பணியாளரிடம் இந்த 4 இலக்க குறியீட்டை பகிரவும்"
                            ),
                            fontSize = 11.sp,
                            color = Slate500
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.Center,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            customer.otp.forEach { digit ->
                                Box(
                                    modifier = Modifier
                                        .padding(horizontal = 6.dp)
                                        .size(48.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Emerald50)
                                        .border(1.5.dp, Emerald600, RoundedCornerShape(8.dp)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        digit.toString(),
                                        fontSize = 22.sp,
                                        fontWeight = FontWeight.ExtraBold,
                                        color = Emerald900
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // 3. Assigned Sanitation Champion Card
            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = PureWhite),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            viewModel.tr("Assigned Sanitation Champion", "ஒதுக்கப்பட்ட தூய்மை பணியாளர்"),
                            fontSize = 12.sp,
                            color = Slate500,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(46.dp)
                                    .clip(CircleShape)
                                    .background(Emerald100),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Engineering, contentDescription = null, tint = Emerald700, modifier = Modifier.size(26.dp))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(worker.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Slate900)
                                Text(
                                    "Vehicle: ${worker.vehicleNumber} • ${worker.ward}",
                                    fontSize = 11.sp,
                                    color = Slate500
                                )
                            }
                            Button(
                                onClick = { /* Simulated dialer */ },
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(viewModel.tr("Call", "அழை"), fontSize = 12.sp)
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Route tracking status bar
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Slate50,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Navigation, contentDescription = null, tint = Sky600, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = if (worker.isRouteActive)
                                        viewModel.tr("Vehicle on route in Anna Nagar 2nd Ave (3 stops away)", "வாகனம் அண்ணா நகர் 2வது அவென்யூவில் வருகிறது (3 வீடுகள் முன்பு)")
                                    else
                                        viewModel.tr("Route not started yet", "பாதை இன்னும் தொடங்கப்படவில்லை"),
                                    fontSize = 11.sp,
                                    color = Slate700
                                )
                            }
                        }
                    }
                }
            }
        }

        // TAB 1: TRACK WORKER
        if (selectedTab == 1) {
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
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.LocationOn, contentDescription = null, tint = Emerald600, modifier = Modifier.size(20.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    viewModel.tr("Live Route Tracking", "நேரலை பாதை கண்காணிப்பு"),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    color = Slate900
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = if (worker.isRouteActive) Emerald100 else Slate200
                            ) {
                                Text(
                                    text = if (worker.isRouteActive) "LIVE GPS" else "OFFLINE",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (worker.isRouteActive) Emerald800 else Slate600,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Simulation Map Canvas
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = Slate900,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(180.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(14.dp),
                                verticalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Anna Nagar Central - Ward 14", color = Slate400, fontSize = 11.sp)
                                    Text("ETA: ~10 mins", color = Emerald400, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceEvenly,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    // Stop 1
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Box(modifier = Modifier.size(16.dp).clip(CircleShape).background(Emerald500))
                                        Text("1st Ave", color = Slate400, fontSize = 9.sp)
                                    }
                                    Box(modifier = Modifier.height(2.dp).weight(1f).background(Emerald500))
                                    // Stop 2 (Vehicle current)
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Box(modifier = Modifier.size(24.dp).clip(CircleShape).background(Sky500), contentAlignment = Alignment.Center) {
                                            Icon(Icons.Default.LocalShipping, contentDescription = null, tint = PureWhite, modifier = Modifier.size(14.dp))
                                        }
                                        Text("2nd Ave", color = Sky400, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Box(modifier = Modifier.height(2.dp).weight(1f).background(Slate700))
                                    // Stop 3 (Your Doorstep)
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Box(modifier = Modifier.size(18.dp).clip(CircleShape).background(Amber500), contentAlignment = Alignment.Center) {
                                            Icon(Icons.Default.Home, contentDescription = null, tint = PureWhite, modifier = Modifier.size(12.dp))
                                        }
                                        Text("14/B (You)", color = Amber400, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("Champion: ${worker.name} (${worker.vehicleNumber})", color = PureWhite, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                                    Button(
                                        onClick = { /* simulated call */ },
                                        colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                        shape = RoundedCornerShape(6.dp),
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                    ) {
                                        Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(12.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Call Driver", fontSize = 10.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // TAB 2: GRIEVANCES / COMPLAINTS
        if (selectedTab == 2) {
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
                            Text(
                                viewModel.tr("Citizen Grievance Redressal", "குடிமக்கள் குறைதீர்ப்பு"),
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp,
                                color = Slate900
                            )
                            Button(
                                onClick = { showGrievanceDialog = true },
                                colors = ButtonDefaults.buttonColors(containerColor = Emerald600),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(viewModel.tr("New Complaint", "புதிய புகார்"), fontSize = 11.sp)
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        if (grievances.isEmpty()) {
                            Text(
                                viewModel.tr(
                                    "No open complaints. Report missed collection or spillages anytime.",
                                    "புகார்கள் எதுவும் இல்லை. விடுபட்ட சேகரிப்புகளை இங்கே பதிவு செய்யலாம்."
                                ),
                                fontSize = 12.sp,
                                color = Slate500
                            )
                        } else {
                            grievances.forEach { grv ->
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = Slate50,
                                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp)
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text("${grv.id} • ${grv.category}", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate900)
                                            Surface(
                                                shape = RoundedCornerShape(6.dp),
                                                color = if (grv.status == "Resolved") Emerald100 else Amber100
                                            ) {
                                                Text(
                                                    grv.status,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                                    fontSize = 9.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = if (grv.status == "Resolved") Emerald800 else Amber800
                                                )
                                            }
                                        }
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(grv.description, fontSize = 11.sp, color = Slate700)
                                        if (grv.resolutionNotes.isNotBlank()) {
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text("Note: ${grv.resolutionNotes}", fontSize = 10.sp, color = Emerald700, fontWeight = FontWeight.Medium)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // TAB 3: FINES & NOTICES
        if (selectedTab == 3 || selectedTab == 0) {
            // Violations & Fine Clearance Section
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
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.ReceiptLong, contentDescription = null, tint = Amber600, modifier = Modifier.size(20.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    viewModel.tr("Segregation Warnings & Fines", "கழிவு பிரிப்பு எச்சரிக்கைகள் & அபராதங்கள்"),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Slate900
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = if (customer.activeFineAmount > 0.0) Red100 else Emerald100
                            ) {
                                Text(
                                    text = if (customer.activeFineAmount > 0.0) "₹${customer.activeFineAmount.toInt()} Due" else "Clear",
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (customer.activeFineAmount > 0.0) Red700 else Emerald800
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        if (myViolations.isEmpty()) {
                            Text(
                                viewModel.tr(
                                    "No violation notices recorded for 14/B. Keep up proper segregation!",
                                    "14/B இல் எந்த விதிமீறல்களும் இல்லை. சரியான கழிவு பிரிப்பை தொடரவும்!"
                                ),
                                fontSize = 12.sp,
                                color = Slate500
                            )
                        } else {
                            myViolations.forEach { vio ->
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = if (vio.tier == ViolationTier.FINE_TIER_3) Red50 else Amber50,
                                    border = androidx.compose.foundation.BorderStroke(
                                        1.dp,
                                        if (vio.tier == ViolationTier.FINE_TIER_3) Red600 else Amber500
                                    ),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp)
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                when (vio.tier) {
                                                    ViolationTier.WARNING_1 -> "Tier 1: Warning Notice"
                                                    ViolationTier.WARNING_2 -> "Tier 2: Urgent Warning"
                                                    ViolationTier.FINE_TIER_3 -> "Tier 3: Municipal Fine (₹100)"
                                                },
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 12.sp,
                                                color = Slate900
                                            )
                                            Text(vio.date, fontSize = 11.sp, color = Slate500)
                                        }
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(vio.reason, fontSize = 11.sp, color = Slate700)

                                        if (vio.fineAmount > 0.0) {
                                            Spacer(modifier = Modifier.height(8.dp))
                                            Row(
                                                modifier = Modifier.fillMaxWidth(),
                                                horizontalArrangement = Arrangement.SpaceBetween,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Text(
                                                    if (vio.isPaid) "Status: Paid (Receipt Issued)" else "Status: Unpaid (Action Required)",
                                                    fontSize = 11.sp,
                                                    fontWeight = FontWeight.SemiBold,
                                                    color = if (vio.isPaid) Emerald700 else Red600
                                                )

                                                if (!vio.isPaid) {
                                                    Button(
                                                        onClick = { showPaymentDialog = true },
                                                        colors = ButtonDefaults.buttonColors(containerColor = Red600),
                                                        shape = RoundedCornerShape(6.dp),
                                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                                                    ) {
                                                        Text(viewModel.tr("Pay ₹100", "₹100 செலுத்து"), fontSize = 11.sp)
                                                    }
                                                } else {
                                                    OutlinedButton(
                                                        onClick = { showReceiptDialog = true },
                                                        shape = RoundedCornerShape(6.dp),
                                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                                    ) {
                                                        Text(viewModel.tr("Receipt", "ரசீது"), fontSize = 11.sp, color = Emerald700)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Grievance filing quick button
        if (selectedTab == 0) {
            item {
                OutlinedButton(
                    onClick = { showGrievanceDialog = true },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Slate300),
                    colors = ButtonDefaults.outlinedButtonColors(containerColor = PureWhite)
                ) {
                    Icon(Icons.Default.ReportProblem, contentDescription = null, tint = Slate700, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        viewModel.tr("Report Missed Collection / File Grievance", "விடுபட்ட சேகரிப்பு / புகார் பதிவு செய்க"),
                        color = Slate800,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 13.sp
                    )
                }
            }
        }
    }

    // Dialog: Grievance Submission
    if (showGrievanceDialog) {
        var category by remember { mutableStateOf("Missed Collection") }
        var description by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showGrievanceDialog = false },
            title = {
                Text(viewModel.tr("File Municipal Grievance", "நகராட்சி புகார் பதிவு"), fontWeight = FontWeight.Bold, fontSize = 16.sp)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(viewModel.tr("Select Category", "பிரிவை தேர்ந்தெடுக்கவும்"), fontSize = 12.sp, color = Slate600)
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        listOf("Missed Collection", "Worker Delayed", "Spillage").forEach { cat ->
                            FilterChip(
                                selected = category == cat,
                                onClick = { category = cat },
                                label = { Text(cat, fontSize = 10.sp) }
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text(viewModel.tr("Description / விவரம்", "விவரம்")) },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (description.isNotBlank()) {
                            viewModel.submitGrievance(category, description)
                            showGrievanceDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Text(viewModel.tr("Submit Ticket", "பதிவு செய்"))
                }
            },
            dismissButton = {
                TextButton(onClick = { showGrievanceDialog = false }) {
                    Text(viewModel.tr("Cancel", "ரத்து"))
                }
            }
        )
    }

    // Dialog: Fine Payment Simulation
    if (showPaymentDialog && unpaidFine != null) {
        AlertDialog(
            onDismissRequest = { showPaymentDialog = false },
            title = {
                Text(viewModel.tr("Pay Municipal Fine (₹100)", "நகராட்சி அபராதம் செலுத்து (₹100)"), fontWeight = FontWeight.Bold, fontSize = 16.sp)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        viewModel.tr(
                            "Municipal Bylaw 44A: Repeated waste segregation violation penalty.",
                            "நகராட்சி விதி 44A: கழிவு பிரிக்காததற்கான அபராதம்."
                        ),
                        fontSize = 11.sp,
                        color = Slate600
                    )

                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Emerald50,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Emerald100),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.VolunteerActivism, contentDescription = null, tint = Emerald700, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                viewModel.tr(
                                    "Notice: 40% (₹40) of this fine is directly transferred to your Ward Sanitation Champion as incentive.",
                                    "அறிவிப்பு: இதில் 40% (₹40) தூய்மை பணியாளருக்கு ஊக்கத்தொகையாக செல்லும்."
                                ),
                                fontSize = 10.sp,
                                color = Emerald900,
                                lineHeight = 14.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(4.dp))
                    Text(viewModel.tr("Select Payment Method", "பணம் செலுத்தும் முறை"), fontSize = 12.sp, fontWeight = FontWeight.SemiBold)

                    listOf("UPI (GPay / PhonePe / Paytm)", "Debit / Credit Card", "Net Banking").forEach { mode ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 2.dp)
                        ) {
                            RadioButton(
                                selected = selectedPaymentMode == mode,
                                onClick = { selectedPaymentMode = mode },
                                colors = RadioButtonDefaults.colors(selectedColor = Emerald600)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(mode, fontSize = 12.sp, color = Slate800)
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.payFine(unpaidFine.id, selectedPaymentMode)
                        showPaymentDialog = false
                        showReceiptDialog = true
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Text(viewModel.tr("Pay ₹100.00", "₹100 செலுத்து"))
                }
            },
            dismissButton = {
                TextButton(onClick = { showPaymentDialog = false }) {
                    Text(viewModel.tr("Cancel", "ரத்து"))
                }
            }
        )
    }

    // Dialog: Municipal Receipt
    if (showReceiptDialog) {
        AlertDialog(
            onDismissRequest = { showReceiptDialog = false },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Verified, contentDescription = null, tint = Emerald600)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Municipal Payment Receipt", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Slate50, RoundedCornerShape(8.dp))
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text("GREATER CHENNAI CORPORATION", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate900)
                    Text("Solid Waste Management Dept - Ward 14", fontSize = 10.sp, color = Slate500)
                    Divider(color = Slate200)
                    Text("Receipt No: GCC-SWM-2026-9921", fontSize = 11.sp, color = Slate700)
                    Text("Household: 14/B (Ramesh Kumar)", fontSize = 11.sp, color = Slate700)
                    Text("Amount Paid: ₹100.00", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Emerald700)
                    Text("Worker Share: ₹40.00 (Credited to Murugan K)", fontSize = 10.sp, color = Emerald800)
                    Text("Status: CLEARED & AUDITED", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald600)
                }
            },
            confirmButton = {
                Button(
                    onClick = { showReceiptDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald600)
                ) {
                    Text("Done")
                }
            }
        )
    }
}
