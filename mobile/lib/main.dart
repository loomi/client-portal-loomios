import 'package:flutter_mvvm_leap/bootstrap.dart';
import 'package:flutter_mvvm_leap/core/flavor/flavor_config.dart';

void main() async {
  await bootstrap(
    FlavorConfig(
      flavor: AppFlavor.prod,
      baseUrl: 'https://base.com.br',
    ),
  );
}
