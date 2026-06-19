import 'package:equatable/equatable.dart';

class ExampleApiModel extends Equatable {
  const ExampleApiModel({
    required this.id,
    required this.name,
  });

  final String id;
  final String name;

  factory ExampleApiModel.fromJson(Map<String, dynamic> json) {
    return ExampleApiModel(
      id: json['id'] as String,
      name: json['name'] as String,
    );
  }
  
  @override
  List<Object?> get props => [id, name];
}
