import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateful_page.dart';
import 'package:flutter_mvvm_leap/core/routes/app_routes.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/core/utils/extensions/context_extension.dart';
import 'package:flutter_mvvm_leap/features/splash/presentation/view_models/splash_page_cubit.dart';
import 'package:flutter_mvvm_leap/features/splash/presentation/views/splash_page_actions.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  SplashPageState createState() => SplashPageState();
}

class SplashPageState extends AppStatefulPage<SplashPage>
    implements SplashPageActions {
  late final _cubit = SplashPageCubit(this);

  @override
  void initState() {
    super.initState();
    _cubit.initalize();
  }

  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    return Scaffold(
      body: Container(
        color: theme.primaryColor,
        child: Center(
          child: Text(
            'Flutter MVVM Leap',
            textAlign: TextAlign.center,
            style: theme.displayLargeText.copyWith(
              color: theme.secondaryColor,
            ),
          ),
        ),
      ),
    );
  }

  @override
  void navToRequests() => context.go(AppRoutes.requests);

  @override
  List<BlocProvider>? get providers => [BlocProvider.value(value: _cubit)];

  @override
  void dispose() {
    _cubit.close();
    super.dispose();
  }
}
