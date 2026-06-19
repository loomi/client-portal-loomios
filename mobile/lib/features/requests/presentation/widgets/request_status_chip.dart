import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateless_widget.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/widgets/request_status_visuals.dart';

class RequestStatusChip extends AppStatelessWidget {
  const RequestStatusChip({required this.status, super.key});

  final RequestStatus status;

  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    final color = status.color(theme);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            status.label,
            style: theme.labelSmallText.copyWith(color: color),
          ),
        ],
      ),
    );
  }
}
