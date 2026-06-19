import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_mvvm_leap/core/di/app_dependencies.dart';
import 'package:flutter_mvvm_leap/core/utils/extensions/cubit_extension.dart';
import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/repositories/requests_repository.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/views/request_detail_page_actions.dart';

part 'request_detail_page_state.dart';

class RequestDetailPageCubit extends Cubit<RequestDetailPageCubitState> {
  RequestDetailPageCubit(
    this._actions,
    this._id, {
    RequestsRepository? requestsRepository,
  })  : _requestsRepository = requestsRepository ?? injector.get(),
        super(const RequestDetailPageCubitState());

  RequestDetailPageActions? _actions;
  final String _id;
  final RequestsRepository _requestsRepository;

  Future<void> load() async {
    safeEmit(state.copyWith(isLoading: true, hasError: false));
    final result = await _requestsRepository.requestById(_id);

    if (result case Success(object: final request)) {
      safeEmit(state.copyWith(isLoading: false, request: request));
    } else {
      safeEmit(state.copyWith(isLoading: false, hasError: true));
    }
  }

  void onBackPressed() => _actions?.goBack();

  @override
  Future<void> close() {
    _actions = null;
    return super.close();
  }
}
