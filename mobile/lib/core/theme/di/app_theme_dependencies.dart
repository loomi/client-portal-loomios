import 'package:flutter_mvvm_leap/core/di/injector.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme_repository.dart';

Future<void> configureAppThemeDependencies(Injector injector) async {
  injector.registerFactory<AppThemeRepository>(
      () => AppThemeRepository(injector.get()));
}
