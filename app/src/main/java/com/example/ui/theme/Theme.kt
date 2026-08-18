package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = HighDensityIndigoLight,
    onPrimary = Color(0xFF0F172A),
    primaryContainer = HighDensityCardDark,
    onPrimaryContainer = Color(0xFFE0E7FF),
    secondary = Color(0xFF38BDF8),
    onSecondary = Color(0xFF0C4A6E),
    background = NeutralBgDark,
    onBackground = TextPrimaryDark,
    surface = SurfaceDark,
    onSurface = TextPrimaryDark,
    surfaceVariant = SurfaceElevatedDark,
    onSurfaceVariant = TextSecondaryDark,
    outline = SurfaceBorderDark
)

private val LightColorScheme = lightColorScheme(
    primary = HighDensityIndigoPrimary,
    onPrimary = Color.White,
    primaryContainer = HighDensityIndigoBg,
    onPrimaryContainer = HighDensityIndigoDark,
    secondary = Color(0xFF0284C7),
    onSecondary = Color.White,
    background = NeutralBgLight,
    onBackground = TextPrimaryLight,
    surface = SurfaceLight,
    onSurface = TextPrimaryLight,
    surfaceVariant = SurfaceElevatedLight,
    onSurfaceVariant = TextSecondaryLight,
    outline = SurfaceBorderLight
)

@Composable
fun ClassoraTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
