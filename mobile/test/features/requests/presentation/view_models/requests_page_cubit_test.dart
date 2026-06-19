import 'package:bloc_test/bloc_test.dart';
import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';
import 'package:flutter_mvvm_leap/features/requests/data/failures/requests_failures.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/repositories/requests_repository.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/view_models/requests_page_cubit.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/views/requests_page_actions.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

class MockRequestsRepository extends Mock implements RequestsRepository {}

class MockRequestsPageActions extends Mock implements RequestsPageActions {}

ClientRequest _request({
  required String id,
  required RequestStatus status,
}) {
  final at = DateTime(2026, 6, 18);
  return ClientRequest(
    id: id,
    title: 'Request $id',
    summary: 'summary',
    status: status,
    createdAt: at,
    updatedAt: at,
    timeline: const [],
  );
}

void main() {
  late MockRequestsRepository repository;
  late MockRequestsPageActions actions;

  setUp(() {
    repository = MockRequestsRepository();
    actions = MockRequestsPageActions();
  });

  RequestsPageCubit build() =>
      RequestsPageCubit(actions, requestsRepository: repository);

  group('load', () {
    final requests = [_request(id: 'req-001', status: RequestStatus.resolved)];

    blocTest<RequestsPageCubit, RequestsPageCubitState>(
      'emits loading then the loaded requests on success',
      setUp: () => when(repository.clientRequests)
          .thenAnswer((_) async => Success(requests)),
      build: build,
      act: (cubit) => cubit.load(),
      expect: () => [
        const RequestsPageCubitState(isLoading: true),
        RequestsPageCubitState(requests: requests),
      ],
    );

    blocTest<RequestsPageCubit, RequestsPageCubitState>(
      'emits loading then hasError on failure',
      setUp: () => when(repository.clientRequests).thenAnswer(
        (_) async => const Failure(FailureInfo(type: RequestsFailure.unknown)),
      ),
      build: build,
      act: (cubit) => cubit.load(),
      expect: () => [
        const RequestsPageCubitState(isLoading: true),
        const RequestsPageCubitState(hasError: true),
      ],
    );
  });

  group('onSimulateDeliveryPush', () {
    blocTest<RequestsPageCubit, RequestsPageCubitState>(
      'routes to the first resolved request and shows the push',
      setUp: () => when(repository.clientRequests).thenAnswer(
        (_) async => Success([
          _request(id: 'req-002', status: RequestStatus.inAnalysis),
          _request(id: 'req-001', status: RequestStatus.resolved),
        ]),
      ),
      build: build,
      act: (cubit) async {
        await cubit.load();
        cubit.onSimulateDeliveryPush();
      },
      verify: (_) {
        verify(() => actions.showDeliveryPush('Request req-001')).called(1);
        verify(() => actions.navToDetail('req-001')).called(1);
      },
    );

    blocTest<RequestsPageCubit, RequestsPageCubitState>(
      'does nothing when there is no resolved request',
      setUp: () => when(repository.clientRequests).thenAnswer(
        (_) async =>
            Success([_request(id: 'req-002', status: RequestStatus.received)]),
      ),
      build: build,
      act: (cubit) async {
        await cubit.load();
        cubit.onSimulateDeliveryPush();
      },
      verify: (_) {
        verifyNever(() => actions.showDeliveryPush(any()));
        verifyNever(() => actions.navToDetail(any()));
      },
    );
  });
}
