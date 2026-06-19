import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';
import 'package:flutter_mvvm_leap/features/requests/data/failures/requests_failures.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';

abstract class RequestsRepository {
  Future<Result<RequestsFailure, List<ClientRequest>>> clientRequests();
  Future<Result<RequestsFailure, ClientRequest>> requestById(String id);
}
