import 'package:equatable/equatable.dart';

/// Wire shape of a request. Keys MUST match the payload Lucas's tickets/status
/// endpoint emits — this is the integration contract. Dates are ISO-8601
/// strings; [status] is one of: received | inAnalysis | approved | rejected |
/// resolved. Parsing String → enum/DateTime happens in the mapper.
class ClientRequestApiModel extends Equatable {
  const ClientRequestApiModel({
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
  final String status;
  final String createdAt;
  final String updatedAt;
  final List<RequestStatusEventApiModel> timeline;
  final String? category;
  final String? priority;
  final String? ownerName;
  final String? deliveryNote;

  factory ClientRequestApiModel.fromJson(Map<String, dynamic> json) {
    return ClientRequestApiModel(
      id: json['id'] as String,
      title: json['title'] as String,
      summary: json['summary'] as String,
      status: json['status'] as String,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
      category: json['category'] as String?,
      priority: json['priority'] as String?,
      ownerName: json['ownerName'] as String?,
      deliveryNote: json['deliveryNote'] as String?,
      timeline: (json['timeline'] as List<dynamic>? ?? [])
          .map((e) => RequestStatusEventApiModel.fromJson(
                e as Map<String, dynamic>,
              ))
          .toList(),
    );
  }

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

class RequestStatusEventApiModel extends Equatable {
  const RequestStatusEventApiModel({
    required this.status,
    required this.at,
    this.note,
  });

  final String status;
  final String at;
  final String? note;

  factory RequestStatusEventApiModel.fromJson(Map<String, dynamic> json) {
    return RequestStatusEventApiModel(
      status: json['status'] as String,
      at: json['at'] as String,
      note: json['note'] as String?,
    );
  }

  @override
  List<Object?> get props => [status, at, note];
}
