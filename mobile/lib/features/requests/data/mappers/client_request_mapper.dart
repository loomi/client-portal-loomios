import 'package:flutter_mvvm_leap/features/requests/data/models/client_request_api_model.dart';
import 'package:flutter_mvvm_leap/features/requests/domain/entities/client_request.dart';

class ClientRequestMapper {
  static ClientRequest toEntity(ClientRequestApiModel model) {
    return ClientRequest(
      id: model.id,
      title: model.title,
      summary: model.summary,
      status: _statusFromApi(model.status),
      createdAt: DateTime.parse(model.createdAt),
      updatedAt: DateTime.parse(model.updatedAt),
      category: model.category,
      priority: model.priority,
      ownerName: model.ownerName,
      deliveryNote: model.deliveryNote,
      timeline: model.timeline
          .map(
            (e) => RequestStatusEvent(
              status: _statusFromApi(e.status),
              at: DateTime.parse(e.at),
              note: e.note,
            ),
          )
          .toList(),
    );
  }

  static RequestStatus _statusFromApi(String value) {
    return RequestStatus.values.firstWhere(
      (s) => s.name == value,
      orElse: () => RequestStatus.received,
    );
  }
}
