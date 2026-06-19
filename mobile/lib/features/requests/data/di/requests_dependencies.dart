import 'package:flutter_mvvm_leap/core/di/injector.dart';
import 'package:flutter_mvvm_leap/features/requests/data/datasources/requests_datasource.dart';
import 'package:flutter_mvvm_leap/features/requests/data/datasources/requests_datasource_impl.dart';
import 'package:flutter_mvvm_leap/features/requests/data/repositories/requests_repository_impl.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/repositories/requests_repository.dart';

Future<void> configureRequestsDependencies(Injector injector) async {
  injector.registerFactory<RequestsDatasource>(
    () => RequestsDatasourceImpl(injector.get(), injector.get()),
  );

  injector.registerFactory<RequestsRepository>(
    () => RequestsRepositoryImpl(injector.get()),
  );
}
