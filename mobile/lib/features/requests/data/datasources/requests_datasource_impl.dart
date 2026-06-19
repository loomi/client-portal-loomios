import 'package:flutter_mvvm_leap/core/logs/app_logger.dart';
import 'package:flutter_mvvm_leap/core/network/http_client.dart';
import 'package:flutter_mvvm_leap/core/utils/helpers/result/result.dart';
import 'package:flutter_mvvm_leap/features/requests/data/datasources/requests_datasource.dart';
import 'package:flutter_mvvm_leap/features/requests/data/failures/requests_failures.dart';
import 'package:flutter_mvvm_leap/features/requests/data/models/client_request_api_model.dart';

/// MOCK-FIRST datasource — this file is the ONLY place that fakes data.
///
/// Mock requests live in the energy-sector demo project and are built through
/// [ClientRequestApiModel.fromJson] so the parse path is exercised now, not at
/// integration time. To go live, swap the marked blocks for the `_httpClient`
/// calls (kept injected and ready) — nothing above this layer changes.
class RequestsDatasourceImpl extends RequestsDatasource {
  RequestsDatasourceImpl(this._httpClient, this._logger);

  // ignore: unused_field — kept injected; the real call sites are below.
  final HttpClient _httpClient;
  final AppLogger _logger;

  @override
  Future<Result<RequestsFailure, List<ClientRequestApiModel>>>
      clientRequests() async {
    try {
      // MOCK: remove when Lucas's endpoint is live. Shape matches GET /requests.
      await Future<void>.delayed(const Duration(milliseconds: 400));
      final models =
          _mockRequests.map(ClientRequestApiModel.fromJson).toList();
      return Success(models);
      // INTEGRATION: replace the block above with:
      // final result = await _httpClient.get('/requests');
      // final models = (result.data as List)
      //     .map((e) => ClientRequestApiModel.fromJson(e as Map<String, dynamic>))
      //     .toList();
      // return Success(models);
    } catch (e) {
      _logger.e(e);
      return const Failure(FailureInfo(type: RequestsFailure.unknown));
    }
  }

  @override
  Future<Result<RequestsFailure, ClientRequestApiModel>> requestById(
    String id,
  ) async {
    try {
      // MOCK: remove when Lucas's endpoint is live. Shape matches GET /requests/:id.
      await Future<void>.delayed(const Duration(milliseconds: 250));
      final matches = _mockRequests.where((r) => r['id'] == id).toList();
      if (matches.isEmpty) {
        return const Failure(FailureInfo(type: RequestsFailure.notFound));
      }
      return Success(ClientRequestApiModel.fromJson(matches.first));
      // INTEGRATION: replace the block above with:
      // final result = await _httpClient.get('/requests/$id');
      // return Success(ClientRequestApiModel.fromJson(result.data));
    } catch (e) {
      _logger.e(e);
      return const Failure(FailureInfo(type: RequestsFailure.unknown));
    }
  }
}

