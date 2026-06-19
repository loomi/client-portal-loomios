import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';

abstract class AppStatefulPage<T extends StatefulWidget> extends State<T> {
  List<BlocProvider>? get providers => null;

  Widget buildWidget(BuildContext context, AppTheme theme);

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<AppTheme>();

    if (providers?.isNotEmpty ?? false) {
      return MultiBlocProvider(
        providers: providers!,
        child: Builder(
          builder: (context) => buildWidget(context, theme),
        ),
      );
    } else {
      return buildWidget(context, theme);
    }
  }
}
