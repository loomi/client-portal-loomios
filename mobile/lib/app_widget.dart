// ignore_for_file: depend_on_referenced_packages
import 'package:device_preview/device_preview.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/components/widgets/flushbar/flushbar_area.dart';
import 'package:flutter_mvvm_leap/core/di/app_dependencies.dart';
import 'package:flutter_mvvm_leap/core/routes/app_routes.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme_provider.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme_repository.dart';
import 'package:flutter_mvvm_leap/core/utils/no_glow_behavior.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

class AppWidget extends StatefulWidget {
  const AppWidget({super.key});

  @override
  State<AppWidget> createState() => _AppWidgetState();
}

class _AppWidgetState extends State<AppWidget> {
  final routerConfig = injector.get<AppRouter>().config;
  final themeRepository = injector.get<AppThemeRepository>();

  @override
  Widget build(BuildContext context) {
    return AppThemeProvider(
      initialTheme: themeRepository.initialAppTheme,
      child: MaterialApp.router(
        title: 'Flutter MVVM Leap',
        routerConfig: routerConfig,
        debugShowCheckedModeBanner: false,
        locale: const Locale('pt', 'BR'),
        supportedLocales: const [
          Locale('pt', 'BR'),
        ],
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
        ],
        builder: (context, child) {
          return Directionality(
            textDirection: TextDirection.ltr,
            child: MediaQuery(
              data: MediaQuery.of(context).copyWith(
                textScaler: MediaQuery.of(context).textScaler.clamp(
                      minScaleFactor: 1.0,
                      maxScaleFactor: 1.5,
                    ),
              ),
              child: ScrollConfiguration(
                behavior: NoGlowBehavior(),
                child: DevicePreview.appBuilder(
                  context,
                  Stack(
                    children: [
                      if (child != null) child,
                      const FlushbarArea(),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
