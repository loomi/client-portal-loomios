import 'dart:async';
import 'package:device_preview/device_preview.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/app_widget.dart';
import 'package:flutter_mvvm_leap/core/di/app_dependencies.dart';
import 'package:flutter_mvvm_leap/core/flavor/flavor_config.dart';

Future<void> bootstrap(FlavorConfig flavorConfig) async {
  runZonedGuarded(
    () async {
      WidgetsFlutterBinding.ensureInitialized();

      await configureAppDependencies(flavorConfig);

      runApp(
        DevicePreview(
          builder: (context) => const AppWidget(),
          enabled: const bool.fromEnvironment(
            'DEVICE_PREVIEW',
            defaultValue: false,
          ),
        ),
      );
    },
    (error, stack) {
      debugPrint('$error $stack');
    },
  );
}
