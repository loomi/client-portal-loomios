import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateless_widget.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';

class AppExampleButton extends AppStatelessWidget {
  const AppExampleButton({
    required this.text,
    required this.onPressed,
    super.key,
  });

  final String text;
  final VoidCallback onPressed;

  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.all(theme.secondaryColor),
        foregroundColor: WidgetStateProperty.all(theme.primaryColor),
      ),
      child: Text(
        text,
        style: theme.titleLargeText.copyWith(
          color: theme.primaryColor,
        ),
      ),
    );
  }
}
