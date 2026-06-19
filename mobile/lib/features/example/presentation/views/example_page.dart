import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateful_page.dart';
import 'package:flutter_mvvm_leap/core/components/widgets/app_dialog.dart';
import 'package:flutter_mvvm_leap/core/components/widgets/app_example_button.dart';
import 'package:flutter_mvvm_leap/core/components/widgets/flushbar/flushbar_area_cubit.dart';
import 'package:flutter_mvvm_leap/core/di/app_dependencies.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/core/utils/show_actions.dart';
import 'package:flutter_mvvm_leap/features/example/presentation/view_models/example_page_cubit.dart';
import 'package:flutter_mvvm_leap/features/example/presentation/views/example_page_actions.dart';
import 'package:flutter_mvvm_leap/features/example/presentation/widgets/example_page_form.dart';

class ExamplePage extends StatefulWidget {
  const ExamplePage({super.key});

  @override
  ExamplePageState createState() => ExamplePageState();
}

class ExamplePageState extends AppStatefulPage<ExamplePage>
    implements ExamplePageActions {
  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    final cubit = context.read<ExamplePageCubit>();

    return BlocSelector<ExamplePageCubit, ExamplePageCubitState, bool>(
      selector: (state) => state.isLoading,
      builder: (context, isLoading) {
        return AbsorbPointer(
          absorbing: isLoading,
          child: SafeArea(
            child: Scaffold(
              backgroundColor: theme.primaryColor,
              body: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 32,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        'Título',
                        style: theme.titleLargeText.copyWith(
                          color: theme.secondaryColor,
                        ),
                      ),
                      const SizedBox(height: 16),
                      const ExamplePageForm(),
                      const SizedBox(height: 32),
                      AppExampleButton(
                        text: 'Botão',
                        onPressed: cubit.onExamplePressed,
                      ),
                      const SizedBox(height: 8),
                      AppExampleButton(
                        text: 'Mostrar flushbar',
                        onPressed: cubit.showFlushbar,
                      ),
                      const SizedBox(height: 8),
                      AppExampleButton(
                        text: 'Mostrar modal',
                        onPressed: cubit.showModalBottomSheet,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  List<BlocProvider>? get providers => [
        BlocProvider<ExamplePageCubit>(
          create: (context) => ExamplePageCubit(this),
        ),
      ];

  @override
  void showModalBottomSheet() {
    showAppDialog(
      name: '/example/modal-bottom-sheet',
      context: context,
      builder: (context) {
        final theme = context.read<AppTheme>();

        return AppDialog(
          children: [
            Text(
              'Mostrar modal',
              style: theme.titleLargeText.copyWith(
                color: theme.secondaryColor,
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  void showFlushbar() {
    injector.get<FlushbarAreaCubit>().showFlushbar(
          const Flushbar.alert(
            text: 'Título',
          ),
        );
  }
}