// ============================ MOCK DATA (delete on integration) ============
// Single energy-sector demo project — the shared golden-path scenario.
const List<Map<String, dynamic>> _mockRequests = [
  {
    'id': 'req-001',
    'title': 'Ajustar painel de consumo por unidade',
    'summary':
        'Pedi para o painel mostrar o consumo separado por usina, não só o total.',
    'status': 'resolved',
    'createdAt': '2026-06-10T09:12:00.000Z',
    'updatedAt': '2026-06-16T14:30:00.000Z',
    'category': 'Ajuste de produto',
    'priority': 'Alta',
    'ownerName': 'Gustavo Santana',
    'deliveryNote':
        'Painel agora abre o consumo por usina, com filtro por período. Já disponível na sua home.',
    'timeline': [
      {
        'status': 'received',
        'at': '2026-06-10T09:12:00.000Z',
        'note': 'Recebemos seu feedback.'
      },
      {
        'status': 'inAnalysis',
        'at': '2026-06-11T10:00:00.000Z',
        'note': 'Triado pela IA: ajuste de produto, prioridade alta.'
      },
      {
        'status': 'approved',
        'at': '2026-06-12T16:20:00.000Z',
        'note': 'Aprovado e encaminhado para o time de produto.'
      },
      {
        'status': 'resolved',
        'at': '2026-06-16T14:30:00.000Z',
        'note': 'Entregue.'
      },
    ],
  },
  {
    'id': 'req-002',
    'title': 'Relatório mensal de eficiência energética',
    'summary': 'Seria útil um resumo mensal de eficiência para a diretoria.',
    'status': 'inAnalysis',
    'createdAt': '2026-06-14T11:45:00.000Z',
    'updatedAt': '2026-06-15T09:05:00.000Z',
    'category': 'Nova feature',
    'priority': 'Média',
    'ownerName': 'Igor Moura',
    'deliveryNote': null,
    'timeline': [
      {
        'status': 'received',
        'at': '2026-06-14T11:45:00.000Z',
        'note': 'Recebemos seu feedback.'
      },
      {
        'status': 'inAnalysis',
        'at': '2026-06-15T09:05:00.000Z',
        'note': 'Em análise com o PO para virar uma feature.'
      },
    ],
  },
  {
    'id': 'req-003',
    'title': 'Alerta de pico de demanda',
    'summary': 'Quero ser avisado quando a demanda passar do limite contratado.',
    'status': 'approved',
    'createdAt': '2026-06-13T08:30:00.000Z',
    'updatedAt': '2026-06-17T13:10:00.000Z',
    'category': 'Nova feature',
    'priority': 'Alta',
    'ownerName': 'Lucas Messias',
    'deliveryNote': null,
    'timeline': [
      {
        'status': 'received',
        'at': '2026-06-13T08:30:00.000Z',
        'note': 'Recebemos seu feedback.'
      },
      {
        'status': 'inAnalysis',
        'at': '2026-06-14T10:00:00.000Z',
        'note': 'Triado: urgência alta, match com a task de monitoramento.'
      },
      {
        'status': 'approved',
        'at': '2026-06-17T13:10:00.000Z',
        'note': 'Aprovado — entra no próximo ciclo.'
      },
    ],
  },
  {
    'id': 'req-004',
    'title': 'Trocar a paleta de cores do portal',
    'summary': 'Gostaria de mudar as cores do portal para a marca da empresa.',
    'status': 'rejected',
    'createdAt': '2026-06-12T15:00:00.000Z',
    'updatedAt': '2026-06-13T17:40:00.000Z',
    'category': 'Personalização',
    'priority': 'Baixa',
    'ownerName': 'Carol Costa',
    'deliveryNote': null,
    'timeline': [
      {
        'status': 'received',
        'at': '2026-06-12T15:00:00.000Z',
        'note': 'Recebemos seu feedback.'
      },
      {
        'status': 'inAnalysis',
        'at': '2026-06-13T09:30:00.000Z',
        'note': 'Avaliado pelo time de design.'
      },
      {
        'status': 'rejected',
        'at': '2026-06-13T17:40:00.000Z',
        'note':
            'Não entra agora: o tema de marca está no roadmap do próximo trimestre. Seguimos com o tema padrão por ora.'
      },
    ],
  },
  {
    'id': 'req-005',
    'title': 'Exportar dados de consumo em CSV',
    'summary': 'Preciso baixar os dados em CSV para cruzar com a planilha interna.',
    'status': 'received',
    'createdAt': '2026-06-18T16:20:00.000Z',
    'updatedAt': '2026-06-18T16:20:00.000Z',
    'category': null,
    'priority': null,
    'ownerName': null,
    'deliveryNote': null,
    'timeline': [
      {
        'status': 'received',
        'at': '2026-06-18T16:20:00.000Z',
        'note': 'Recebemos seu feedback. Em breve passa pela triagem.'
      },
    ],
  },
];
