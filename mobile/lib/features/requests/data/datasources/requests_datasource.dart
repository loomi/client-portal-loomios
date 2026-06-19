import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';
import 'package:flutter_mvvm_leap/features/requests/data/failures/requests_failures.dart';
import 'package:flutter_mvvm_leap/features/requests/data/models/client_request_api_model.dart';

abstract class RequestsDatasource {
  Future<Result<RequestsFailure, List<ClientRequestApiModel>>> clientRequests();
  Future<Result<RequestsFailure, ClientRequestApiModel>> requestById(String id);
}
