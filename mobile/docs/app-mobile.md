# App Mobile — Client Portal (visão geral técnica)

> **Repo:** `client-portal-loomios/mobile` · **Template:** Loomi Flutter MVVM Leap (`flutter_mvvm_leap`)
> **Owner:** Ítalo — Grupo 3 (Confiança & Adaptação) · *o loop e a linguagem*
> **Stack:** Flutter 3.35.7 / Dart 3.9 (pinado via FVM) · Bloc/Cubit · GetIt · go_router · Dio

Este documento descreve **o que o app mobile faz e como está montado**. Para as
regras de _como construir aqui_, ver [CLAUDE.md](../CLAUDE.md); para o brief do
hackathon, [docs/doc.md](doc.md).

---

## 1. O produto e o escopo do mobile

O portal torna a Loomi transparente para o cliente. O mobile é a **segunda tela do
loop de feedback**:

> cliente dá feedback → triagem por IA (Grupo 2) vira ticket interno → **o status
> volta pro cliente no mobile** → push: *"seu feedback virou entrega"*.

**Golden path:** cliente abre o portal → vê jornada/saúde na linguagem do seu cargo →
deixa feedback → IA triaga (categoria, urgência, prioridade, responsável) → um humano
decide se vira ticket → **cliente vê a mudança de status** (recebido → em análise →
aprovado/recusado → resolvido) → **recebe um push**.

**Entregas do mobile** (prioridade decrescente — §6 do CLAUDE.md):
1. **`requests`** — acompanhamento de pedidos (status + timeline). *Must-ship.*
2. **Push** *"seu feedback virou entrega"* (o "wow" mais barato).
3. Jornada do cliente — pode ficar nível protótipo.

Demo roda em **um setor só (energia)**.

---

## 2. Stack, flavors e comandos

Flutter pinado via FVM (`.fvmrc`). Prefixar comandos com `fvm`.

```bash
fvm flutter pub get
fvm flutter run -t lib/main_dev.dart   # flavor dev (também main_hml / main.dart = prod)
fvm flutter analyze
fvm flutter test
```

**Flavors** (`lib/core/flavor/flavor_config.dart`): `dev | hml | prod`, cada um com
entrypoint próprio (`lib/main_dev.dart`, `lib/main_hml.dart`, `lib/main.dart`) e
`baseUrl` injetada no `FlavorConfig`. `device_preview` está habilitado para
screenshots multi-device no pitch.

Boot: `main_*.dart` → `bootstrap(flavorConfig)` → `configureAppDependencies` → `runApp`.

**Dependências relevantes:** `bloc`/`flutter_bloc` (estado), `get_it` (DI),
`go_router` (rotas), `dio` (HTTP), `provider` (injeta `AppTheme` na árvore),
`firebase_core`/`firebase_messaging` (push), `equatable`, `flutter_svg`.

---

## 3. Arquitetura — MVVM + Clean

Cada feature vive em `lib/features/<feature>/` e espelha `lib/features/example/`
(referência canônica). Três camadas:

```
lib/features/<feature>/
├── data/          datasources (abstract + impl = seam de integração)
│                  models (fromJson, Equatable) · mappers (Model→Entity)
│                  repositories (Result + mapper) · failures (enum) · di
├── domain/        entities (Equatable, sem JSON) · repositories (abstract, Result)
└── presentation/  view_models (Cubit + state) · views (page + actions) · widgets
```

**Regra de dependência:** `presentation → domain ← data`. O domínio não conhece data
nem presentation. Views nunca tocam datasource/model — só o Cubit, que fala com a
**interface de repositório do domínio**.

`lib/core/` guarda a máquina compartilhada (não reimplementar por feature):

| Módulo | Papel |
|--------|-------|
| `core/di` | GetIt (`injector`), `configureAppDependencies` |
| `core/network` | abstração `HttpClient` sobre Dio (base URL + bearer por flavor) |
| `core/routes` | `AppRouter` (go_router) + `AppRoutes` |
| `core/theme` | `AppTheme` (cores/textos semânticos) + provider |
| `core/utils/helpers/result` | `Result<FailureType, Success>` (`Success`/`Failure`) |
| `core/components/base` | `AppStatelessWidget` / `AppStatefulWidget` / `AppStatefulPage` |
| `core/components/widgets/flushbar` | toasts (usado pelo push simulado) |
| `core/services/device` | info, local_preferences, secure_storage, share, settings |
| `core/services/event_bus` | `AppEventBus` |
| `core/logs` | `AppLogger` |

**Base widgets:** páginas estendem `AppStatefulPage` e implementam `<Page>Actions`;
widgets estendem `AppStatelessWidget`. Ambos expõem `buildWidget(context, theme)` — o
`AppTheme` é resolvido via `context.watch` no `build` da base. Cubits são providos
pelo getter `providers` (`BlocProvider`).

