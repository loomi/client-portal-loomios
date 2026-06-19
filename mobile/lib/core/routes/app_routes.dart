import 'package:go_router/go_router.dart';
import 'package:flutter_mvvm_leap/features/example/presentation/views/example_page.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/views/request_detail_page.dart';
import 'package:flutter_mvvm_leap/features/requests/presentation/views/requests_page.dart';
import 'package:flutter_mvvm_leap/features/splash/presentation/views/splash_page.dart';

class AppRouter {
  final config = GoRouter(
    initialLocation: AppRoutes.splash,
    debugLogDiagnostics: true,
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: AppRoutes.example,
        builder: (context, state) => const ExamplePage(),
      ),
      GoRoute(
        path: AppRoutes.requests,
        builder: (context, state) => const RequestsPage(),
      ),
      GoRoute(
        path: AppRoutes.requestDetail,
        builder: (context, state) => RequestDetailPage(
          id: state.pathParameters['id']!,
        ),
      ),
    ],
  );
}

class AppRoutes {
  static const String splash = '/splash';
  static const String example = '/example';
  static const String requests = '/requests';
  static const String requestDetail = '/requests/:id';

  static String requestDetailPath(String id) => '/requests/$id';
}

class AppRoute {
  const AppRoute({required this.path, required this.fullPath});

  final String path;
  final String fullPath;
}

class AppRouteWithId {
  const AppRouteWithId({
    required this.path,
    required Function(String? id) buildFullPath,
  }) : _buildFullPath = buildFullPath;

  final String path;
  final Function(String? id) _buildFullPath;

  String fullPath({required String? id}) => _buildFullPath(id);
}
