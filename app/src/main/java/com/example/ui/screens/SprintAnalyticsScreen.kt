package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Assignment
import com.example.model.Priority
import com.example.model.SprintSummary
import com.example.model.UrgencyLevel
import com.example.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SprintAnalyticsScreen(
    sprintSummary: SprintSummary,
    assignments: List<Assignment>,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Sprint 42: Phoenix Core Refactor",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                        )
                        Text(
                            text = "Ends in 4 days • 82% Completed",
                            style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace, fontSize = 10.sp),
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    // Team Avatar Stack
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy((-4).dp),
                        modifier = Modifier.padding(end = 8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF3B82F6)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("SJ", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF10B981)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("ML", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF8B5CF6)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("AR", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFE5E7EB)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("+4", color = Color(0xFF4B5563), fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            )
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 12.dp),
            contentPadding = PaddingValues(top = 8.dp, bottom = 80.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // 1. High Density 3-Metric Overview Cards
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
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.5.sp
                                ),
                                color = Color(0xFF4F46E5)
                            )
                            Text(
                                text = "04",
                                style = MaterialTheme.typography.headlineLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 22.sp
                                ),
                                color = MetricIndigoText
                            )
                            Text(
                                text = "-2 since yesterday",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 9.sp,
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
                                text = "REMAINING SP",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.5.sp
                                ),
                                color = Color(0xFFEA580C)
                            )
                            Text(
                                text = "114",
                                style = MaterialTheme.typography.headlineLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 22.sp
                                ),
                                color = MetricOrangeText
                            )
                            Text(
                                text = "of 142 committed",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 9.sp,
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
                                text = "BURN-DOWN",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.5.sp
                                ),
                                color = Color(0xFF16A34A)
                            )
                            Text(
                                text = "94%",
                                style = MaterialTheme.typography.headlineLarge.copy(
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 22.sp
                                ),
                                color = MetricGreenText
                            )
                            Text(
                                text = "On track for Friday",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 9.sp,
                                    fontFamily = FontFamily.Monospace
                                ),
                                color = Color(0xFF4ADE80)
                            )
                        }
                    }
                }
            }

            // 2. High Density Active Task Board Table
            item {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surface,
                    border = BorderStroke(1.dp, SurfaceBorderLight),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column {
                        // Table Top Header
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF9FAFB))
                                .padding(horizontal = 10.dp, vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "ACTIVE TASK BOARD",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 0.8.sp
                                ),
                                color = Color(0xFF4B5563)
                            )

                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                Surface(
                                    color = Color(0xFFE5E7EB),
                                    shape = RoundedCornerShape(4.dp)
                                ) {
                                    Text(
                                        text = "View: Density",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Medium
                                        ),
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                        color = Color(0xFF374151)
                                    )
                                }
                                Surface(
                                    color = Color(0xFFE5E7EB),
                                    shape = RoundedCornerShape(4.dp)
                                ) {
                                    Text(
                                        text = "Filter: Priority",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Medium
                                        ),
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                        color = Color(0xFF374151)
                                    )
                                }
                            }
                        }

                        Divider(color = SurfaceBorderLight)

                        // Column Headers
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color.White)
                                .padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "ID",
                                modifier = Modifier.width(55.dp),
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontFamily = FontFamily.Monospace,
                                    color = TextTertiaryLight
                                )
                            )
                            Text(
                                text = "TASK DESCRIPTION",
                                modifier = Modifier.weight(1f),
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 9.sp,
                                    color = TextTertiaryLight
                                )
                            )
                            Text(
                                text = "STATUS",
                                modifier = Modifier.width(65.dp),
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 9.sp,
                                    color = TextTertiaryLight
                                )
                            )
                            Text(
                                text = "PRIORITY",
                                modifier = Modifier.width(65.dp),
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontSize = 9.sp,
                                    color = TextTertiaryLight
                                )
                            )
                        }

                        Divider(color = Color(0xFFF3F4F6))

                        // High Density Rows
                        val tasks = listOf(
                            Triple("PHX-102", "Implement Redis Caching Layer for Auth", Pair("In Review", "!!! Critical")),
                            Triple("PHX-104", "Fix race condition in Websocket events", Pair("Testing", "!! High")),
                            Triple("PHX-105", "Migrate Legacy Postgres Schemas to v2", Pair("Verified", "- Normal")),
                            Triple("PHX-106", "Refactor Header Component for Mobile", Pair("Backlog", "! Low")),
                            Triple("PHX-108", "Documentation for API Webhooks", Pair("In Review", "- Normal")),
                            Triple("PHX-109", "Unit tests for Billing Engine", Pair("Backlog", "!!! Critical"))
                        )

                        tasks.forEach { (taskId, taskTitle, meta) ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 10.dp, vertical = 7.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = taskId,
                                    modifier = Modifier.width(55.dp),
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        fontFamily = FontFamily.Monospace,
                                        fontSize = 10.sp
                                    ),
                                    color = Color(0xFF6B7280)
                                )
                                Text(
                                    text = taskTitle,
                                    modifier = Modifier.weight(1f),
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        fontWeight = FontWeight.Medium,
                                        fontSize = 11.sp
                                    ),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )

                                // Status pill
                                Surface(
                                    modifier = Modifier
                                        .width(65.dp)
                                        .padding(end = 4.dp),
                                    color = when (meta.first) {
                                        "In Review" -> Color(0xFFDBEAFE)
                                        "Testing" -> Color(0xFFFEF9C3)
                                        "Verified" -> Color(0xFFDCFCE7)
                                        else -> Color(0xFFF3F4F6)
                                    },
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Text(
                                        text = meta.first,
                                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 8.sp),
                                        color = when (meta.first) {
                                            "In Review" -> Color(0xFF1D4ED8)
                                            "Testing" -> Color(0xFFA16207)
                                            "Verified" -> Color(0xFF15803D)
                                            else -> Color(0xFF374151)
                                        },
                                        modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                    )
                                }

                                // Priority
                                Text(
                                    text = meta.second,
                                    modifier = Modifier.width(65.dp),
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold
                                    ),
                                    color = when {
                                        meta.second.contains("Critical") -> Color(0xFFEF4444)
                                        meta.second.contains("High") -> Color(0xFFF97316)
                                        meta.second.contains("Low") -> Color(0xFF3B82F6)
                                        else -> Color(0xFF6B7280)
                                    }
                                )
                            }
                            Divider(color = Color(0xFFF9FAFB))
                        }
                    }
                }
            }

            // 3. Dark Resource Allocation Panel (#1F2937)
            item {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = HighDensityCardDark,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(
                            text = "RESOURCE ALLOCATION",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp,
                                fontSize = 9.sp
                            ),
                            color = Color(0xFF9CA3AF)
                        )

                        val resources = listOf(
                            Triple("Sarah Jenkins", 92, Color(0xFFEF4444)),
                            Triple("Mike Lowrey", 65, Color(0xFF3B82F6)),
                            Triple("Chen Wei", 48, Color(0xFF10B981)),
                            Triple("Alex Rivera", 22, Color(0xFF6366F1))
                        )

                        resources.forEach { (name, percent, color) ->
                            Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = name,
                                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                                        color = Color(0xFFD1D5DB)
                                    )
                                    Text(
                                        text = "$percent%",
                                        style = MaterialTheme.typography.bodySmall.copy(
                                            fontFamily = FontFamily.Monospace,
                                            fontSize = 10.sp
                                        ),
                                        color = Color.White
                                    )
                                }
                                LinearProgressIndicator(
                                    progress = { percent / 100f },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(5.dp)
                                        .clip(CircleShape),
                                    color = color,
                                    trackColor = Color(0xFF374151)
                                )
                            }
                        }

                        Divider(color = Color(0xFF374151))

                        Text(
                            text = "Critical: 1 resource over-allocated (>90% threshold)",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 9.sp,
                                color = Color(0xFFFCA5A5)
                            )
                        )
                    }
                }
            }

            // 4. Velocity Tracking Bar Chart
            item {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surface,
                    border = BorderStroke(1.dp, SurfaceBorderLight),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(
                            text = "VELOCITY TRACKING",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp,
                                fontSize = 9.sp
                            ),
                            color = Color(0xFF4B5563)
                        )

                        val velocityBars = listOf(
                            Pair("S38", Pair(28, Color(0xFFE0E7FF))),
                            Pair("S39", Pair(34, Color(0xFFC7D2FE))),
                            Pair("S40", Pair(22, Color(0xFFA5B4FC))),
                            Pair("S41", Pair(42, Color(0xFF818CF8))),
                            Pair("S42", Pair(30, Color(0xFF4F46E5)))
                        )

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(90.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.Bottom
                        ) {
                            velocityBars.forEach { (label, barData) ->
                                val (value, barColor) = barData
                                val barHeightFraction = (value / 50f).coerceIn(0.2f, 1f)

                                Column(
                                    modifier = Modifier.weight(1f),
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Bottom
                                ) {
                                    Text(
                                        text = if (label == "S42") "$value*" else "$value",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontFamily = FontFamily.Monospace,
                                            fontSize = 9.sp,
                                            fontWeight = if (label == "S42") FontWeight.Bold else FontWeight.Normal
                                        ),
                                        color = if (label == "S42") Color(0xFF4338CA) else Color(0xFF6B7280)
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .fillMaxHeight(barHeightFraction)
                                            .clip(RoundedCornerShape(topStart = 3.dp, topEnd = 3.dp))
                                            .background(barColor)
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = label,
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontSize = 8.sp,
                                            fontWeight = FontWeight.Bold
                                        ),
                                        color = Color(0xFF9CA3AF)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
