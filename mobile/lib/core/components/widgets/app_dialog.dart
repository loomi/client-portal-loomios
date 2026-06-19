import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateless_widget.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';

class AppDialog extends AppStatelessWidget {
  const AppDialog({required this.children, super.key});

  final List<Widget> children;

  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    return Dialog(
      elevation: 0,
      insetPadding: const EdgeInsets.all(16),
      backgroundColor: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: theme.primaryColor,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: children,
        ),
      ),
    );
  }
}
