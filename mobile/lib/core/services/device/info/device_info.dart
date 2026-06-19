import 'package:flutter_mvvm_leap/core/utils/helpers/result/enums/generic_failure.dart';
import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';

abstract class DeviceInfo {
  Future<bool> checkLocaleSupport();
  Future<Result<GenericFailure, void>> downloadAndSaveFile(
    String url,
    String fileName,
  );
}
