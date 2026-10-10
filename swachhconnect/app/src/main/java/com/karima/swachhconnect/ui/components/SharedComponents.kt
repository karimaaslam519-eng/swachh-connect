package com.karima.swachhconnect.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import com.karima.swachhconnect.model.Language
import com.karima.swachhconnect.model.Role
import com.karima.swachhconnect.model.SMSNotification
import com.karima.swachhconnect.theme.*
import com.karima.swachhconnect.viewmodel.SwachhViewModel

@Composable
fun SwachhTopAppBar(
    viewModel: SwachhViewModel,
    onOpenSmsOutbox: () -> Unit,
    onOpenRoleDialog: () -> Unit
) {
    val currentRole by viewModel.currentRole.collectAsState()
    val currentLang by viewModel.currentLanguage.collectAsState()
    val smsList by viewModel.smsOutbox.collectAsState()

    Surface(
        color = Slate900,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            // Row 1: Brand + Language + SMS Hub
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Brand logo & title
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(30.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(Emerald600),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Default.Recycling,
                            contentDescription = null,
                            tint = PureWhite,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "SwachhConnect",
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 15.sp,
                                color = PureWhite
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Emerald600.copy(alpha = 0.2f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, Emerald400.copy(alpha = 0.4f))
                            ) {
                                Text(
                                    text = "MUNICIPAL v2.4",
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Emerald400,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                )
                            }
                        }
                        Text(
                            text = viewModel.tr(
                                "Smart Waste Segregation & Sanitation Management",
                                "தூய்மை கழிவு மேலாண்மை மற்றும் கண்காணிப்பு"
                            ),
                            fontSize = 9.sp,
                            color = Slate400,
                            maxLines = 1
                        )
                    }
                }

                // Right controls: Language Toggle & SMS Hub
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // EN / தமிழ் switcher
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Slate950,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Slate800)
                    ) {
                        Row(modifier = Modifier.padding(2.dp)) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(if (currentLang == Language.ENGLISH) Emerald600 else Color.Transparent)
                                    .clickable { viewModel.setLanguage(Language.ENGLISH) }
                                    .padding(horizontal = 6.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = "EN",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (currentLang == Language.ENGLISH) PureWhite else Slate400
                                )
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(if (currentLang == Language.TAMIL) Emerald600 else Color.Transparent)
                                    .clickable { viewModel.setLanguage(Language.TAMIL) }
                                    .padding(horizontal = 6.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = "தமிழ்",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (currentLang == Language.TAMIL) PureWhite else Slate400
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // SMS Hub button
                    Surface(
                        shape = RoundedCornerShape(6.dp),
                        color = Slate800,
                        modifier = Modifier.clickable { onOpenSmsOutbox() }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.ChatBubble,
                                contentDescription = "SMS",
                                tint = Emerald400,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("SMS", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = PureWhite)
                            if (smsList.isNotEmpty()) {
                                Spacer(modifier = Modifier.width(4.dp))
                                Box(
                                    modifier = Modifier
                                        .size(16.dp)
                                        .clip(CircleShape)
                                        .background(Emerald500),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = smsList.size.toString(),
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Black,
                                        color = Slate950
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Row 2: Quick Role Switcher (Customer / Worker / Admin)
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = Slate950,
                border = androidx.compose.foundation.BorderStroke(1.dp, Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(2.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    // Customer Role
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (currentRole == Role.CUSTOMER) Emerald600 else Color.Transparent)
                            .clickable { viewModel.setRole(Role.CUSTOMER) }
                            .padding(vertical = 5.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.Person,
                                contentDescription = null,
                                tint = if (currentRole == Role.CUSTOMER) PureWhite else Slate400,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = viewModel.tr("Customer", "குடியிருப்பாளர்"),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (currentRole == Role.CUSTOMER) PureWhite else Slate400
                            )
                        }
                    }

                    // Worker Role
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (currentRole == Role.WORKER) Amber600 else Color.Transparent)
                            .clickable { viewModel.setRole(Role.WORKER) }
                            .padding(vertical = 5.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.LocalShipping,
                                contentDescription = null,
                                tint = if (currentRole == Role.WORKER) PureWhite else Slate400,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = viewModel.tr("Worker", "பணியாளர்"),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (currentRole == Role.WORKER) PureWhite else Slate400
                            )
                        }
                    }

                    // Admin Role
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(6.dp))
                            .background(if (currentRole == Role.ADMIN) Sky700 else Color.Transparent)
                            .clickable { viewModel.setRole(Role.ADMIN) }
                            .padding(vertical = 5.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.Apartment,
                                contentDescription = null,
                                tint = if (currentRole == Role.ADMIN) PureWhite else Slate400,
                                modifier = Modifier.size(13.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = viewModel.tr("Admin", "நிர்வாகி"),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (currentRole == Role.ADMIN) PureWhite else Slate400
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun RoleSelectionDialog(
    currentRole: Role,
    onSelectRole: (Role) -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text("Select Portal Role / பங்கை தேர்ந்தெடுக்கவும்", fontWeight = FontWeight.Bold, fontSize = 17.sp)
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                RoleOption(
                    title = "Resident / Customer",
                    sub = "Doorstep pickup, OTP, worker tracking, fine clearance",
                    isSelected = currentRole == Role.CUSTOMER,
                    icon = Icons.Default.Person,
                    onClick = { onSelectRole(Role.CUSTOMER); onDismiss() }
                )
                RoleOption(
                    title = "Sanitation Champion (Worker)",
                    sub = "Ward route, 1-tap collection, photo segregation audit",
                    isSelected = currentRole == Role.WORKER,
                    icon = Icons.Default.Engineering,
                    onClick = { onSelectRole(Role.WORKER); onDismiss() }
                )
                RoleOption(
                    title = "Municipal Authority (Admin)",
                    sub = "11 KPIs, evidence audits, worker 40% incentive dispatch",
                    isSelected = currentRole == Role.ADMIN,
                    icon = Icons.Default.AdminPanelSettings,
                    onClick = { onSelectRole(Role.ADMIN); onDismiss() }
                )
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Close", color = Slate600)
            }
        }
    )
}

