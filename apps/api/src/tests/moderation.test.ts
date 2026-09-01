import { FeedService } from '../services/feed.service';
import {
  UsersDb,
  CreatorsDb,
  CategoriesDb,
  ContentsDb,
  memoryStore
} from '../db/supabaseClient';
import { ModerationStatus, ContentType, UserRole } from '@naagrik/shared-types';

beforeEach(() => {
  memoryStore.clear();
});

describe('Moderation Visibility Rule Test (Supabase)', () => {
  it('strictly excludes REJECTED and PENDING content from public location feeds', async () => {
    const creatorUser = await UsersDb.create({
      name: 'Mod Creator',
      email: 'mod@test.com',
      passwordHash: 'hash',
      role: UserRole.CREATOR
    });
    const creator = await CreatorsDb.create({ userId: creatorUser.id });
    const category = await CategoriesDb.create({ name: 'Politics', slug: 'politics' });

    // 1. Approved Content
    const approvedContent = await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.ARTICLE,
      title: 'Approved Local Election Update',
      description: 'Official results declared',
      mediaUrl: 'https://pub-r2.naagrik.news/media/images/a.jpg',
      thumbnailUrl: 'https://pub-r2.naagrik.news/media/thumbnails/a.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED'
    });

    // 2. Rejected Content
    await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.ARTICLE,
      title: 'Prohibited Fake News Article',
      description: 'Unverified rumor content',
      mediaUrl: 'https://pub-r2.naagrik.news/media/images/b.jpg',
      thumbnailUrl: 'https://pub-r2.naagrik.news/media/thumbnails/b.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      moderationStatus: ModerationStatus.REJECTED,
      rejectionReason: 'Unverified claim and hate content',
      publicationStatus: 'PUBLISHED'
    });

    // 3. Pending Review Content
    await ContentsDb.create({
      creatorId: creator.id,
      type: ContentType.VIDEO,
      title: 'Pending Draft Video Report',
      description: 'Waiting for review',
      mediaUrl: 'https://pub-r2.naagrik.news/media/videos/c.mp4',
      thumbnailUrl: 'https://pub-r2.naagrik.news/media/thumbnails/c.jpg',
      categoryId: category.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      moderationStatus: ModerationStatus.PENDING_REVIEW,
      publicationStatus: 'PUBLISHED'
    });

    // Fetch Public Feed
    const feed = await FeedService.getFeed({ city: 'Patna', area: 'Kankarbagh' });

    // Assert only approved item is in feed
    const contentItems = feed.items.filter(i => i.itemType === 'CONTENT');
    expect(contentItems.length).toBe(1);
    expect(contentItems[0].data.id).toBe(approvedContent.id);
  });
});
