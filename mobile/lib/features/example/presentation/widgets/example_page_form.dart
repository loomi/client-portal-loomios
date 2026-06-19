import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateless_widget.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/features/example/presentation/view_models/example_page_cubit.dart';
import 'package:provider/provider.dart';

class ExamplePageForm extends AppStatelessWidget {
  const ExamplePageForm({super.key});

  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    final cubit = context.watch<ExamplePageCubit>();

    return Form(
      child: Column(
        children: [
          TextField(
            onChanged: cubit.onFieldChanged,
            decoration: const InputDecoration(
              labelText: 'Exemplo',
              hintText: 'Dica do exemplo',
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            onChanged: cubit.onField2Changed,
            decoration: const InputDecoration(
              labelText: 'Exemplo 2',
              hintText: 'Dica do exemplo 2',
            ),
          ),
        ],
      ),
    );
  }
}
