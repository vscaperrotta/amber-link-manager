import 'package:flutter/material.dart';

/// Void v2 design system color tokens.
/// All UI code must reference these constants — never use hardcoded hex strings.
abstract final class VoidColors {
  // ── Dark mode ──────────────────────────────────────────────────────────────
  static const darkBgPrimary = Color(0xFF111118);
  static const darkBgSurface = Color(0xFF18181F);
  static const darkBgElevated = Color(0xFF21212E);
  static const darkAccent = Color(0xFFF5A623);
  static const darkAccentMuted = Color(0x25F5A623); // rgba(245,166,35,0.14)
  static const darkTextPrimary = Color(0xFFF2F2F6);
  static const darkTextSecondary = Color(0xFFB4B4C8);
  static const darkTextTertiary = Color(0xFF82829A);
  static const darkBorder = Color(0xFF2C2C42);
  static const darkBorderFocus = Color(0xFF72728A); // neutral gray, NOT amber
  static const darkStatusError = Color(0xFFEE5555);

  // ── Light mode ─────────────────────────────────────────────────────────────
  static const lightBgPrimary = Color(0xFFF5F5F7);
  static const lightBgSurface = Color(0xFFFFFFFF);
  static const lightBgElevated = Color(0xFFEBEBEF);
  static const lightAccent = Color(0xFFE8950F);
  static const lightAccentMuted = Color(0x1AD4870A); // rgba(212,135,10,0.10)
  static const lightTextPrimary = Color(0xFF0F0F12);
  static const lightTextSecondary = Color(0xFF3C3C58);
  static const lightTextTertiary = Color(0xFF48486A);
  static const lightBorder = Color(0xFFDCDCE8);
  static const lightBorderFocus = Color(0xFF48486A);
  static const lightStatusError = Color(0xFFC03030);

  // ── Shared / semantic aliases (dark-mode defaults used in theme) ───────────
  static const accent = darkAccent;
  static const accentOnPrimary = Color(0xFF0F0F12); // text on amber button
}
