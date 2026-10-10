package com.karima.swachhconnect

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.karima.swachhconnect.model.Role
import com.karima.swachhconnect.theme.Emerald600
import com.karima.swachhconnect.theme.PureWhite
import com.karima.swachhconnect.theme.Slate100
import com.karima.swachhconnect.theme.SwachhConnectTheme
import com.karima.swachhconnect.ui.components.RoleSelectionDialog
import com.karima.swachhconnect.ui.components.SMSOutboxDialog
import com.karima.swachhconnect.ui.components.SwachhTopAppBar
import com.karima.swachhconnect.ui.navigation.AdminNavItems
import com.karima.swachhconnect.ui.navigation.CustomerNavItems
import com.karima.swachhconnect.ui.navigation.WorkerNavItems
import com.karima.swachhconnect.ui.screens.AdminScreen
import com.karima.swachhconnect.ui.screens.CustomerScreen
import com.karima.swachhconnect.ui.screens.WorkerScreen
import com.karima.swachhconnect.viewmodel.SwachhViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: SwachhViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            SwachhConnectTheme {
                val currentRole by viewModel.currentRole.collectAsState()
                val smsList by viewModel.smsOutbox.collectAsState()

                var showRoleDialog by remember { mutableStateOf(false) }
                var showSmsDialog by remember { mutableStateOf(false) }
                var selectedTabIndex by remember { mutableStateOf(0) }

                // Reset selected tab index when switching role
                LaunchedEffect(currentRole) {
                    selectedTabIndex = 0
                }

                val currentNavItems = when (currentRole) {
                    Role.CUSTOMER -> CustomerNavItems
                    Role.WORKER -> WorkerNavItems
                    Role.ADMIN -> AdminNavItems
                }

                Scaffold(
                    topBar = {
                        SwachhTopAppBar(
                            viewModel = viewModel,
                            onOpenSmsOutbox = { showSmsDialog = true },
                            onOpenRoleDialog = { showRoleDialog = true }
                        )
                    },
                    bottomBar = {
                        NavigationBar(
                            containerColor = PureWhite,
                            tonalElevation = 6.dp
                        ) {
                            currentNavItems.forEachIndexed { index, item ->
                                NavigationBarItem(
                                    selected = selectedTabIndex == index,
                                    onClick = { selectedTabIndex = index },
                                    icon = {
                                        Icon(item.icon, contentDescription = item.enTitle)
                                    },
                                    label = {
                                        Text(
                                            viewModel.tr(item.enTitle, item.taTitle),
                                            fontSize = 10.sp
                                        )
                                    },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = Emerald600,
                                        selectedTextColor = Emerald600,
                                        indicatorColor = Slate100
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        when (currentRole) {
                            Role.CUSTOMER -> CustomerScreen(viewModel = viewModel, selectedTab = selectedTabIndex)
                            Role.WORKER -> WorkerScreen(viewModel = viewModel, selectedTab = selectedTabIndex)
                            Role.ADMIN -> AdminScreen(viewModel = viewModel, selectedTab = selectedTabIndex)
                        }
                    }
                }

                if (showRoleDialog) {
                    RoleSelectionDialog(
                        currentRole = currentRole,
                        onSelectRole = { newRole ->
                            viewModel.setRole(newRole)
                        },
                        onDismiss = { showRoleDialog = false }
                    )
                }

                if (showSmsDialog) {
                    SMSOutboxDialog(
                        smsList = smsList,
                        onDismiss = { showSmsDialog = false }
                    )
                }
            }
        }
    }
}