**Padrão Result/erros:** toda op de data/domain retorna `Result<FailureType, …>`. O
datasource captura, loga via `AppLogger` e retorna `Failure(FailureInfo(type: …))`. O
repository faz `.fold` e mapeia Model→Entity no sucesso. Nunca lança exceção entre
camadas; nunca vaza model acima de data.

**Cubit (ViewModel):** um por página. Construtor recebe a interface `Actions` e o
repositório (default `injector.get()`, para testes injetarem mock). Estado é
`Equatable` com `copyWith` e flags (`isLoading`, `hasError`). Sempre `safeEmit`. O
`_actions` é anulado no `close()`. Efeitos de UI (navegação, dialogs, push) passam pela
interface `Actions`, que a `*Page` implementa.

---

## 4. Feature `requests` (o coração da demo)

`lib/features/requests/`.

### 4.1 Domínio

`RequestStatus` é a espinha da demo:

```dart
enum RequestStatus { received, inAnalysis, approved, rejected, resolved }
//                   recebido   emAnálise    aprovado  recusado   resolvido
```

- **`ClientRequest`** — `id`, `title`, `summary`, `status`, `createdAt`, `updatedAt`,
  `timeline`, e os campos opcionais de triagem (`category`, `priority`, `ownerName`)
  + `deliveryNote` (preenchido quando `resolved` → alimenta o push). `Equatable`, sem
  JSON. Tem o getter `isResolved`.
- **`RequestStatusEvent`** — `status`, `at` (DateTime), `note?`. Um passo do histórico;
  alimenta a timeline do detalhe.
- **`RequestsRepository`** (abstract): `clientRequests()` → lista, `requestById(id)` →
  detalhe. Ambos retornam `Result<RequestsFailure, …>`.

### 4.2 Data — mock-first, integração a um arquivo de distância

O **datasource impl é o único lugar que fake-a dados.** Tudo acima
(mapper, repository, domínio, cubit, UI) já é escrito como se a API fosse real.

- **`ClientRequestApiModel`** — shape de wire (datas como String ISO-8601, `status`
  como String). `fromJson` com chaves que **devem casar** com o payload do endpoint de
  tickets/status do Lucas (contrato de integração). `RequestStatusEventApiModel` para
  os eventos.
- **`ClientRequestMapper.toEntity`** — Model → Entity. Faz `DateTime.parse` e
  String → `RequestStatus` (`firstWhere` por `name`, fallback `received`).
- **`RequestsRepositoryImpl`** — `.fold` do Result do datasource, mapeando no sucesso.
- **`RequestsDatasourceImpl`** — retorna mocks construídos via
  `ClientRequestApiModel.fromJson` (exercita o parse agora), com latência fake
  (400ms/250ms) e caminho de falha (`RequestsFailure.notFound` / `.unknown`). O
  `HttpClient` continua injetado. Blocos marcados com `// MOCK` e o call-site real em
  `// INTEGRATION` logo abaixo.
- **`RequestsFailure`** — enum `implements FailureType`: `unknown`, `notFound`,
  `network`.
- **DI** (`configureRequestsDependencies`) — `registerFactory` para datasource e
  repository; chamada dentro de `configureAppDependencies`.

### 4.3 Presentation

- **`RequestsPage`** (lista) — título/subtítulo, botão "Simular push de entrega", e a
  lista de `RequestCard` (cada um com `RequestStatusChip`). Estados loading / erro
  (`_ErrorView` com retry) / lista. Cubit: `RequestsPageCubit` (`load`,
  `onRequestTap`, `onSimulateDeliveryPush`). Actions: `navToDetail`,
  `showDeliveryPush`.
- **`RequestDetailPage`** (detalhe) — título, chip de status, summary, `_MetaCard`
  (triagem: categoria/prioridade/responsável, ou "Aguardando triagem"),
  `_DeliveryCard` (só quando `resolved` + `deliveryNote`), e a **`RequestTimeline`**
  vertical (recebido → … → resolvido, último evento destacado). Cubit:
  `RequestDetailPageCubit` (`load(id)`, `onBackPressed`). Actions: `goBack`.
- **Widgets:** `RequestCard`, `RequestStatusChip`, `RequestTimeline`,
  `RequestStatusVisuals` (extension em `RequestStatus` → `label` pt-BR + `color`).

### 4.4 Push *"seu feedback virou entrega"*

Hoje **simulado sem Firebase**: `onSimulateDeliveryPush` pega o primeiro pedido
`resolved`, dispara um flushbar ("Seu feedback virou entrega: …") via
`FlushbarAreaCubit` e faz deep-link pro detalhe.

