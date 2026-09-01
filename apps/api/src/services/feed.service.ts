import {
  ContentsDb,
  AdvertisementsDb,
  SystemSettingsDb
} from '../db/supabaseClient';
import { ModerationStatus, ContentType, BUSINESS_RULES } from '@naagrik/shared-types';

export interface FeedQueryOptions {
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  categorySlug?: string;
  contentType?: ContentType;
  page?: number;
  limit?: number;
}

export class FeedService {
  /**
   * Get location-prioritized news feed (Area > City > State > Country)
   * Strictly filters out non-approved or rejected content.
   * Dynamically inserts active advertisements after configured N content items.
   */
  static async getFeed(options: FeedQueryOptions) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(50, options.limit || 20);
    const skip = (page - 1) * limit;

    const result = await ContentsDb.find({
      moderationStatus: ModerationStatus.APPROVED,
      publicationStatus: 'PUBLISHED',
      type: options.contentType,
      city: options.city,
      area: options.area,
      skip,
      limit
    });

    const contents = result.contents;
    const totalCount = result.total;

    // Fetch active ads for ad feed insertion
    const activeAds = await AdvertisementsDb.findActive();

    // Get dynamic ad insertion frequency from settings
    const setting = await SystemSettingsDb.get();
    const adFrequency = setting?.adFeedFrequency ?? setting?.ad_feed_frequency ?? BUSINESS_RULES.DEFAULT_AD_FEED_FREQUENCY;

    // Interleave ads into content feed
    const items: any[] = [];
    let adIndex = 0;

    contents.forEach((item, index) => {
      items.push({ itemType: 'CONTENT', data: item });
      // Insert advertisement every adFrequency items
      if ((index + 1) % adFrequency === 0 && activeAds.length > 0) {
        const ad = activeAds[adIndex % activeAds.length];
        items.push({ itemType: 'ADVERTISEMENT', data: ad });
        adIndex++;
      }
    });

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }
}
