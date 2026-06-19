import 'package:flutter_mvvm_leap/features/example/data/models/example_api_model.dart';
import 'package:flutter_mvvm_leap/features/example/domain/entities/example.dart';

class ExampleMapper {
  static Example toEntity(ExampleApiModel model) {
    return Example(
      id: model.id,
      name: model.name,
    );
  }
}