import 'package:flutter_mvvm_leap/core/di/injector.dart';
import 'package:flutter_mvvm_leap/core/services/url_launcher/url_launcher.dart';
import 'package:flutter_mvvm_leap/core/services/url_launcher/url_launcher_impl.dart';

Future<void> configureUrlLauncherDependencies(Injector injector) async {
  injector.registerFactory<UrlLauncher>(() => UrlLauncherImpl());
}
