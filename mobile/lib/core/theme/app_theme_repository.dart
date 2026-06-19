import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_mvvm_leap/core/services/device/local_preferences/device_local_preferences.dart';
import 'package:flutter_mvvm_leap/core/services/device/local_preferences/enums/device_local_preferences_key.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/core/theme/enums/app_user_theme_preference.dart';
import 'package:flutter_mvvm_leap/core/theme/themes/app_dark_theme.dart';
import 'package:flutter_mvvm_leap/core/theme/themes/app_light_theme.dart';

class AppThemeRepository {
  AppThemeRepository(this._localPreferences);

  final DeviceLocalPreferences _localPreferences;

  Future<void> setUserThemePreference(AppTheme preference) {
    return _localPreferences.setString(
      DeviceLocalPreferencesKey.appTheme.name,
      preference is AppDarkTheme
          ? AppUserThemePreference.dark.name
          : AppUserThemePreference.light.name,
    );
  }

  AppTheme get initialAppTheme {
    final preferenceTheme = _localPreferences.getString(
      DeviceLocalPreferencesKey.appTheme.name,
    );

    if (preferenceTheme == null) {
      final brightness =
          SchedulerBinding.instance.platformDispatcher.platformBrightness;
      return brightness == Brightness.dark ? AppDarkTheme() : AppLightTheme();
    }

    return preferenceTheme == AppUserThemePreference.dark.name
        ? AppDarkTheme()
        : AppLightTheme();
  }
}
