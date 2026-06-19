import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';

class AppDarkTheme extends AppTheme {
  // --- Primary ---
  @override
  Color get primaryColor => const Color(0xFF000000);

  // --- Secondary ---
  @override
  Color get secondaryColor => const Color(0xFFFFFFFF);

  // --- Semantic surfaces ---
  @override
  Color get surfaceColor => const Color(0xFF18181B);

  @override
  Color get borderColor => const Color(0xFF27272A);

  @override
  Color get mutedColor => const Color(0xFFA1A1AA);
}
