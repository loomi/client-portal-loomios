import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';

class AppThemeTransitioner implements AppTheme {
  AppThemeTransitioner({
    required this.currentTheme,
    required this.targetTheme,
    required this.animation,
  });

  final AppTheme currentTheme;
  final AppTheme targetTheme;
  final Animation<double> animation;

  Color evaluate(Color begin, Color end) =>
      ColorTween(begin: begin, end: end).evaluate(animation)!;

  // ========== TEXT STYLES ==========
  @override
  TextStyle get displayLargeText => targetTheme.displayLargeText;

  @override
  TextStyle get titleLargeText => targetTheme.titleLargeText;

  @override
  TextStyle get titleMediumText => targetTheme.titleMediumText;

  @override
  TextStyle get bodyMediumText => targetTheme.bodyMediumText;

  @override
  TextStyle get labelSmallText => targetTheme.labelSmallText;

  // ========== COLORS ==========
  @override
  Color get primaryColor =>
      evaluate(currentTheme.primaryColor, targetTheme.primaryColor);

  @override
  Color get secondaryColor =>
      evaluate(currentTheme.secondaryColor, targetTheme.secondaryColor);

  // ========== SEMANTIC SURFACES ==========
  @override
  Color get surfaceColor =>
      evaluate(currentTheme.surfaceColor, targetTheme.surfaceColor);

  @override
  Color get borderColor =>
      evaluate(currentTheme.borderColor, targetTheme.borderColor);

  @override
  Color get mutedColor =>
      evaluate(currentTheme.mutedColor, targetTheme.mutedColor);

  // ========== REQUEST STATUS COLORS ==========
  @override
  Color get statusReceivedColor => targetTheme.statusReceivedColor;

  @override
  Color get statusInAnalysisColor => targetTheme.statusInAnalysisColor;

  @override
  Color get statusApprovedColor => targetTheme.statusApprovedColor;

  @override
  Color get statusRejectedColor => targetTheme.statusRejectedColor;

  @override
  Color get statusResolvedColor => targetTheme.statusResolvedColor;
}
