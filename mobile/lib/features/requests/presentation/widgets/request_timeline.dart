import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/components/base/app_stateless_widget.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/core/utils/extensions/date_time_extension.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/widgets/request_status_visuals.dart';

/// Vertical status timeline: recebido → em análise → aprovado/recusado →
/// resolvido. The last event is the current status (highlighted).
class RequestTimeline extends AppStatelessWidget {
  const RequestTimeline({required this.events, super.key});

  final List<RequestStatusEvent> events;

  @override
  Widget buildWidget(BuildContext context, AppTheme theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < events.length; i++)
          _TimelineRow(
            event: events[i],
            isLast: i == events.length - 1,
            isCurrent: i == events.length - 1,
            theme: theme,
          ),
      ],
    );
  }
}

class _TimelineRow extends StatelessWidget {
  const _TimelineRow({
    required this.event,
    required this.isLast,
    required this.isCurrent,
    required this.theme,
  });

  final RequestStatusEvent event;
  final bool isLast;
  final bool isCurrent;
  final AppTheme theme;

  @override
  Widget build(BuildContext context) {
    final color = event.status.color(theme);

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            children: [
              Container(
                width: 14,
                height: 14,
                decoration: BoxDecoration(
                  color: isCurrent ? color : theme.surfaceColor,
                  shape: BoxShape.circle,
                  border: Border.all(color: color, width: 2),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: theme.borderColor,
                  ),
                ),
            ],
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0 : 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    event.status.label,
                    style: theme.titleMediumText.copyWith(
                      color: isCurrent ? color : theme.secondaryColor,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    event.at.formatted,
                    style:
                        theme.labelSmallText.copyWith(color: theme.mutedColor),
                  ),
                  if (event.note != null) ...[
                    const SizedBox(height: 6),
                    Text(
                      event.note!,
                      style: theme.bodyMediumText
                          .copyWith(color: theme.secondaryColor),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
