package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
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
import com.example.data.SampleData
import com.example.model.University
import com.example.model.UserRole

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WelcomeOnboardingScreen(
    onCompleteOnboarding: (
        universityName: String,
        program: String,
        term: String,
        section: String
    ) -> Unit
) {
    var step by remember { mutableIntStateOf(1) } // 1: Welcome, 2: University, 3: Academic Profile, 4: Join Class
    val universities = SampleData.universities

    var selectedUni by remember { mutableStateOf(universities.first()) }
    var uniSearchQuery by remember { mutableStateOf("") }

    var selectedCampus by remember { mutableStateOf(selectedUni.campuses.first()) }
    var selectedDept by remember { mutableStateOf(selectedUni.departments.first()) }
    var selectedProgram by remember { mutableStateOf(selectedUni.programs.first()) }
    var selectedTerm by remember { mutableStateOf(selectedUni.terms.first()) }
    var selectedSection by remember { mutableStateOf(selectedUni.sections.first()) }

    var classCodeInput by remember { mutableStateOf("STAN-CS301-A") }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Bar with progress indicators
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.primary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.CalendarMonth,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Text(
                            text = "CLASSORA",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            ),
                            color = MaterialTheme.colorScheme.primary
                        )
                    }

                    Text(
                        text = "Step $step of 4",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                LinearProgressIndicator(
                    progress = { step / 4f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(4.dp)
                        .clip(CircleShape),
                    color = MaterialTheme.colorScheme.primary,
                    trackColor = MaterialTheme.colorScheme.surfaceVariant
                )
            }

            // Step Content
            Box(
                modifier = Modifier
                    .weight(1f)
                    .padding(vertical = 16.dp),
                contentAlignment = Alignment.Center
            ) {
                when (step) {
                    1 -> {
                        // Welcome Screen
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .verticalScroll(rememberScrollState()),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(72.dp)
                                    .clip(CircleShape)
                                    .background(MaterialTheme.colorScheme.primaryContainer),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.School,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(36.dp)
                                )
                            }

                            Text(
                                text = "Stay ahead of every deadline.",
                                style = MaterialTheme.typography.headlineMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    textAlign = TextAlign.Center
                                )
                            )

                            Text(
                                text = "Your university. Your class. Every assignment, deadline, and announcement organized in one reliable place.",
                                style = MaterialTheme.typography.bodyLarge.copy(
                                    textAlign = TextAlign.Center,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = MaterialTheme.colorScheme.surface,
                                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(
                                    modifier = Modifier.padding(16.dp),
                                    verticalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(Icons.Default.Timer, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                                        Column {
                                            Text("Zero Missed Deadlines", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold))
                                            Text("Categorized urgency countdowns & automatic reminders", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        }
                                    }
                                    Row(
                                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(Icons.Default.Verified, contentDescription = null, tint = Color(0xFF16A34A))
                                        Column {
                                            Text("Verified Academic Information", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.SemiBold))
                                            Text("Published and verified by your Class Reps and Faculty", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    2 -> {
                        // University Selection
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .verticalScroll(rememberScrollState()),
                            verticalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            Text(
                                text = "Select Your University",
                                style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = "Classora dynamically adapts to any university structure globally.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            OutlinedTextField(
                                value = uniSearchQuery,
                                onValueChange = { uniSearchQuery = it },
                                placeholder = { Text("Search university or institution...") },
                                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                                modifier = Modifier.fillMaxWidth(),
                                singleLine = true,
                                shape = RoundedCornerShape(10.dp)
                            )

                            val filteredUnis = universities.filter {
                                it.name.contains(uniSearchQuery, ignoreCase = true) ||
                                it.country.contains(uniSearchQuery, ignoreCase = true)
                            }

                            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                filteredUnis.forEach { uni ->
                                    val isSelected = selectedUni.id == uni.id
                                    Surface(
                                        shape = RoundedCornerShape(10.dp),
                                        color = if (isSelected) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f) else MaterialTheme.colorScheme.surface,
                                        border = BorderStroke(
                                            if (isSelected) 2.dp else 1.dp,
                                            if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
                                        ),
                                        modifier = Modifier.fillMaxWidth(),
                                        onClick = {
                                            selectedUni = uni
                                            selectedCampus = uni.campuses.first()
                                            selectedDept = uni.departments.first()
                                            selectedProgram = uni.programs.first()
                                            selectedTerm = uni.terms.first()
                                            selectedSection = uni.sections.first()
                                        }
                                    ) {
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(14.dp),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Row(
                                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(36.dp)
                                                        .clip(CircleShape)
                                                        .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)),
                                                    contentAlignment = Alignment.Center
                                                ) {
                                                    Text(
                                                        text = uni.shortName.take(2),
                                                        fontWeight = FontWeight.Bold,
                                                        color = MaterialTheme.colorScheme.primary,
                                                        fontSize = 13.sp
                                                    )
                                                }
                                                Column {
                                                    Text(uni.name, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold))
                                                    Text(uni.country, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                                }
                                            }

                                            if (isSelected) {
                                                Icon(Icons.Default.CheckCircle, contentDescription = "Selected", tint = MaterialTheme.colorScheme.primary)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    3 -> {
                        // Academic Profile Hierarchy Selection
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .verticalScroll(rememberScrollState()),
                            verticalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            Text(
                                text = "Academic Cohort Setup",
                                style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = "Configuring hierarchy for ${selectedUni.name}",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            // Program
                            Text("Degree / Program", style = MaterialTheme.typography.labelMedium)
                            selectedUni.programs.forEach { prog ->
                                val isSelected = selectedProgram == prog
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = if (isSelected) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f) else MaterialTheme.colorScheme.surface,
                                    border = BorderStroke(1.dp, if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.4f)),
                                    modifier = Modifier.fillMaxWidth(),
                                    onClick = { selectedProgram = prog }
                                ) {
                                    Row(
                                        modifier = Modifier.padding(12.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(prog, style = MaterialTheme.typography.bodyMedium)
                                        if (isSelected) Icon(Icons.Default.Check, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp))
                                    }
                                }
                            }

                            // Term / Semester
                            Text("Term / Semester", style = MaterialTheme.typography.labelMedium)
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                selectedUni.terms.forEach { term ->
                                    FilterChip(
                                        selected = selectedTerm == term,
                                        onClick = { selectedTerm = term },
                                        label = { Text(term) }
                                    )
                                }
                            }

                            // Section
                            Text("Class Section / Cohort", style = MaterialTheme.typography.labelMedium)
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                selectedUni.sections.forEach { sec ->
                                    FilterChip(
                                        selected = selectedSection == sec,
                                        onClick = { selectedSection = sec },
                                        label = { Text(sec) }
                                    )
                                }
                            }
                        }
                    }

                    4 -> {
                        // Join Class & Permissions
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .verticalScroll(rememberScrollState()),
                            verticalArrangement = Arrangement.spacedBy(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(64.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFFDCFCE7)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Check, contentDescription = null, tint = Color(0xFF166534), modifier = Modifier.size(32.dp))
                            }

                            Text(
                                text = "Join Class Cohort",
                                style = MaterialTheme.typography.headlineSmall.copy(fontWeight = FontWeight.Bold)
                            )
                            Text(
                                text = "Enter your Section Code or confirm your enrolled cohort:",
                                style = MaterialTheme.typography.bodyMedium,
                                textAlign = TextAlign.Center,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            OutlinedTextField(
                                value = classCodeInput,
                                onValueChange = { classCodeInput = it },
                                label = { Text("Class Code / Invite Key") },
                                leadingIcon = { Icon(Icons.Default.Key, contentDescription = null) },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp)
                            )

                            Surface(
                                shape = RoundedCornerShape(12.dp),
                                color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(
                                    modifier = Modifier.padding(14.dp),
                                    verticalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Text("Cohort Details", style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold))
                                    Text("• Institution: ${selectedUni.name}", style = MaterialTheme.typography.bodySmall)
                                    Text("• Program: $selectedProgram", style = MaterialTheme.typography.bodySmall)
                                    Text("• Term: $selectedTerm", style = MaterialTheme.typography.bodySmall)
                                    Text("• Section: $selectedSection", style = MaterialTheme.typography.bodySmall)
                                    Text("• Enrolled Peers: 82 Students", style = MaterialTheme.typography.bodySmall)
                                }
                            }
                        }
                    }
                }
            }

            // Bottom Navigation Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                if (step > 1) {
                    OutlinedButton(
                        onClick = { step-- },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text("Back")
                    }
                }

                Button(
                    onClick = {
                        if (step < 4) {
                            step++
                        } else {
                            onCompleteOnboarding(
                                selectedUni.name,
                                selectedProgram,
                                selectedTerm,
                                selectedSection
                            )
                        }
                    },
                    modifier = Modifier.weight(if (step > 1) 1.5f else 1f),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                ) {
                    Text(if (step == 4) "Enter Classora" else "Continue")
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(
                        imageVector = if (step == 4) Icons.Default.ArrowForward else Icons.Default.NavigateNext,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}
