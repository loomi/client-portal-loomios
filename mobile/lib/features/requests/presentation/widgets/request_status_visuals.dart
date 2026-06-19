import 'package:flutter/material.dart';
import 'package:flutter_mvvm_leap/core/theme/app_theme.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';

/// Maps a [RequestStatus] to its pt-BR label and theme colour.
extension RequestStatusVisuals on RequestStatus {
  String get label => switch (this) {
        RequestStatus.received => 'Recebido',
        RequestStatus.inAnalysis => 'Em análise',
        RequestStatus.approved => 'Aprovado',
        RequestStatus.rejected => 'Recusado',
        RequestStatus.resolved => 'Resolvido',
      };

  Color color(AppTheme theme) => switch (this) {
        RequestStatus.received => theme.statusReceivedColor,
        RequestStatus.inAnalysis => theme.statusInAnalysisColor,
        RequestStatus.approved => theme.statusApprovedColor,
        RequestStatus.rejected => theme.statusRejectedColor,
        RequestStatus.resolved => theme.statusResolvedColor,
      };
}
