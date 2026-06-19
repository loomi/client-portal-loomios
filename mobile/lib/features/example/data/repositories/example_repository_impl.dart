import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';
import 'package:flutter_mvvm_leap/features/example/data/datasources/example_datasource.dart';
import 'package:flutter_mvvm_leap/features/example/data/failures/example_failures.dart';
import 'package:flutter_mvvm_leap/features/example/data/mappers/example_mapper.dart';
import 'package:flutter_mvvm_leap/features/example/domain/entities/example.dart';
import 'package:flutter_mvvm_leap/features/example/domain/repositories/example_repository.dart';

class ExampleRepositoryImpl extends ExampleRepository {
  ExampleRepositoryImpl(this._exampleDatasource);

  final ExampleDatasource _exampleDatasource;

  @override
  Future<Result<ExampleFailure, Example>> example() async {
    final result = await _exampleDatasource.example();

    return result.fold(
      (error) => Failure(error),
      (example) => Success(ExampleMapper.toEntity(example)),
    );
  }
}