**Integração FCM:** `firebase_messaging` já é dependência. Ligar
`FirebaseMessaging.onMessage` / `onMessageOpenedApp` para chamar o mesmo fluxo com o
`requestId` carregado no payload — a UI não muda.

---

## 5. Mapa de status (label pt-BR + cor)

`RequestStatusVisuals` (`request_status_visuals.dart`) + getters em `AppTheme`:

| `RequestStatus` | Label (pt-BR) | Cor (light) |
|-----------------|---------------|-------------|
| `received` | Recebido | `#6B7280` (cinza) |
| `inAnalysis` | Em análise | `#F59E0B` (âmbar) |
| `approved` | Aprovado | `#3B82F6` (azul) |
| `rejected` | Recusado | `#EF4444` (vermelho) |
| `resolved` | Resolvido | `#22C55E` (verde) |

> Cores são getters semânticos no `AppTheme` (`statusReceivedColor`, …) — não
> hardcodar `Color(0x…)` em widget.

---

## 6. Rotas e navegação

`AppRouter` (go_router), `initialLocation: /splash`:

| Path | Página |
|------|--------|
| `/splash` | `SplashPage` — espera 2s e navega para `/requests` |
| `/example` | `ExamplePage` (referência do template) |
| `/requests` | `RequestsPage` (lista) |
| `/requests/:id` | `RequestDetailPage` (detalhe) — `AppRoutes.requestDetailPath(id)` |

---

## 7. Dados mock (cenário de energia)

`RequestsDatasourceImpl` traz 5 pedidos do projeto-demo de energia, um por estado, para
exercitar toda a UI:

| id | título | status |
|----|--------|--------|
| `req-001` | Ajustar painel de consumo por unidade | resolved (com `deliveryNote`) |
| `req-002` | Relatório mensal de eficiência energética | inAnalysis |
| `req-003` | Alerta de pico de demanda | approved |
| `req-004` | Trocar a paleta de cores do portal | rejected |
| `req-005` | Exportar dados de consumo em CSV | received (sem triagem) |

Para integrar: trocar os blocos `// MOCK` pelas chamadas `// INTEGRATION`
(`_httpClient.get('/requests')` e `/requests/:id`) e apagar a lista `_mockRequests`.
`grep "// MOCK"` acha tudo que sai na integração.

---

## 8. Internacionalização (i18n) — REMOVIDA

O template ship com i18n próprio (`AppI18n` + JSONs `pt_BR`/`en_US`/`es_ES`). Para a
demo, a internacionalização foi **removida por completo** e todos os textos viraram
literais pt-BR no código.

> ⚠️ Isto contraria a regra "i18n only, sem strings hardcoded" do
> [CLAUDE.md](../CLAUDE.md) §5/§7. Decisão explícita de produto para o hackathon (demo
> só em português).

**O que foi feito:**
- `buildWidget(context, i18n, theme)` → `buildWidget(context, theme)` nos 3 base
  widgets e em todos os overrides.
- ~30 chaves `i18n.get(...)` trocadas por literais pt-BR (ver tabela de status em §5;
  exemplos: "Seus pedidos", "Detalhe do pedido", "Sua entrega", "Tentar de novo",
  push "Seu feedback virou entrega: {título}").
- `RequestStatusVisuals.i18nKey` → getter `label` (switch com os rótulos pt-BR).
- Removido `AppI18n` de `app_dependencies.dart`, `bootstrap.dart` e `app_widget.dart`;
  `locale` fixo em `pt_BR` (delegates do Material mantidos).
- Apagados `lib/core/i18n/` e `assets/i18n/*.json`; limpos `- assets/i18n/` do
  `pubspec.yaml` e o valor `appLanguage` do enum de preferências.

**Pendências (não tocadas):** `DeviceInfo.checkLocaleSupport()` virou código morto;
`tools/i18n_validator/` e [I18N.md](../I18N.md) ainda descrevem o fluxo antigo.

**Reverter i18n:** restaurar `lib/core/i18n/` e os JSONs (via git), reverter as
assinaturas de `buildWidget`, re-registrar `AppI18n` (DI + `.init()` no bootstrap +
provider no `app_widget`), e trocar os literais de volta por `i18n.get('...')`.

---

## 9. Verificação

```bash
fvm flutter analyze   # No issues found!
fvm flutter test      # All tests passed!
```

Testes vivem em `test/features/<feature>/...` (espelham `lib/`), com `mocktail` +
`bloc_test`: mockam o repositório e as actions e injetam no cubit. Cobertura mínima:
status mapeia pro estado de UI certo, e um `Failure` vira estado de erro.
