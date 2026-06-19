import 'package:equatable/equatable.dart';

/// Lifecycle of a client request inside the feedback loop.
/// recebido → em análise → aprovado/recusado → resolvido
enum RequestStatus { received, inAnalysis, approved, rejected, resolved }

/// One step in a request's history — powers the detail timeline.
class RequestStatusEvent extends Equatable {
  const RequestStatusEvent({
    required this.status,
    required this.at,
    this.note,
  });

  final RequestStatus status;
  final DateTime at;
  final String? note;

  @override
  List<Object?> get props => [status, at, note];
}

/// Client-facing view of a feedback as it moves through the loop.
///
/// [category] / [priority] / [ownerName] are the triage output produced by
/// Lucas's AI (Grupo 2) and may be null until triage runs. [deliveryNote] is
/// filled once the request is [RequestStatus.resolved] — it powers the
/// "seu feedback virou entrega" push.
class ClientRequest extends Equatable {
  const ClientRequest({
    required this.id,
    required this.title,
    required this.summary,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    required this.timeline,
    this.category,
    this.priority,
    this.ownerName,
    this.deliveryNote,
  });

  final String id;
  final String title;
  final String summary;
  final RequestStatus status;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<RequestStatusEvent> timeline;
  final String? category;
  final String? priority;
  final String? ownerName;
  final String? deliveryNote;

  bool get isResolved => status == RequestStatus.resolved;

  @override
  List<Object?> get props => [
        id,
        title,
        summary,
        status,
        createdAt,
        updatedAt,
        timeline,
        category,
        priority,
        ownerName,
        deliveryNote,
      ];
}
