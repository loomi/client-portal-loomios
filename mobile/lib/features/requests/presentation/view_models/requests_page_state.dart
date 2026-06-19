part of 'requests_page_cubit.dart';

class RequestsPageCubitState extends Equatable {
  const RequestsPageCubitState({
    this.requests = const [],
    this.isLoading = false,
    this.hasError = false,
  });

  final List<ClientRequest> requests;
  final bool isLoading;
  final bool hasError;

  RequestsPageCubitState copyWith({
    List<ClientRequest>? requests,
    bool? isLoading,
    bool? hasError,
  }) {
    return RequestsPageCubitState(
      requests: requests ?? this.requests,
      isLoading: isLoading ?? this.isLoading,
      hasError: hasError ?? this.hasError,
    );
  }

  @override
  List<Object?> get props => [requests, isLoading, hasError];
}
