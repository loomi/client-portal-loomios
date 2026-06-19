import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateful_page.dart';
import 'package:flutter_mvvm_leap/core/components/widgets/app_example_button.dart';
import 'package:flutter_mvvm_leap/core/components/widgets/flushbar/flushbar_area_cubit.dart';
import 'package:flutter_mvvm_leap/core/di/app_dependencies.dart';
import 'package:flutter_mvvm_leap/core/routes/app_routes.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/core/utils/extensions/context_extension.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/view_models/requests_page_cubit.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/views/requests_page_actions.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/widgets/request_card.dart';

class RequestsPage extends StatefulWidget {
  const RequestsPage({super.key});

  @override
  RequestsPageState createState() => RequestsPageState();
}

class RequestsPageState extends AppStatefulPage<RequestsPage> implements RequestsPageActions {
  late final _cubit = RequestsPageCubit(this);

  @override
  void initState() {
    super.initState();
    _cubit.load();
  }

  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: theme.primaryColor,
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Seus pedidos',
                style: theme.titleLargeText.copyWith(
                  color: theme.secondaryColor,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Acompanhe o que você pediu e em que pé está.',
                style: theme.bodyMediumText.copyWith(color: theme.mutedColor),
              ),
              const SizedBox(height: 16),
              AppExampleButton(
                text: 'Simular push de entrega',
                onPressed: _cubit.onSimulateDeliveryPush,
              ),
              const SizedBox(height: 16),
              Expanded(
                child: BlocBuilder<RequestsPageCubit, RequestsPageCubitState>(
                  bloc: _cubit,
                  builder: (context, state) {
                    if (state.isLoading) {
                      return Center(
                        child: CircularProgressIndicator(
                          color: theme.secondaryColor,
                        ),
                      );
                    }

                    if (state.hasError) {
                      return _ErrorView(
                        theme: theme,
                        onRetry: _cubit.load,
                      );
                    }

                    return ListView.separated(
                      itemCount: state.requests.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final request = state.requests[index];
                        return RequestCard(
                          request: request,
                          onTap: () => _cubit.onRequestTap(request.id),
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  List<BlocProvider> get providers => [BlocProvider.value(value: _cubit)];

  @override
  void navToDetail(String id) => context.push(AppRoutes.requestDetailPath(id));

  @override
  void showDeliveryPush(String requestTitle) {
    injector.get<FlushbarAreaCubit>().showFlushbar(
          Flushbar.alert(
            text: 'Seu feedback virou entrega: $requestTitle',
            duration: const Duration(seconds: 3),
          ),
        );
  }

  @override
  void dispose() {
    _cubit.close();
    super.dispose();
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({
    required this.theme,
    required this.onRetry,
  });

  final AppTheme theme;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            'Não foi possível carregar seus pedidos.',
            textAlign: TextAlign.center,
            style: theme.titleMediumText.copyWith(color: theme.secondaryColor),
          ),
          const SizedBox(height: 12),
          AppExampleButton(
            text: 'Tentar de novo',
            onPressed: onRetry,
          ),
        ],
      ),
    );
  }
}
