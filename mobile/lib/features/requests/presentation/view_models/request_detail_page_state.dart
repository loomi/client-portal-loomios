part of 'request_detail_page_cubit.dart';

class RequestDetailPageCubitState extends Equatable {
  const RequestDetailPageCubitState({
    this.request,
    this.isLoading = false,
    this.hasError = false,
  });

  final ClientRequest? request;
  final bool isLoading;
  final bool hasError;

  RequestDetailPageCubitState copyWith({
    ClientRequest? request,
    bool? isLoading,
    bool? hasError,
  }) {
    return RequestDetailPageCubitState(
      request: request ?? this.request,
      isLoading: isLoading ?? this.isLoading,
      hasError: hasError ?? this.hasError,
    );
  }

  @override
  List<Object?> get props => [request, isLoading, hasError];
}
