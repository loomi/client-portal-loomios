import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';
import 'package:flutter_mvvm_leap/features/requests/data/datasources/requests_datasource.dart';
import 'package:flutter_mvvm_leap/features/requests/data/failures/requests_failures.dart';
import 'package:flutter_mvvm_leap/features/requests/data/mappers/client_request_mapper.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/repositories/requests_repository.dart';

class RequestsRepositoryImpl extends RequestsRepository {
  RequestsRepositoryImpl(this._datasource);

  final RequestsDatasource _datasource;

  @override
  Future<Result<RequestsFailure, List<ClientRequest>>> clientRequests() async {
    final result = await _datasource.clientRequests();

    return result.fold(
      (error) => Failure(error),
      (models) => Success(models.map(ClientRequestMapper.toEntity).toList()),
    );
  }

  @override
  Future<Result<RequestsFailure, ClientRequest>> requestById(String id) async {
    final result = await _datasource.requestById(id);

    return result.fold(
      (error) => Failure(error),
      (model) => Success(ClientRequestMapper.toEntity(model)),
    );
  }
}
