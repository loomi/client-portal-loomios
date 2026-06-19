import 'package:flutter_mvvm_leap/core/di/injector.dart';
import 'package:flutter_mvvm_leap/features/example/data/datasources/example_datasource.dart';
import 'package:flutter_mvvm_leap/features/example/data/datasources/example_datasource_impl.dart';
import 'package:flutter_mvvm_leap/features/example/data/repositories/example_repository_impl.dart';
import 'package:flutter_mvvm_leap/features/example/domain/repositories/example_repository.dart';

Future<void> configureExampleDependencies(Injector injector) async {
  injector.registerFactory<ExampleDatasource>(
    () => ExampleDatasourceImpl(injector.get(), injector.get()),
  );

  injector.registerFactory<ExampleRepository>(
    () => ExampleRepositoryImpl(injector.get()),
  );
}
