import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:provider/provider.dart';

abstract class AppStatelessWidget extends StatelessWidget {
  const AppStatelessWidget({super.key});

  Widget buildWidget(BuildContext context, AppTheme theme);

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<AppTheme>();

    return buildWidget(context, theme);
  }
}
