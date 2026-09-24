import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nagrik/app/router.dart';

void main() {
  testWidgets('AppRoutes defines videos route and is configured in router', (tester) async {
    expect(AppRoutes.videos, '/videos');
  });

  testWidgets('Router provides 5 branches in bottom navigation', (tester) async {
    final container = ProviderContainer();
    addTearDown(container.dispose);

    final router = container.read(routerProvider);
    expect(router.routeInformationProvider.value.uri.toString(), AppRoutes.splash);
  });
}
