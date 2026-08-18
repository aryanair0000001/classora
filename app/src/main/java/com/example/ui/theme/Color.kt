package com.example.ui.theme

import androidx.compose.ui.graphics.Color

// High Density Brand Palette
val HighDensityNavDark = Color(0xFF111827)        // Navbar background (#111827)
val HighDensityCardDark = Color(0xFF1F2937)       // Dark resource container (#1F2937)
val HighDensityIndigoPrimary = Color(0xFF4F46E5)  // Indigo 600
val HighDensityIndigoDark = Color(0xFF4338CA)     // Indigo 700
val HighDensityIndigoLight = Color(0xFF818CF8)    // Indigo 400
val HighDensityIndigoBg = Color(0xFFEEF2FF)       // Indigo 50
val HighDensityIndigoBorder = Color(0xFFE0E7FF)   // Indigo 100

// High Density Surfaces (Light)
val NeutralBgLight = Color(0xFFF3F4F6)            // Canvas (#F3F4F6)
val SurfaceLight = Color(0xFFFFFFFF)              // Table & Card Surface
val SurfaceElevatedLight = Color(0xFFF9FAFB)      // Table Header / Sub-surface (#F9FAFB)
val SurfaceBorderLight = Color(0xFFE5E7EB)        // Border (#E5E7EB)
val TextPrimaryLight = Color(0xFF111827)          // Text Primary (#111827)
val TextSecondaryLight = Color(0xFF4B5563)        // Text Secondary (#4B5563)
val TextTertiaryLight = Color(0xFF9CA3AF)         // Mono metadata (#9CA3AF)

// High Density Surfaces (Dark)
val NeutralBgDark = Color(0xFF0F172A)
val SurfaceDark = Color(0xFF111827)
val SurfaceElevatedDark = Color(0xFF1F2937)
val SurfaceBorderDark = Color(0xFF374151)
val TextPrimaryDark = Color(0xFFF9FAFB)
val TextSecondaryDark = Color(0xFF9CA3AF)
val TextTertiaryDark = Color(0xFF6B7280)

// High Density Semantic Status & Urgency Badges
val StatusCriticalText = Color(0xFFEF4444)
val StatusCriticalBg = Color(0xFFFEE2E2)
val StatusCriticalBorder = Color(0xFFFCA5A5)

val StatusHighText = Color(0xFFF97316)
val StatusHighBg = Color(0xFFFFEDD5)
val StatusHighBorder = Color(0xFFFDBA74)

val StatusInReviewText = Color(0xFF1D4ED8)
val StatusInReviewBg = Color(0xFFDBEAFE)
val StatusInReviewBorder = Color(0xFFBFDBFE)

val StatusTestingText = Color(0xFFA16207)
val StatusTestingBg = Color(0xFFFEF9C3)
val StatusTestingBorder = Color(0xFFFEF08A)

val StatusVerifiedText = Color(0xFF15803D)
val StatusVerifiedBg = Color(0xFFDCFCE7)
val StatusVerifiedBorder = Color(0xFF86EFAC)

// High Density Metric Card Tints
val MetricIndigoBg = Color(0xFFEEF2FF)
val MetricIndigoBorder = Color(0xFFE0E7FF)
val MetricIndigoText = Color(0xFF312E81)

val MetricOrangeBg = Color(0xFFFFF7ED)
val MetricOrangeBorder = Color(0xFFFFEDD5)
val MetricOrangeText = Color(0xFF7C2D12)

val MetricGreenBg = Color(0xFFF0FDF4)
val MetricGreenBorder = Color(0xFFDCFCE7)
val MetricGreenText = Color(0xFF14532D)

// Urgency Mapping for Existing Components
val UrgencyDueTodayBg = StatusCriticalBg
val UrgencyDueTodayText = StatusCriticalText
val UrgencyDueTodayBorder = StatusCriticalBorder

val UrgencyDueTomorrowBg = StatusHighBg
val UrgencyDueTomorrowText = StatusHighText
val UrgencyDueTomorrowBorder = StatusHighBorder

val UrgencyDue3DaysBg = StatusInReviewBg
val UrgencyDue3DaysText = StatusInReviewText
val UrgencyDue3DaysBorder = StatusInReviewBorder

val UrgencyCompletedBg = StatusVerifiedBg
val UrgencyCompletedText = StatusVerifiedText
val UrgencyCompletedBorder = StatusVerifiedBorder

val UrgencyOverdueBg = Color(0xFF450A0A)
val UrgencyOverdueText = Color(0xFFFECACA)

val FacultyVerifiedBg = StatusVerifiedBg
val FacultyVerifiedText = StatusVerifiedText
val FacultyVerifiedBorder = StatusVerifiedBorder

val CRBadgeBg = Color(0xFFF5F3FF)
val CRBadgeText = Color(0xFF6D28D9)
val CRBadgeBorder = Color(0xFFDDD6FE)
