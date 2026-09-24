import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nagrik/features/feed/data/datasources/content_remote_data_source.dart';
import 'package:nagrik/features/feed/data/models/api_models.dart';
import 'package:nagrik/features/feed/data/repositories/content_repository.dart';
import 'package:nagrik/features/feed/domain/models/feed_item.dart';
import 'package:nagrik/features/feed/presentation/providers/feed_providers.dart';
import 'package:nagrik/features/onboarding/data/languages_data.dart';
import 'package:nagrik/features/onboarding/domain/models/location_item.dart';
import 'package:nagrik/features/onboarding/presentation/providers/onboarding_providers.dart';

class _FakeRemoteDataSource implements ContentRemoteDataSource {
  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

class _FakeContentRepository extends ContentRepository {
  _FakeContentRepository() : super(remoteDataSource: _FakeRemoteDataSource());

  final List<Map<String, dynamic>> recordedCalls = [];

  @override
  Future<({List<FeedItem> items, FeedPagination pagination})> getFeedWithItems({
    String? city,
    String? area,
    String? district,
    String? subdistrict,
    String? village,
    String? pincode,
    double? lat,
    double? lng,
    int? stateCode,
    int? districtCode,
    int? subdistrictCode,
    int? localBodyCode,
    String? state,
    String? country,
    String? contentType,
    String? categoryId,
    String? categorySlug,
    int page = 1,
    int limit = 20,
    String? cursor,
  }) async {
    recordedCalls.add({
      'city': city,
      'area': area,
      'district': district,
      'pincode': pincode,
      'lat': lat,
      'lng': lng,
      'state': state,
      'contentType': contentType,
      'page': page,
      'limit': limit,
    });

    return (
      items: <FeedItem>[],
      pagination: FeedPagination(
        page: page,
        limit: limit,
        totalItems: 40,
        totalPages: 2,
      ),
    );
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Location-Priority FeedStateNotifier Tests', () {
    late _FakeContentRepository fakeRepo;
    late ProviderContainer container;

    const initialLocation = LocationItem(
      id: 'loc_kalyani',
      locality: 'Block B',
      city: 'Kalyani',
      district: 'Nadia',
      state: 'West Bengal',
      pincode: '741235',
      latitude: 22.9751,
      longitude: 88.4345,
    );

    setUp(() {
      fakeRepo = _FakeContentRepository();
      container = ProviderContainer(
        overrides: [
          contentRepositoryProvider.overrideWithValue(fakeRepo),
          onboardingStateProvider.overrideWith(
            () => _TestOnboardingNotifier(initialLocation),
          ),
        ],
      );
    });

    tearDown(() {
      container.dispose();
    });

    test('initial feed fetch supplies full spatial & LGD location hierarchy', () async {
      container.read(feedStateProvider);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(fakeRepo.recordedCalls.length, 1);
      final call = fakeRepo.recordedCalls.first;
      expect(call['city'], 'Kalyani');
      expect(call['area'], 'Block B');
      expect(call['district'], 'Nadia');
      expect(call['pincode'], '741235');
      expect(call['lat'], 22.9751);
      expect(call['lng'], 88.4345);
      expect(call['state'], 'West Bengal');
      expect(call['page'], 1);
    });

    test('updating selectedLocation triggers refresh with new coordinates and district', () async {
      container.read(feedStateProvider);
      await Future<void>.delayed(const Duration(milliseconds: 50));
      fakeRepo.recordedCalls.clear();

      const newLocation = LocationItem(
        id: 'loc_saltlake',
        locality: 'Sector V',
        city: 'Kolkata',
        district: 'North 24 Parganas',
        state: 'West Bengal',
        pincode: '700091',
        latitude: 22.5800,
        longitude: 88.4370,
      );

      // Mutate selected location via onboardingStateProvider
      container.read(onboardingStateProvider.notifier).selectLocation(newLocation);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(fakeRepo.recordedCalls.isNotEmpty, isTrue);
      final lastCall = fakeRepo.recordedCalls.last;
      expect(lastCall['city'], 'Kolkata');
      expect(lastCall['area'], 'Sector V');
      expect(lastCall['district'], 'North 24 Parganas');
      expect(lastCall['pincode'], '700091');
      expect(lastCall['lat'], 22.5800);
      expect(lastCall['lng'], 88.4370);
      expect(lastCall['page'], 1);
    });

    test('loadNextPage preserves user spatial coordinates and increments page', () async {
      container.read(feedStateProvider);
      await Future<void>.delayed(const Duration(milliseconds: 50));
      fakeRepo.recordedCalls.clear();

      await container.read(feedStateProvider.notifier).loadNextPage();

      expect(fakeRepo.recordedCalls.length, 1);
      final page2Call = fakeRepo.recordedCalls.first;
      expect(page2Call['page'], 2);
      expect(page2Call['lat'], 22.9751);
      expect(page2Call['lng'], 88.4345);
      expect(page2Call['district'], 'Nadia');
      expect(page2Call['pincode'], '741235');
    });
  });
}

class _TestOnboardingNotifier extends OnboardingStateNotifier {
  _TestOnboardingNotifier(this._initialLocation);

  final LocationItem _initialLocation;

  @override
  OnboardingState build() {
    return OnboardingState(
      selectedLanguage: kSupportedLanguages.first,
      selectedLocation: _initialLocation,
      isCompleted: true,
    );
  }
}
