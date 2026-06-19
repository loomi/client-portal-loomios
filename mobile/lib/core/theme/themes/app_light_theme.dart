import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';

class AppLightTheme extends AppTheme {
  // --- Primary ---
  @override
  Color get primaryColor => const Color(0xFFFFFFFF);

  // --- Secondary ---
  @override
  Color get secondaryColor => const Color(0xFF000000);

  // --- Semantic surfaces ---
  @override
  Color get surfaceColor => const Color(0xFFF4F4F5);

  @override
  Color get borderColor => const Color(0xFFE4E4E7);

  @override
  Color get mutedColor => const Color(0xFF71717A);
}
