import {
  ContentsDb,
  PersonalizedFeedOptions
} from '../db/supabaseClient';
import { ContentType } from '@naagrik/shared-types';

export interface FeedQueryOptions extends PersonalizedFeedOptions {
  country?: string;
  state?: string;
  city?: string;
  district?: string;
  subdistrict?: string;
  village?: string;
  area?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  stateCode?: number;
  districtCode?: number;
  subdistrictCode?: number;
  localBodyCode?: number;
  categoryId?: string;
  categorySlug?: string;
  contentType?: ContentType;
  page?: number;
  limit?: number;
  cursor?: string;
}

export class FeedService {
  /**
   * Get location-priority personalized news feed
   * Combines PostGIS distance radar, official LGD administrative hierarchy,
   * freshness decay, creator quality, engagement, and anti-repetition diversity.
   */
  static async getFeed(options: FeedQueryOptions): Promise<{
    items: Array<{ itemType: string; data: any }>;
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      cursor: string | null;
    };
  }> {
    const result = await ContentsDb.getPersonalizedFeed(options);
    return {
      items: result.items,
      pagination: result.pagination
    };
  }
}
