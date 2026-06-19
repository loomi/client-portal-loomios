import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateless_widget.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/core/utils/extensions/date_time_extension.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/widgets/request_status_chip.dart';

class RequestCard extends AppStatelessWidget {
  const RequestCard({
    required this.request,
    required this.onTap,
    super.key,
  });

  final ClientRequest request;
  final VoidCallback onTap;

  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.surfaceColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: theme.borderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      request.title,
                      style: theme.titleMediumText.copyWith(
                        color: theme.secondaryColor,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  RequestStatusChip(status: request.status),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                request.summary,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: theme.bodyMediumText.copyWith(color: theme.mutedColor),
              ),
              const SizedBox(height: 12),
              Text(
                'Atualizado em ${request.updatedAt.formatted}',
                style: theme.labelSmallText.copyWith(color: theme.mutedColor),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
