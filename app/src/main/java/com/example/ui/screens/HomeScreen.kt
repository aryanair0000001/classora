package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.*
import com.example.ui.components.*
import com.example.ui.theme.*

@Composable
fun HomeScreen(
    currentUser: UserProfile,
    assignments: List<Assignment>,
    announcements: List<Announcement>,
    onSelectAssignment: (Assignment) -> Unit,
    onToggleCompletion: (String) -> Unit,
    onOpenCreateAssignment: () -> Unit,
    onOpenAnalytics: () -> Unit,
    onOpenAnnouncements: () -> Unit,
    onSwitchRole: (UserRole) -> Unit,
    modifier: Modifier = Modifier
) {
    val dueTodayList = assignments.filter { it.getUrgency() == UrgencyLevel.DUE_TODAY && !it.isCompleted }
    val upcomingList = assignments.filter { !it.isCompleted && it.getUrgency() != UrgencyLevel.DUE_TODAY && it.getUrgency() != UrgencyLevel.OVERDUE }
    val overdueList = assignments.filter { it.getUrgency() == UrgencyLevel.OVERDUE && !it.isCompleted }
    val completedCount = assignments.count { it.isCompleted }
    val totalCount = assignments.size
    val completionPercent = if (totalCount > 0) (completedCount * 100) / totalCount else 0

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 12.dp),
        contentPadding = PaddingValues(top = 8.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        // High Density Header Bar
        item {
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = Color.White,
                border = BorderStroke(1.dp, SurfaceBorderLight),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        Text(
                            text = "Sprint 42: Phoenix Core Refactor",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        )
                        Text(
                            text = "Ends in 4 days • $completionPercent% Completed • ${currentUser.section}",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontFamily = FontFamily.Monospace,
                                fontSize = 10.sp
                            ),
                            color = Color(0xFF6B7280)
                        )
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        // Team Avatar Stack
                        Row(
                            horizontalArrangement = Arrangement.spacedBy((-4).dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(22.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF3B82F6)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("SJ", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                            }
                            Box(
                                modifier = Modifier
                                    .size(22.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF10B981)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("ML", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                            }
                            Box(
                                modifier = Modifier
                                    .size(22.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF8B5CF6)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text("AR", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                            }
                        }

                        // Complete Sprint / Analytics CTA
                        Button(
                            onClick = onOpenAnalytics,
                            colors = ButtonDefaults.buttonColors(containerColor = HighDensityIndigoPrimary),
                            shape = RoundedCornerShape(6.dp),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            modifier = Modifier.height(28.dp)
                        ) {
                            Text(
                                text = "Analytics",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }
                    }
                }
            }
        }

        // High Density 3-Metric Overview Cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Active Blocks
                Surface(
                    modifier = Modifier.weight(1f),
                    color = MetricIndigoBg,
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, MetricIndigoBorder)
                ) {
                    Column(
                        modifier = Modifier.padding(10.dp),
                        verticalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        Text(
                            text = "ACTIVE BLOCKS",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            ),
                            color = Color(0xFF4F46E5)
                        )
                        Text(
                            text = "${assignments.count { !it.isCompleted }}",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 20.sp
                            ),
                            color = MetricIndigoText
                        )
                        Text(
                            text = "-2 since yesterday",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 8.sp,
                                fontFamily = FontFamily.Monospace
                            ),
                            color = Color(0xFF818CF8)
                        )
                    }
                }

                // Remaining SP
                Surface(
                    modifier = Modifier.weight(1f),
                    color = MetricOrangeBg,
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, MetricOrangeBorder)
                ) {
                    Column(
                        modifier = Modifier.padding(10.dp),
                        verticalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        Text(
                            text = "REMAINING EFFORT",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            ),
                            color = Color(0xFFEA580C)
                        )
                        val totalHours = assignments.filter { !it.isCompleted }.sumOf { it.estimatedWorkloadHours }
                        Text(
                            text = "${totalHours}h",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 20.sp
                            ),
                            color = MetricOrangeText
                        )
                        Text(
                            text = "across ${assignments.count { !it.isCompleted }} tasks",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 8.sp,
                                fontFamily = FontFamily.Monospace
                            ),
                            color = Color(0xFFFB923C)
                        )
                    }
                }

                // Burn-down Velocity
                Surface(
                    modifier = Modifier.weight(1f),
                    color = MetricGreenBg,
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, MetricGreenBorder)
                ) {
                    Column(
                        modifier = Modifier.padding(10.dp),
                        verticalArrangement = Arrangement.spacedBy(2.dp)
                    ) {
                        Text(
                            text = "COMPLETION",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.5.sp
                            ),
                            color = Color(0xFF16A34A)
                        )
                        Text(
                            text = "$completionPercent%",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 20.sp
                            ),
                            color = MetricGreenText
                        )
                        Text(
                            text = "On track for Friday",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 8.sp,
                                fontFamily = FontFamily.Monospace
                            ),
                            color = Color(0xFF4ADE80)
                        )
                    }
                }
            }
        }

        // Quick Role & Filter Switcher
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RoleBadge(role = currentUser.role)
                    Text(
                        text = "Viewing as ${currentUser.role.displayName}",
                        style = MaterialTheme.typography.bodySmall.copy(
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Default
                        ),
                        color = Color(0xFF6B7280)
                    )
                }

                Text(
                    text = "Switch Role",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = HighDensityIndigoPrimary
                    ),
                    modifier = Modifier.clickable {
                        val nextRole = when (currentUser.role) {
                            UserRole.STUDENT -> UserRole.CR
                            UserRole.CR -> UserRole.FACULTY
                            UserRole.FACULTY -> UserRole.STUDENT
                            UserRole.ADMIN -> UserRole.STUDENT
                        }
                        onSwitchRole(nextRole)
                    }
                )
            }
        }

        // Urgent Deliverables / Due Today
        if (dueTodayList.isNotEmpty()) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "CRITICAL / DUE TODAY (${dueTodayList.size})",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.8.sp
                        ),
                        color = Color(0xFFEF4444)
                    )
                }
            }

            items(dueTodayList, key = { it.id }) { asg ->
                AssignmentCard(
                    assignment = asg,
                    onCardClick = { onSelectAssignment(asg) },
                    onToggleCompletion = { onToggleCompletion(asg.id) }
                )
            }
        }

        // Upcoming Sprint Deliverables
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "UPCOMING DELIVERABLES (${upcomingList.size})",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.8.sp
                    ),
                    color = Color(0xFF4B5563)
                )
            }
        }

        if (upcomingList.isEmpty()) {
            item {
                EmptyStateCard(
                    title = "All caught up in Sprint 42",
                    message = "No upcoming deliverables scheduled for this week."
                )
            }
        } else {
            items(upcomingList, key = { it.id }) { asg ->
                AssignmentCard(
                    assignment = asg,
                    onCardClick = { onSelectAssignment(asg) },
                    onToggleCompletion = { onToggleCompletion(asg.id) }
                )
            }
        }
    }
}
