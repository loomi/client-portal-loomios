import 'package:flutter_mvvm_leap/features/example/presentation/views/example_page_actions.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:flutter_mvvm_leap/features/example/presentation/view_models/example_page_cubit.dart';
import 'package:flutter_mvvm_leap/features/example/domain/repositories/example_repository.dart';

class MockExampleRepository extends Mock implements ExampleRepository {}

class MockExamplePageActions extends Mock implements ExamplePageActions {}

void main() {
  late ExamplePageCubit cubit;
  late MockExamplePageActions actions;
  late MockExampleRepository exampleRepository;
  setUp(() {
    actions = MockExamplePageActions();
    exampleRepository = MockExampleRepository();
    cubit = ExamplePageCubit(
      actions,
      exampleRepository: exampleRepository,
    );
  });

  tearDown(() {
    cubit.close();
  });

  //TODO: Add tests
}
