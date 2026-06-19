import 'package:flutter_mvvm_leap/core/components/widgets/flushbar/flushbar_area_cubit.dart';
import 'package:flutter_mvvm_leap/core/routes/app_routes.dart';
import 'package:flutter_mvvm_leap/core/services/device/di/device_dependencies.dart';
import 'package:flutter_mvvm_leap/core/di/get_it_injector_impl.dart';
import 'package:flutter_mvvm_leap/core/flavor/flavor_config.dart';
import 'package:flutter_mvvm_leap/core/logs/app_logger.dart';
import 'package:flutter_mvvm_leap/core/network/dio_client_impl.dart';
import 'package:flutter_mvvm_leap/core/network/http_client.dart';
import 'package:flutter_mvvm_leap/core/network/dio_client_config.dart';
import 'package:flutter_mvvm_leap/core/services/event_bus/app_event_bus.dart';
import 'package:flutter_mvvm_leap/core/services/url_launcher/di/url_launcher_dependencies.dart';
import 'package:flutter_mvvm_leap/core/theme/di/app_theme_dependencies.dart';
import 'package:flutter_mvvm_leap/features/example/data/di/example_dependencies.dart';
import 'package:flutter_mvvm_leap/features/requests/data/di/requests_dependencies.dart';

final injector = GetItInjectorImpl();

Future<void> configureAppDependencies(FlavorConfig flavorConfig) async {
  injector.registerSingleton<FlavorConfig>(flavorConfig);

  injector.registerSingleton<AppEventBus>(AppEventBus());

  injector.registerLazySingleton<FlushbarAreaCubit>(() => FlushbarAreaCubit());

  injector.registerLazySingleton<AppLogger>(
    () => AppLoggerManager(
      loggers: [TerminalLogger()],
    ),
  );

  injector.registerLazySingleton<HttpClient>(
    () => DioClientImpl(DioClientConfig(flavorConfig).dio),
  );

  await configureDeviceDependencies(injector);

  configureUrlLauncherDependencies(injector);

  configureAppThemeDependencies(injector);

  configureExampleDependencies(injector);

  await configureRequestsDependencies(injector);

  injector.registerSingleton<AppRouter>(AppRouter());
}
