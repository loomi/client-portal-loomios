// ignore_for_file: use_build_context_synchronously
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateful_widget.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';

class HandleFieldVisibility extends StatefulWidget {
  const HandleFieldVisibility({
    required this.child,
    required this.focusNode,
    this.onFocusChanged,
    super.key,
  });

  final FocusNode focusNode;
  final Widget child;
  final VoidCallback? onFocusChanged;

  @override
  HandleFieldVisibilityState createState() => HandleFieldVisibilityState();
}

class HandleFieldVisibilityState
    extends AppStatefulWidget<HandleFieldVisibility>
    with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    widget.focusNode.addListener(_handleVisibility);
    if (widget.onFocusChanged != null) {
      widget.focusNode.addListener(widget.onFocusChanged!);
    }
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didChangeMetrics() =>
      widget.focusNode.hasFocus ? _handleVisibility() : null;

  Future<void> _keyboardChanged() async {
    if (mounted) {
      final edgeInsets = MediaQuery.of(context).viewInsets;
      while (mounted && MediaQuery.of(context).viewInsets == edgeInsets) {
        await Future.delayed(const Duration(milliseconds: 10));
      }
    }

    return;
  }

  Future<void> _handleVisibility() async {
    await Future.any([
      _keyboardChanged(),
      Future.delayed(const Duration(milliseconds: 100)),
    ]);

    if (!widget.focusNode.hasFocus) return;

    Scrollable.ensureVisible(
      context,
      curve: Curves.easeIn,
      duration: const Duration(milliseconds: 100),
      alignment: 0.4,
    );
  }

  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    return widget.child;
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    widget.focusNode.removeListener(_handleVisibility);
    if (widget.onFocusChanged != null) {
      widget.focusNode.removeListener(widget.onFocusChanged!);
    }
    super.dispose();
  }
}
