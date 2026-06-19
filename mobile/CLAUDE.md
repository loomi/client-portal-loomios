# Claude Code — Mobile (Client Portal)

Flutter client app for the **Client Portal** hackathon (Loomi internal). This
folder is the mobile leg of the `client-portal-loomios` monorepo and is built
on the **Loomi Flutter MVVM Leap** template (`flutter_mvvm_leap`). Read this
file before any non-trivial change — it is the source of truth for *how* we
build here. For deeper template docs see [README.md](README.md) and
[I18N.md](I18N.md). The hackathon brief lives in [docs/doc.md](docs/doc.md).

> Mobile owner: **Ítalo** — Grupo 3 (Confiança & Adaptação), *the loop and the
> language*. The mobile app is the **second screen of the feedback loop**: the
> client gives feedback → Lucas's AI triage turns it into an internal ticket →
> the **status comes back to the client on mobile** → push: *"seu feedback
> virou entrega"*.

---

## 1. The product & my scope

The portal makes Loomi transparent to the client: executive journey, health,
materials, metrics, and — the star of the demo — **feedback → AI triage →
ticket → status loop**. Three cross-functional groups build it. The pitch runs
on **one shared example project in the energy sector** so it reads as one
product.

**Golden path (where mobile fits):** client opens the portal → sees journey +
health in their role's language → leaves conversational feedback → AI triages
(category, urgency, priority, owner, match to an in-flight task) → a human
decides if it becomes a ticket → **client sees the status change** (recebido →
em análise → aprovado/recusado → resolvido) → **gets a push in their language**.

**My deliverables** ([docs/doc.md](docs/doc.md) §5, Ítalo):
1. Client app: mobile journey.
2. **Request-status screens** — recebido → em análise → aprovado/recusado →
   resolvido — consuming the status Lucas produces.
3. **Push**: *"seu feedback virou entrega"*.

**Scope priority** (§6 — if time runs short): mobile is the *second screen of
the loop*, **not a full app**. The cheapest "wow" is the **status push**, so
that is the must-ship. The journey screen can stay prototype-level. **One
sector only (energy)** in the demo.

This drives the build: ship the `requests` feature (status tracking + push)
fully; keep journey light.

---

## 2. Architecture — MVVM + Clean (mirror `example`)

The template uses MVVM with a Clean-Architecture three-layer split. Package
import prefix is `package:flutter_mvvm_leap/...`. Every feature lives under
`lib/features/<feature>/` and **copies the structure of
[`lib/features/example/`](lib/features/example/)** — that feature is the
canonical reference. When in doubt, open `example` and follow it exactly.

```
lib/features/<feature>/
├── data/
│   ├── datasources/   <feature>_datasource.dart        (abstract)
│   │                  <feature>_datasource_impl.dart   (← THE INTEGRATION SEAM)
│   ├── models/        <feature>_api_model.dart         (fromJson, Equatable)
│   ├── mappers/       <feature>_mapper.dart            (Model → Entity, static)
│   ├── repositories/  <feature>_repository_impl.dart   (Result + mapper)
│   ├── failures/      <feature>_failures.dart          (enum implements FailureType)
│   └── di/            <feature>_dependencies.dart      (register datasource+repo)
├── domain/
│   ├── entities/      <name>.dart                      (Equatable, no fromJson)
│   └── repositories/  <feature>_repository.dart        (abstract, returns Result)
└── presentation/
    ├── view_models/   <feature>_page_cubit.dart        (Cubit; `part` of state)
    │                  <feature>_page_state.dart        (Equatable + copyWith)
    ├── views/         <feature>_page.dart              (AppStatefulPage + Actions)
    │                  <feature>_page_actions.dart      (abstract: nav/dialogs)
    └── widgets/       <feature>_*.dart                 (AppStatelessWidget)
```

**Dependency rule:** presentation → domain ← data. Domain knows nothing about
data/presentation. Views never touch a datasource or model — only the Cubit,
which talks to the **domain repository interface**.

`lib/core/` holds the shared machinery: DI, network, routes, theme, i18n,
logger, base widgets, device services, flushbar, result helper. Don't
reimplement any of it per-feature.

