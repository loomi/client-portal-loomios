import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';
import 'package:flutter_mvvm_leap/features/example/data/failures/example_failures.dart';
import 'package:flutter_mvvm_leap/features/example/data/models/example_api_model.dart';

abstract class ExampleDatasource {
  Future<Result<ExampleFailure, ExampleApiModel>> example();
}
