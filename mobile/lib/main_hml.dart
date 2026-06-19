import 'package:flutter_mvvm_leap/bootstrap.dart';
import 'package:flutter_mvvm_leap/core/flavor/flavor_config.dart';

void main() async {
  await bootstrap(
    FlavorConfig(
      flavor: AppFlavor.hml,
      baseUrl: 'https://base.homolog.com.br',
    ),
  );
}