---

## 3. Mock-first, integration-ready (NON-NEGOTIABLE for this hackathon)

All data starts **mocked**, but the seam must be clean so swapping to the real
back-end is a **one-file change**. The rule:

> **The datasource impl is the only place that fakes data.** Everything above
> it (mapper, repository, domain, cubit, UI) is written as if the API were
> real — and never changes when we integrate.

In `<feature>_datasource_impl.dart`, return mock `*ApiModel`s instead of
calling `_httpClient`:

```dart
@override
Future<Result<RequestFailure, List<RequestApiModel>>> clientRequests() async {
  // MOCK: remove when Lucas's endpoint is live. Shape matches GET /requests.
  await Future<void>.delayed(const Duration(milliseconds: 400)); // fake latency
  return const Success(_mockRequests);
  // INTEGRATION: replace the two lines above with:
  // final result = await _httpClient.get('/requests');
  // return Success(result.data.map(RequestApiModel.fromJson).toList());
}
```

Hard rules so integration is trivial:
- **Model shape = the agreed API contract.** `fromJson` keys must match the
  payload Lucas's tickets/status endpoint emits (coordinate the JSON shape
  early). Mock data is built through `*ApiModel.fromJson({...})` or the const
  constructor so the parse path is exercised now, not at integration time.
- Keep `_httpClient` injected even while mocking — the call site is ready.
- Simulate latency and at least one **failure path** (return a `Failure`) so
  loading/error UI is real, not an afterthought.
- Put every mock behind a clearly marked `// MOCK` / `// INTEGRATION` comment
  pair. Grep `// MOCK` to find everything to delete on integration day.

---

## 4. The feature to build: `requests`

`lib/features/requests/` — **Acompanhamento de pedidos** (the client-facing
view of their feedback as it moves through the loop). This is the concrete
application of §2/§3.

**Domain** — `RequestStatus` is the spine of the demo:

```dart
enum RequestStatus { received, inAnalysis, approved, rejected, resolved }
//                   recebido   emAnálise    aprovado  recusado   resolvido
```

- `ClientRequest` entity: `id`, `title`, `summary`, `status`, `createdAt`,
  `updatedAt`, optional `category` / `priority` / `ownerName` (the triage
  output from Lucas), and `deliveryNote` (filled when `resolved` → powers the
  "virou entrega" push). `Equatable`, no JSON.
- Repository interface: `clientRequests()` → list, `requestById(id)` → detail.
  Both return `Result<RequestFailure, …>`.

**Presentation:**
- **List/journey page** — the client's requests with current status (a status
  chip with the 5-state colour mapping). Light is fine per §6.
- **Detail page** — status **timeline** (recebido → em análise →
  aprovado/recusado → resolvido) so the client sees the loop close. This is the
  payoff screen.
- **Push** — `firebase_messaging` (already a dep). On a status→`resolved`
  notification, route to the request detail. Keep handling in a small core
  service or the feature's cubit; copy comes from i18n
  (`app.features.requests.push.*`) so it stays in the client's language.

Register the route in [lib/core/routes/app_routes.dart](lib/core/routes/app_routes.dart)
(add `requests` + a detail path) and wire DI (§5).

---

## 5. Conventions (match the codebase exactly)

**Result / errors.** Every data/domain op returns
`Result<FailureType, Success>` ([result.dart](lib/core/utils/helpers/result/result.dart)).
Datasource catches, logs via `AppLogger`, returns `Failure(FailureInfo(type:
…))`. Repository `.fold`s and maps Model→Entity on success. Failure types are a
per-feature enum `implements FailureType` (see
[example_failures.dart](lib/features/example/data/failures/example_failures.dart)).
Never throw across a layer; never leak a model above data.

**DI (GetIt).** Add `requests/data/di/requests_dependencies.dart` with
`registerFactory` for datasource and repository (copy
[example_dependencies.dart](lib/features/example/data/di/example_dependencies.dart)),
then call `configureRequestsDependencies(injector)` inside
[app_dependencies.dart](lib/core/di/app_dependencies.dart). Resolve with
`injector.get()`. Don't `new` a repository in a widget.

