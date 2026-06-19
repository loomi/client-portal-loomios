import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_mvvm_leap/core/di/app_dependencies.dart';
import 'package:flutter_mvvm_leap/core/utils/extensions/cubit_extension.dart';
import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/repositories/requests_repository.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/views/requests_page_actions.dart';

part 'requests_page_state.dart';

class RequestsPageCubit extends Cubit<RequestsPageCubitState> {
  RequestsPageCubit(
    this._actions, {
    RequestsRepository? requestsRepository,
  })  : _requestsRepository = requestsRepository ?? injector.get(),
        super(const RequestsPageCubitState());

  RequestsPageActions? _actions;
  final RequestsRepository _requestsRepository;

  Future<void> load() async {
    safeEmit(state.copyWith(isLoading: true, hasError: false));
    final result = await _requestsRepository.clientRequests();

    if (result case Success(object: final requests)) {
      safeEmit(state.copyWith(isLoading: false, requests: requests));
    } else {
      safeEmit(state.copyWith(isLoading: false, hasError: true));
    }
  }

  void onRequestTap(String id) => _actions?.navToDetail(id);

  /// Demo of the "seu feedback virou entrega" push without Firebase: surfaces
  /// the delivery notification for the first resolved request and deep-links
  /// to its detail.
  ///
  /// INTEGRATION (FCM): `firebase_messaging` is already a dependency. Wire
  /// `FirebaseMessaging.onMessage` / `onMessageOpenedApp` to call this same
  /// flow with the `requestId` carried in the push payload — the UI side does
  /// not change.
  void onSimulateDeliveryPush() {
    final resolved = state.requests.where((r) => r.isResolved).toList();
    if (resolved.isEmpty) return;

    final request = resolved.first;
    _actions?.showDeliveryPush(request.title);
    _actions?.navToDetail(request.id);
  }

  @override
  Future<void> close() {
    _actions = null;
    return super.close();
  }
}
