import { ViewTrackingService } from '../services/viewTracking.service';
import {
  UsersDb,
  CreatorsDb,
  ContentsDb,
  CategoriesDb,
  memoryStore
} from '../db/supabaseClient';
import { UserRole, ContentType, ModerationStatus } from '@naagrik/shared-types';

beforeEach(() => {
  memoryStore.clear();
});

describe('Monetized View Tracking - 3-View Ceiling Rule Test (Supabase)', () => {
  it('strictly counts max 3 monetized views per user/video and ignores 4th & 5th views', async () => {
    const user = await UsersDb.create({
      name: 'Test Viewer',
      email: 'viewer@test.com',
      passwordHash: 'hash',
      role: UserRole.USER
    });

    const creatorUser = await UsersDb.create({
      name: 'Test Creator',
      email: 'creator@test.com',
      passwordHash: 'hash',
      role: UserRole.CREATOR
    });

    const creator = await CreatorsDb.create({ userId: creatorUser.id });
    const category = await CategoriesDb.create({ name: 'Local News', slug: 'local-news' });

    const video = await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.VIDEO,
      title: 'Patna Local Report Short',
      description: 'Exclusive report on city infrastructure project',
      mediaUrl: 'https://pub-r2.naagrik.news/media/videos/sample.mp4',
      thumbnailUrl: 'https://pub-r2.naagrik.news/media/thumbnails/sample.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED'
    });

    const userIdStr = user.id;
    const videoIdStr = video.id;

    // 1st View -> Should be COUNTED & ELIGIBLE
    const v1 = await ViewTrackingService.registerVideoView(userIdStr, videoIdStr);
    expect(v1.isEligibleView).toBe(true);
    expect(v1.currentCountedViews).toBe(1);
    expect(v1.eligibleViews).toBe(1);

    // 2nd View -> Should be COUNTED & ELIGIBLE
    const v2 = await ViewTrackingService.registerVideoView(userIdStr, videoIdStr);
    expect(v2.isEligibleView).toBe(true);
    expect(v2.currentCountedViews).toBe(2);
    expect(v2.eligibleViews).toBe(2);

    // 3rd View -> Should be COUNTED & ELIGIBLE
    const v3 = await ViewTrackingService.registerVideoView(userIdStr, videoIdStr);
    expect(v3.isEligibleView).toBe(true);
    expect(v3.currentCountedViews).toBe(3);
    expect(v3.eligibleViews).toBe(3);

    // 4th View -> Should be IGNORED for monetization
    const v4 = await ViewTrackingService.registerVideoView(userIdStr, videoIdStr);
    expect(v4.isEligibleView).toBe(false);
    expect(v4.currentCountedViews).toBe(3); // capped at 3
    expect(v4.eligibleViews).toBe(3); // eligible count remains 3
    expect(v4.totalViews).toBe(4); // raw views incremented to 4

    // 5th View -> Should be IGNORED for monetization
    const v5 = await ViewTrackingService.registerVideoView(userIdStr, videoIdStr);
    expect(v5.isEligibleView).toBe(false);
    expect(v5.currentCountedViews).toBe(3); // capped at 3
    expect(v5.eligibleViews).toBe(3); // eligible count remains 3
    expect(v5.totalViews).toBe(5); // raw views incremented to 5
  });
});
