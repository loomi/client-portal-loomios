import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_mvvm_leap/core/components/widgets/flushbar/flushbar_area_cubit.dart';
import 'package:flutter_mvvm_leap/core/components/widgets/flushbar/flushbar_widget.dart';
import 'package:flutter_mvvm_leap/core/di/app_dependencies.dart';

class FlushbarArea extends StatefulWidget {
  const FlushbarArea({super.key});

  @override
  State<FlushbarArea> createState() => _FlushbarAreaState();
}

class _FlushbarAreaState extends State<FlushbarArea> {
  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: injector.get<FlushbarAreaCubit>(),
      child: SafeArea(
        child: Material(
          type: MaterialType.transparency,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 24),
            child: BlocBuilder<FlushbarAreaCubit, FlushbarAreaState>(
              builder: (context, state) {
                return Column(
                  children: [
                    for (final f in state.flushbars) ...[
                      FlushbarWidget(
                        flushbar: f,
                        key: ObjectKey(f),
                      ),
                      if (state.flushbars.indexOf(f) < state.flushbars.length - 1) const SizedBox(height: 8),
                    ]
                  ],
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
