import { FeedService } from '../services/feed.service';
import {
  UsersDb,
  CreatorsDb,
  CategoriesDb,
  ContentsDb,
  AdvertisementsDb,
  memoryStore
} from '../db/supabaseClient';
import { ContentType, ModerationStatus, UserRole, AdType } from '@naagrik/shared-types';

beforeEach(() => {
  memoryStore.clear();
});

describe('Location-Priority Personalized News Feed Test Suite', () => {
  it('ranks news strictly according to all 8 LGD geographic hierarchy tiers when freshness is equal', async () => {
    const creatorUser = await UsersDb.create({
      name: 'Reporter Raj',
      email: 'raj@news.in',
      passwordHash: 'secret',
      role: UserRole.CREATOR
    });
    const creator = await CreatorsDb.create({ userId: creatorUser.id });
    const category = await CategoriesDb.create({ name: 'Civic', slug: 'civic' });

    const now = new Date().toISOString();

    // 8. Wider / National News (Delhi, State 7, District 701)
    const nationalContent = await ContentsDb.create({
      creatorId: 'cr_national',
      type: ContentType.ARTICLE,
      title: 'National Infrastructure Update',
      description: 'Highway network expansion across India',
      mediaUrl: 'https://cdn.naagrik.news/media/national.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-national.jpg',
      categoryId: 'cat_infra',
      location: { country: 'India', state: 'Delhi', city: 'New Delhi', area: 'Central' },
      stateCode: 7,
      districtCode: 701,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // 7. Same State News (Bihar State Code 10, Statewide news)
    const stateContent = await ContentsDb.create({
      creatorId: 'cr_state',
      type: ContentType.ARTICLE,
      title: 'Bihar State Budget Highlights',
      description: 'State assembly passes annual budget',
      mediaUrl: 'https://cdn.naagrik.news/media/state.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-state.jpg',
      categoryId: 'cat_budget',
      location: { country: 'India', state: 'Bihar', city: 'Statewide', area: 'Statewide' },
      stateCode: 10,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // 6. Nearby District (Muzaffarpur District 1002 in same State 10)
    const nearbyDistrictContent = await ContentsDb.create({
      creatorId: 'cr_muzaffarpur',
      type: ContentType.ARTICLE,
      title: 'Muzaffarpur Litchi Festival Inaugurated',
      description: 'Annual agriculture fair begins',
      mediaUrl: 'https://cdn.naagrik.news/media/muzaffarpur.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-muzaffarpur.jpg',
      categoryId: 'cat_agri',
      location: { country: 'India', state: 'Bihar', city: 'Muzaffarpur', area: 'Club Road' },
      stateCode: 10,
      districtCode: 1002,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // 5. User's District (Patna District 1001, district-wide policy)
    const districtContent = await ContentsDb.create({
      creatorId: 'cr_district',
      type: ContentType.ARTICLE,
      title: 'Patna District Road Repair Drive',
      description: 'Municipal corporation begins major repairs across the district',
      mediaUrl: 'https://cdn.naagrik.news/media/district.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-district.jpg',
      categoryId: 'cat_roads',
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Patna' },
      stateCode: 10,
      districtCode: 1001,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // 4. Nearby Sub-District (Danapur Sub-district 10012 in Patna District 1001)
    const nearbySubdistrictContent = await ContentsDb.create({
      creatorId: 'cr_danapur',
      type: ContentType.ARTICLE,
      title: 'Danapur Cantonment Water Supply Upgrade',
      description: 'Pipe replacement in progress',
      mediaUrl: 'https://cdn.naagrik.news/media/danapur.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-danapur.jpg',
      categoryId: 'cat_water',
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Danapur' },
      stateCode: 10,
      districtCode: 1001,
      subdistrictCode: 10012,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // 3. User's Sub-District (Patna Sadar Sub-district 10011, subdistrict-wide news)
    const subdistrictContent = await ContentsDb.create({
      creatorId: 'cr_sadar',
      type: ContentType.ARTICLE,
      title: 'Patna Sadar Circle Office Service Hours Extended',
      description: 'Public utility counters will remain open on Saturdays',
      mediaUrl: 'https://cdn.naagrik.news/media/sadar.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-sadar.jpg',
      categoryId: 'cat_civic',
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Patna Sadar' },
      stateCode: 10,
      districtCode: 1001,
      subdistrictCode: 10011,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // 2. Nearby Area within same Sub-District (Patna Sadar 10011, Local Body 5002 - Gardanibagh)
    const nearbyAreaContent = await ContentsDb.create({
      creatorId: 'cr_gardanibagh',
      type: ContentType.ARTICLE,
      title: 'Gardanibagh Stadium Renovation Completed',
      description: 'New running track opened for youth',
      mediaUrl: 'https://cdn.naagrik.news/media/gardanibagh.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-gardanibagh.jpg',
      categoryId: 'cat_sports',
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Gardanibagh' },
      stateCode: 10,
      districtCode: 1001,
      subdistrictCode: 10011,
      localBodyCode: 5002,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // 1. Exact Local Area / Village / Ward (Patna Sadar 10011, Local Body 5001 - Kankarbagh)
    const localContent = await ContentsDb.create({
      creatorId: 'cr_kankarbagh',
      type: ContentType.ARTICLE,
      title: 'Kankarbagh Colony Cleanliness Drive',
      description: 'Ward 14 residents participate in sanitation event',
      mediaUrl: 'https://cdn.naagrik.news/media/local.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-local.jpg',
      categoryId: 'cat_sanitation',
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh', pincode: '800020' },
      stateCode: 10,
      districtCode: 1001,
      subdistrictCode: 10011,
      localBodyCode: 5001,
      locationPincode: '800020',
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // User is browsing from Kankarbagh (Local Body 5001, Sub-district 10011, District 1001, State 10)
    const feed = await FeedService.getFeed({
      stateCode: 10,
      districtCode: 1001,
      subdistrictCode: 10011,
      localBodyCode: 5001,
      area: 'Kankarbagh',
      city: 'Patna',
      state: 'Bihar',
      pincode: '800020'
    });

    const contentItems = feed.items.filter(i => i.itemType === 'CONTENT');
    expect(contentItems.length).toBe(8);

    // 1. Exact Local Area / Village
    expect(contentItems[0].data.id).toBe(localContent.id);
    expect(contentItems[0].data.locationTier).toBe('LOCAL_AREA');
    expect(contentItems[0].data.locationScore).toBe(100);

    // 2. Nearby Area within same Sub-District
    expect(contentItems[1].data.id).toBe(nearbyAreaContent.id);
    expect(contentItems[1].data.locationTier).toBe('NEARBY_AREA');
    expect(contentItems[1].data.locationScore).toBe(85);

    // 3. User's Sub-District
    expect(contentItems[2].data.id).toBe(subdistrictContent.id);
    expect(contentItems[2].data.locationTier).toBe('SUB_DISTRICT');
    expect(contentItems[2].data.locationScore).toBe(75);

    // 4. Nearby Sub-District
    expect(contentItems[3].data.id).toBe(nearbySubdistrictContent.id);
    expect(contentItems[3].data.locationTier).toBe('NEARBY_SUB_DISTRICT');
    expect(contentItems[3].data.locationScore).toBe(60);

    // 5. User's District
    expect(contentItems[4].data.id).toBe(districtContent.id);
    expect(contentItems[4].data.locationTier).toBe('DISTRICT');
    expect(contentItems[4].data.locationScore).toBe(50);

    // 6. Nearby District
    expect(contentItems[5].data.id).toBe(nearbyDistrictContent.id);
    expect(contentItems[5].data.locationTier).toBe('NEARBY_DISTRICT');
    expect(contentItems[5].data.locationScore).toBe(40);

    // 7. Same State
    expect(contentItems[6].data.id).toBe(stateContent.id);
    expect(contentItems[6].data.locationTier).toBe('STATE');
    expect(contentItems[6].data.locationScore).toBe(25);

    // 8. Wider / National
    expect(contentItems[7].data.id).toBe(nationalContent.id);
    expect(contentItems[7].data.locationTier).toBe('NATIONAL');
    expect(contentItems[7].data.locationScore).toBe(10);
  });

  it('ranks items based on PostGIS spatial coordinate proximity', async () => {
    const creatorUser = await UsersDb.create({
      name: 'Geo Reporter',
      email: 'geo@news.in',
      passwordHash: 'secret',
      role: UserRole.CREATOR
    });
    const creator = await CreatorsDb.create({ userId: creatorUser.id });
    const category = await CategoriesDb.create({ name: 'Metro', slug: 'metro' });

    const now = new Date().toISOString();
    // User coordinates: Patna Railway Station (25.6022, 85.1376)
    const userLat = 25.6022;
    const userLng = 85.1376;

    // Content 1: 1.5 km away (Dak Bunglow)
    const closeItem = await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.ARTICLE,
      title: 'Dak Bunglow Traffic Advisory',
      description: 'Major junction update',
      mediaUrl: 'https://cdn.naagrik.news/media/traffic.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-traffic.jpg',
      categoryId: category.id,
      location: {
        country: 'India',
        state: 'Bihar',
        city: 'Patna',
        area: 'Dak Bunglow',
        coordinates: { latitude: 25.6080, longitude: 85.1350 }
      },
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // Content 2: 80 km away (Gaya)
    const farItem = await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.ARTICLE,
      title: 'Gaya Heritage Restoration',
      description: 'Monuments preservation',
      mediaUrl: 'https://cdn.naagrik.news/media/gaya.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-gaya.jpg',
      categoryId: category.id,
      location: {
        country: 'India',
        state: 'Bihar',
        city: 'Gaya',
        area: 'Bodh Gaya',
        coordinates: { latitude: 24.7914, longitude: 85.0002 }
      },
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    const feed = await FeedService.getFeed({
      lat: userLat,
      lng: userLng
    });

    const items = feed.items.filter(i => i.itemType === 'CONTENT');
    expect(items.length).toBe(2);
    expect(items[0].data.id).toBe(closeItem.id);
    expect(items[0].data.locationScore).toBe(100); // <= 3km
    expect(items[0].data.distanceKm).toBeLessThan(3);

    expect(items[1].data.id).toBe(farItem.id);
    expect(items[1].data.locationScore).toBe(50); // <= 100km
    expect(items[1].data.distanceKm).toBeGreaterThan(50);
  });

  it('allows fresh breaking news from wider district/state to outrank stale local news', async () => {
    const creatorUser = await UsersDb.create({
      name: 'Reporter News',
      email: 'news@news.in',
      passwordHash: 'secret',
      role: UserRole.CREATOR
    });
    const creator = await CreatorsDb.create({ userId: creatorUser.id });
    const category = await CategoriesDb.create({ name: 'General', slug: 'general' });

    const now = Date.now();
    // 1. Stale Local Area Content: Published 8 days ago (decayed to 0 freshness)
    const eightDaysAgo = new Date(now - 8 * 24 * 3600 * 1000).toISOString();
    const staleLocalContent = await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.ARTICLE,
      title: 'Old Park Bench Repainted',
      description: 'Minor garden work finished last week',
      mediaUrl: 'https://cdn.naagrik.news/media/bench.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-bench.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      localBodyCode: 5001,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: eightDaysAgo
    });

    // 2. Breaking District News: Published 15 minutes ago (< 1 hour, freshness score +50.0, district location: 50 + quality: 10 = 110)
    const verifiedCreatorUser = await UsersDb.create({
      name: 'Senior Bureau Chief',
      email: 'chief@news.in',
      passwordHash: 'secret',
      role: UserRole.CREATOR
    });
    const verifiedCreator = await CreatorsDb.create({ userId: verifiedCreatorUser.id, verificationStatus: 'VERIFIED' });

    const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000).toISOString();
    const freshDistrictContent = await ContentsDb.create({
      creatorId: verifiedCreator.id,
      type: ContentType.ARTICLE,
      title: 'BREAKING: Major Metro Line Approved Across Patna District',
      description: 'Union cabinet clears Phase 2 with 12 new stations',
      mediaUrl: 'https://cdn.naagrik.news/media/metro.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-metro.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Patna' },
      districtCode: 1001,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: fifteenMinutesAgo
    });

    const feed = await FeedService.getFeed({
      localBodyCode: 5001,
      districtCode: 1001,
      area: 'Kankarbagh',
      city: 'Patna'
    });

    const items = feed.items.filter(i => i.itemType === 'CONTENT');
    expect(items.length).toBe(2);
    // Breaking district news (50 location + 50 freshness + 10 verified = 110) outranks stale local news (100 location + 0 freshness = 100)
    expect(items[0].data.id).toBe(freshDistrictContent.id);
    expect(items[0].data.freshnessScore).toBe(50);
    expect(items[1].data.id).toBe(staleLocalContent.id);
    expect(items[1].data.freshnessScore).toBe(0);
  });

  it('proves freshness boost + engagement allows breaking state news to outrank stale local news', async () => {
    const creatorUser = await UsersDb.create({
      name: 'Breaking Desk',
      email: 'breaking@news.in',
      passwordHash: 'secret',
      role: UserRole.CREATOR
    });
    const creator = await CreatorsDb.create({ userId: creatorUser.id, verificationStatus: 'VERIFIED' });
    const category = await CategoriesDb.create({ name: 'Emergency', slug: 'emergency' });

    const now = Date.now();
    // 1. Stale Local Area Content: Published 10 days ago (age 240 hours > 168h, freshness = 0)
    const tenDaysAgo = new Date(now - 10 * 24 * 3600 * 1000).toISOString();
    const staleLocalContent = await ContentsDb.create({
      creatorId: 'unverified-author',
      type: ContentType.ARTICLE,
      title: 'Ward Flower Exhibition Ended',
      description: 'Exhibition held 10 days ago',
      mediaUrl: 'https://cdn.naagrik.news/media/flower.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-flower.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      localBodyCode: 5001,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: tenDaysAgo
    });

    // 2. Breaking State Emergency: Published 20 minutes ago (< 1h, +50 freshness, +10 verified, +15 engagement, location: 40 nearby district)
    const twentyMinsAgo = new Date(now - 20 * 60 * 1000).toISOString();
    const breakingStateContent = await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.ARTICLE,
      title: 'BREAKING EMERGENCY: Red Alert Issued for Bihar Rivers',
      description: 'State disaster response teams deployed',
      mediaUrl: 'https://cdn.naagrik.news/media/flood.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-flood.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Muzaffarpur', area: 'Sadar' },
      stateCode: 10,
      districtCode: 1002, // Nearby District in same state
      likes: 25,
      shares: 15,
      views: 1200,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: twentyMinsAgo
    });

    // User is in Kankarbagh (Local Body 5001, District 1001, State 10)
    const feed = await FeedService.getFeed({
      localBodyCode: 5001,
      districtCode: 1001,
      stateCode: 10,
      area: 'Kankarbagh',
      city: 'Patna',
      state: 'Bihar'
    });

    const items = feed.items.filter(i => i.itemType === 'CONTENT');
    expect(items.length).toBe(2);

    // Breaking state content:
    // Location = 40 (nearby district 1002 in state 10)
    // Freshness = 50 (< 1h)
    // Quality = 10 (VERIFIED creator)
    // Engagement = 15 (max cap)
    // Total = 40 + 50 + 10 + 15 = 115 points
    // Stale local content:
    // Location = 100
    // Freshness = 0 (10 days old, > 7 days linear decay ceiling)
    // Quality = 0
    // Engagement = 0
    // Total = 100 points
    // RESULT: Breaking state story ranks FIRST over stale local story!
    expect(items[0].data.id).toBe(breakingStateContent.id);
    expect(items[0].data.relevanceScore).toBeGreaterThan(items[1].data.relevanceScore);
    expect(items[1].data.id).toBe(staleLocalContent.id);
  });

  it('applies anti-repetition diversity penalty to prevent publisher monopolization', async () => {
    const creatorUser = await UsersDb.create({
      name: 'Super Publisher',
      email: 'super@pub.com',
      passwordHash: 'secret',
      role: UserRole.CREATOR
    });
    const creator1 = await CreatorsDb.create({ userId: creatorUser.id });

    const otherUser = await UsersDb.create({
      name: 'Independent Journalist',
      email: 'indie@press.com',
      passwordHash: 'secret',
      role: UserRole.CREATOR
    });
    const creator2 = await CreatorsDb.create({ userId: otherUser.id });

    const category1 = await CategoriesDb.create({ name: 'Politics', slug: 'politics' });
    const category2 = await CategoriesDb.create({ name: 'Culture', slug: 'culture' });

    const now = new Date().toISOString();

    // Publisher 1 posts 3 items in Kankarbagh
    const p1Item1 = await ContentsDb.create({
      creatorId: creator1.id,
      type: ContentType.ARTICLE,
      title: 'P1 - Kankarbagh Story 1',
      description: 'Story 1 description',
      mediaUrl: 'https://cdn.naagrik.news/media/p1-1.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-p1-1.jpg',
      categoryId: category1.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      localBodyCode: 5001,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    await ContentsDb.create({
      creatorId: creator1.id,
      type: ContentType.ARTICLE,
      title: 'P1 - Kankarbagh Story 2',
      description: 'Story 2 description',
      mediaUrl: 'https://cdn.naagrik.news/media/p1-2.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-p1-2.jpg',
      categoryId: category1.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      localBodyCode: 5001,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // Independent creator posts 1 item with slightly lower initial location score (nearby area, 85)
    await ContentsDb.create({
      creatorId: creator2.id,
      type: ContentType.ARTICLE,
      title: 'P2 - Independent Cultural Festival',
      description: 'Cultural festival in Patna',
      mediaUrl: 'https://cdn.naagrik.news/media/p2.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-p2.jpg',
      categoryId: category2.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Rajendra Nagar' },
      subdistrictCode: 10011, // Nearby area in same sub-district (score 85)
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    const feed = await FeedService.getFeed({
      localBodyCode: 5001,
      subdistrictCode: 10011,
      area: 'Kankarbagh'
    });

    const items = feed.items.filter(i => i.itemType === 'CONTENT');
    expect(items.length).toBe(3);

    // p1Item1 gets full score (~150)
    // p1Item2 is 2nd post from same creator (-8), same category (-3), same area (-4) => -15 penalty!
    // So p1Item2 drops in rank relative to diversified creators
    expect(items[0].data.id).toBe(p1Item1.id);
    expect(items[0].data.relevanceScore).toBeGreaterThan(items[1].data.relevanceScore);
  });

  it('automatically expands geographically when local village news is sparse', async () => {
    const creatorUser = await UsersDb.create({
      name: 'Regional Bureau',
      email: 'regional@news.in',
      passwordHash: 'secret',
      role: UserRole.CREATOR
    });
    const creator = await CreatorsDb.create({ userId: creatorUser.id });
    const category = await CategoriesDb.create({ name: 'Rural', slug: 'rural' });

    const now = new Date().toISOString();

    // Only 1 item in remote village "Bikrampur"
    const villageStory = await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.ARTICLE,
      title: 'Bikrampur Solar Pump Installed',
      description: 'New agricultural solar irrigation pump',
      mediaUrl: 'https://cdn.naagrik.news/media/solar.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-solar.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Bikram', area: 'Bikrampur' },
      localBodyCode: 8881,
      locationVillage: 'Bikrampur',
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // 2 items in Sub-district Bikram
    await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.ARTICLE,
      title: 'Bikram Block Seed Distribution',
      description: 'Kharif season seed subsidy',
      mediaUrl: 'https://cdn.naagrik.news/media/seeds.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-seeds.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Bikram', area: 'Bikram Bazar' },
      subdistrictCode: 10015,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // 2 items in District Patna
    await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.ARTICLE,
      title: 'Patna District Rural Electrification',
      description: '100% target achieved',
      mediaUrl: 'https://cdn.naagrik.news/media/elec.jpg',
      thumbnailUrl: 'https://cdn.naagrik.news/media/thumb-elec.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'District Center' },
      districtCode: 1001,
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      publishedAt: now
    });

    // User is in remote village Bikrampur and requests 10 items
    const feed = await FeedService.getFeed({
      localBodyCode: 8881,
      subdistrictCode: 10015,
      districtCode: 1001,
      stateCode: 10,
      village: 'Bikrampur',
      limit: 10
    });

    const contentItems = feed.items.filter(i => i.itemType === 'CONTENT');

    // Does NOT return only 1 item; expands outward to include subdistrict and district!
    expect(contentItems.length).toBe(3);
    expect(contentItems[0].data.id).toBe(villageStory.id);
    expect(contentItems[0].data.locationTier).toBe('LOCAL_AREA');
    expect(feed.pagination.totalItems).toBe(3);
  });

  it('interleaves active advertisements and handles pagination with cursor', async () => {
    const creatorUser = await UsersDb.create({
      name: 'News Room',
      email: 'newsroom@naagrik.in',
      passwordHash: 'secret',
      role: UserRole.CREATOR
    });
    const creator = await CreatorsDb.create({ userId: creatorUser.id });
    const category = await CategoriesDb.create({ name: 'Daily', slug: 'daily' });

    // Seed 6 published items
    for (let i = 1; i <= 6; i++) {
      await ContentsDb.create({
        creatorId: creator.id,
        type: ContentType.ARTICLE,
        title: `Daily Update ${i}`,
        description: `Description for daily update ${i}`,
        mediaUrl: `https://cdn.naagrik.news/media/daily-${i}.jpg`,
        thumbnailUrl: `https://cdn.naagrik.news/media/thumb-daily-${i}.jpg`,
        categoryId: category.id,
        location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
        localBodyCode: 5001,
        moderationStatus: ModerationStatus.APPROVED,
        publicationStatus: 'PUBLISHED'
      });
    }

    // Seed 1 active advertisement
    await AdvertisementsDb.create({
      name: 'Festive Discount Offer',
      type: AdType.BANNER,
      mediaUrl: 'https://cdn.naagrik.news/ads/festive.png',
      frequency: 4,
      status: 'ACTIVE'
    });

    // Request feed with page 1, limit 6 (default ad frequency is 4)
    const feed = await FeedService.getFeed({
      localBodyCode: 5001,
      page: 1,
      limit: 6
    });

    expect(feed.pagination.page).toBe(1);
    expect(feed.pagination.totalItems).toBe(6);
    expect(feed.pagination.totalPages).toBe(1);
    expect(feed.pagination.cursor).toBe('6');

    // Total feed items should be 6 content items + 1 interleaved ad = 7 items
    expect(feed.items.length).toBe(7);

    // Item 4 (index 3) should be followed by ADVERTISEMENT at index 4
    const contentBeforeAd = feed.items[3];
    const adItem = feed.items[4];
    expect(contentBeforeAd.itemType).toBe('CONTENT');
    expect(adItem.itemType).toBe('ADVERTISEMENT');
    expect(adItem.data.name).toBe('Festive Discount Offer');
  });
});
