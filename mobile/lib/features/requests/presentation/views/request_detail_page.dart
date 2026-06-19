import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateful_page.dart';
import 'package:flutter_mvvm_leap/core/components/widgets/app_example_button.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/core/utils/extensions/context_extension.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/view_models/request_detail_page_cubit.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/views/request_detail_page_actions.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/widgets/request_status_chip.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/widgets/request_timeline.dart';

class RequestDetailPage extends StatefulWidget {
  const RequestDetailPage({required this.id, super.key});

  final String id;

  @override
  RequestDetailPageState createState() => RequestDetailPageState();
}

class RequestDetailPageState extends AppStatefulPage<RequestDetailPage> implements RequestDetailPageActions {
  late final _cubit = RequestDetailPageCubit(this, widget.id);

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
        appBar: AppBar(
          backgroundColor: theme.primaryColor,
          foregroundColor: theme.secondaryColor,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: _cubit.onBackPressed,
          ),
          title: Text(
            'Detalhe do pedido',
            style: theme.titleMediumText.copyWith(color: theme.secondaryColor),
          ),
        ),
        body: BlocBuilder<RequestDetailPageCubit, RequestDetailPageCubitState>(
          bloc: _cubit,
          builder: (context, state) {
            if (state.isLoading) {
              return Center(
                child: CircularProgressIndicator(color: theme.secondaryColor),
              );
            }

            if (state.hasError || state.request == null) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Pedido não encontrado.',
                      textAlign: TextAlign.center,
                      style: theme.titleMediumText.copyWith(color: theme.secondaryColor),
                    ),
                    const SizedBox(height: 12),
                    AppExampleButton(
                      text: 'Tentar de novo',
                      onPressed: _cubit.load,
                    ),
                  ],
                ),
              );
            }

            return _DetailContent(
              request: state.request!,
              theme: theme,
            );
          },
        ),
      ),
    );
  }

  @override
  List<BlocProvider> get providers => [BlocProvider.value(value: _cubit)];

  @override
  void goBack() => context.pop();

  @override
  void dispose() {
    _cubit.close();
    super.dispose();
  }
}

class _DetailContent extends StatelessWidget {
  const _DetailContent({
    required this.request,
    required this.theme,
  });

  final ClientRequest request;
  final AppTheme theme;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            request.title,
            style: theme.titleLargeText.copyWith(color: theme.secondaryColor),
          ),
          const SizedBox(height: 12),
          RequestStatusChip(status: request.status),
          const SizedBox(height: 16),
          Text(
            request.summary,
            style: theme.bodyMediumText.copyWith(color: theme.secondaryColor),
          ),
          const SizedBox(height: 20),
          _MetaCard(request: request, theme: theme),
          if (request.isResolved && request.deliveryNote != null) ...[
            const SizedBox(height: 16),
            _DeliveryCard(note: request.deliveryNote!, theme: theme),
          ],
          const SizedBox(height: 24),
          Text(
            'Linha do tempo',
            style: theme.titleMediumText.copyWith(color: theme.secondaryColor),
          ),
          const SizedBox(height: 16),
          RequestTimeline(events: request.timeline),
        ],
      ),
    );
  }
}

class _MetaCard extends StatelessWidget {
  const _MetaCard({
    required this.request,
    required this.theme,
  });

  final ClientRequest request;
  final AppTheme theme;

  @override
  Widget build(BuildContext context) {
    final rows = <Widget>[
      if (request.category != null) _row('Categoria', request.category!),
      if (request.priority != null) _row('Prioridade', request.priority!),
      if (request.ownerName != null) _row('Responsável', request.ownerName!),
    ];

    if (rows.isEmpty) {
      rows.add(
        _row('Triagem', 'Aguardando triagem'),
      );
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.borderColor),
      ),
      child: Column(children: rows),
    );
  }

  Widget _row(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 96,
            child: Text(
              label,
              style: theme.labelSmallText.copyWith(color: theme.mutedColor),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              value,
              style: theme.bodyMediumText.copyWith(color: theme.secondaryColor),
            ),
          ),
        ],
      ),
    );
  }
}

class _DeliveryCard extends StatelessWidget {
  const _DeliveryCard({
    required this.note,
    required this.theme,
  });

  final String note;
  final AppTheme theme;

  @override
  Widget build(BuildContext context) {
    final color = theme.statusResolvedColor;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Sua entrega',
            style: theme.titleMediumText.copyWith(color: color),
          ),
          const SizedBox(height: 6),
          Text(
            note,
            style: theme.bodyMediumText.copyWith(color: theme.secondaryColor),
          ),
        ],
      ),
    );
  }
}
