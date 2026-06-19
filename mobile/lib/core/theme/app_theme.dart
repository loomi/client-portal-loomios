import 'package:flutter/material.dart';

abstract class AppTheme {
  // ========== TEXT STYLES ==========
  TextStyle get displayLargeText => const TextStyle(
        fontSize: 57,
        fontWeight: FontWeight.w400,
        height: 64 / 57,
        letterSpacing: -0.25,
      );

  TextStyle get titleLargeText => const TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.w400,
        height: 28 / 22,
      );

  TextStyle get titleMediumText => const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        height: 24 / 16,
      );

  TextStyle get bodyMediumText => const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        height: 20 / 14,
      );

  TextStyle get labelSmallText => const TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        height: 16 / 12,
      );

  // ========== COLORS ==========
  // --- Primary ---
  Color get primaryColor;

  // --- Secondary ---
  Color get secondaryColor;

  // ========== SEMANTIC SURFACES (per theme) ==========
  Color get surfaceColor;
  Color get borderColor;
  Color get mutedColor;

  // ========== REQUEST STATUS COLORS (shared light/dark) ==========
  // recebido → em análise → aprovado/recusado → resolvido
  Color get statusReceivedColor => const Color(0xFF6B7280);
  Color get statusInAnalysisColor => const Color(0xFFF59E0B);
  Color get statusApprovedColor => const Color(0xFF3B82F6);
  Color get statusRejectedColor => const Color(0xFFEF4444);
  Color get statusResolvedColor => const Color(0xFF22C55E);
}