@Composable
fun RoleOption(
    title: String,
    sub: String,
    isSelected: Boolean,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) Emerald50 else Slate50
        ),
        border = if (isSelected) androidx.compose.foundation.BorderStroke(1.5.dp, Emerald600) else null
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(if (isSelected) Emerald100 else Slate200),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    icon,
                    contentDescription = null,
                    tint = if (isSelected) Emerald700 else Slate600,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Slate900)
                Text(sub, fontSize = 11.sp, color = Slate500, lineHeight = 14.sp)
            }
            if (isSelected) {
                Icon(
                    Icons.Default.CheckCircle,
                    contentDescription = null,
                    tint = Emerald600,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

@Composable
fun SMSOutboxDialog(
    smsList: List<SMSNotification>,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Sms, contentDescription = null, tint = Emerald600)
                Spacer(modifier = Modifier.width(8.dp))
                Text("SMS Dispatch Outbox", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            }
        },
        text = {
            if (smsList.isEmpty()) {
                Text("No SMS notifications dispatched yet.", color = Slate500)
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 400.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(smsList) { sms ->
                        Card(
                            shape = RoundedCornerShape(8.dp),
                            colors = CardDefaults.cardColors(containerColor = Slate50),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(10.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        sms.recipientName,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = Slate800
                                    )
                                    Surface(
                                        shape = RoundedCornerShape(4.dp),
                                        color = Emerald100
                                    ) {
                                        Text(
                                            "SENT",
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Emerald800
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    sms.message,
                                    fontSize = 11.sp,
                                    color = Slate700,
                                    lineHeight = 15.sp
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    sms.timestamp,
                                    fontSize = 10.sp,
                                    color = Slate400
                                )
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Close", color = Emerald600, fontWeight = FontWeight.Bold)
            }
        }
    )
}