**Cubit (ViewModel).** One Cubit per page. Constructor takes the page's
`Actions` interface and the repository (defaulting to `injector.get()` so tests
inject a mock — see [example_page_cubit.dart](lib/features/example/presentation/view_models/example_page_cubit.dart)).
State is `Equatable` with `copyWith` and an `isLoading` flag. **Always
`safeEmit`** (never raw `emit`) — [cubit_extension.dart](lib/core/utils/extensions/cubit_extension.dart).
Null the `_actions` ref in `close()`. Side effects that touch the UI
(navigation, dialogs, push routing) go through the `Actions` interface, which
the `*Page` implements.

**Views.** Pages extend `AppStatefulPage` and `implement <Page>Actions`;
widgets extend `AppStatelessWidget`. Both give you
`buildWidget(context, i18n, theme)` — use those, don't re-read i18n/theme
manually. Provide cubits via the `providers` getter (`BlocProvider`). Prefer
`BlocSelector` over `BlocBuilder` to scope rebuilds.

**i18n (no hardcoded strings).** All copy via `i18n.get('app.features.requests.…')`
with parallel keys in **all three** files: `assets/i18n/pt_BR.json`,
`en_US.json`, `es_ES.json` ([I18N.md](I18N.md)). pt_BR is primary for the demo.
Plurals via `getPlural`, params via `{}`. Validate with
`fvm dart run tools/i18n_validator/main.dart`.

**Theme.** Colours/text from the injected `AppTheme`
([app_theme.dart](lib/core/theme/app_theme.dart)) — e.g. `theme.titleLargeText`,
`theme.primaryColor`. For the 5 status colours, add semantic getters to
`AppTheme` + both light/dark themes rather than hardcoding `Color(0x…)` in a
widget.

**Network.** Use the injected `HttpClient` abstraction
([http_client.dart](lib/core/network/http_client.dart)), never raw `Dio`.
Base URL + bearer-token interceptor are handled by flavor config — don't put
URLs or tokens in feature code.

**Tests.** `test/features/requests/...` mirrors `lib/`. `mocktail` +
`bloc_test`; mock the repository and the actions, inject into the cubit (see
[example_page_cubit_test.dart](test/features/example/presentation/views_models/example_page_cubit_test.dart)).
At minimum cover: status maps to the right UI state, and a `Failure` surfaces an
error state.

**Style.** `flutter_lints` (see [analysis_options.yaml](analysis_options.yaml)).
`flutter analyze` must be clean. Keep imports as full `package:flutter_mvvm_leap/…`
paths to match the codebase.

---

## 6. Commands (FVM — Flutter 3.35.7, Dart 3.9)

This repo pins Flutter via FVM (`.fvmrc`). Prefix Flutter/Dart commands with
`fvm`.

```bash
fvm flutter pub get
fvm flutter run -t lib/main_dev.dart        # dev flavor (also main_hml / main.dart=prod)
fvm flutter analyze
fvm flutter test
fvm dart run tools/i18n_validator/main.dart # i18n key parity check
```

Flavors are `dev | hml | prod` ([flavor_config.dart](lib/core/flavor/flavor_config.dart)),
each with its own entrypoint and base URL. `device_preview` is enabled for
multi-device screenshots during the pitch.

---

## 7. Don'ts

- Don't bypass the layers: no `Dio`/`http` in a widget, no model above the data
  layer, no business logic in a view.
- Don't hardcode user-facing strings — i18n only, all three locales in sync.
- Don't scatter mock data across layers — **only** the datasource impl fakes
  data, behind `// MOCK` markers, with the real call site one edit away.
- Don't widen scope past §6: ship the status loop + push first; the journey can
  stay prototype-level. One sector (energy).
- Don't reinvent core (DI, result, theme, i18n, network, base widgets) — reuse
  it. When unsure how something is done, copy `lib/features/example/`.
- Don't commit build artifacts, `.env`, keystores, or `*.jks`.
