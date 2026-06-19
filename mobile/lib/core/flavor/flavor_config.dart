enum AppFlavor { dev, hml, prod }

class FlavorConfig {
  final String baseUrl;
  final AppFlavor flavor;

  FlavorConfig({
    required this.baseUrl,
    required this.flavor,
  });
}
