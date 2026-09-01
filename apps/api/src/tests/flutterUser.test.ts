import supertest from 'supertest';
import { createApp } from '../app';
import { ContentsDb, CategoriesDb, memoryStore } from '../db/supabaseClient';
import { ContentType, ModerationStatus } from '@naagrik/shared-types';

let app: any;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  memoryStore.clear();
});

describe('Flutter Mobile App - Zero-Auth Credential-Free User APIs Test', () => {
  it('allows public feed and category browsing without any login or registration', async () => {
    const cat = await CategoriesDb.create({ name: 'Politics', slug: 'politics' });
    await ContentsDb.create({
      creatorId: 'cr_test',
      type: ContentType.VIDEO,
      title: 'Breaking Local Update',
      description: 'Patna news update',
      mediaUrl: 'https://pub-r2.naagrik.news/media/videos/test.mp4',
      thumbnailUrl: 'https://pub-r2.naagrik.news/media/thumbnails/test.jpg',
      categoryId: cat.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED'
    });

    // 1. Fetch categories public (no auth)
    const catRes = await supertest(app).get('/api/v1/content/categories');
    expect(catRes.status).toBe(200);
    expect(catRes.body.categories.length).toBe(1);

    // 2. Fetch public feed (no auth)
    const feedRes = await supertest(app).get('/api/v1/content/feed?city=Patna&area=Kankarbagh');
    expect(feedRes.status).toBe(200);
    expect(feedRes.body.items.length).toBe(1);
    expect(feedRes.body.items[0].data.title).toBe('Breaking Local Update');
  });

  it('allows credential-free video view tracking using deviceId without user login', async () => {
    const cat = await CategoriesDb.create({ name: 'Sports', slug: 'sports' });
    const video = await ContentsDb.create({
      creatorId: 'cr_test',
      type: ContentType.VIDEO,
      title: 'Local Cricket Final',
      description: 'Championship match',
      mediaUrl: 'https://pub-r2.naagrik.news/media/videos/cricket.mp4',
      thumbnailUrl: 'https://pub-r2.naagrik.news/media/thumbnails/cricket.jpg',
      categoryId: cat.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED'
    });

    // View with deviceId only (No user account or login)
    const viewRes = await supertest(app)
      .post('/api/v1/views')
      .send({
        videoId: video.id,
        deviceId: 'device-test-uuid-999'
      });

    expect(viewRes.status).toBe(200);
    expect(viewRes.body.success).toBe(true);
    expect(viewRes.body.isEligibleView).toBe(true);
    expect(viewRes.body.currentCountedViews).toBe(1);
    expect(viewRes.body.totalViews).toBe(1);
  });

  it('allows liking and reporting without login', async () => {
    const cat = await CategoriesDb.create({ name: 'Crime', slug: 'crime' });
    const content = await ContentsDb.create({
      creatorId: 'cr_test',
      type: ContentType.ARTICLE,
      title: 'Local Safety Alert',
      description: 'Traffic advisory',
      mediaUrl: 'https://pub-r2.naagrik.news/media/images/advisory.jpg',
      thumbnailUrl: 'https://pub-r2.naagrik.news/media/thumbnails/advisory.jpg',
      categoryId: cat.id,
      location: { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED'
    });

    // 1. Like
    const likeRes = await supertest(app).post(`/api/v1/content/${content.id}/like`);
    expect(likeRes.status).toBe(200);
    expect(likeRes.body.likes).toBe(1);

    // 2. Report
    const reportRes = await supertest(app)
      .post(`/api/v1/content/${content.id}/report`)
      .send({ reason: 'Incorrect timing mentioned', deviceId: 'dev_123' });
    expect(reportRes.status).toBe(200);
    expect(reportRes.body.success).toBe(true);
  });
});
