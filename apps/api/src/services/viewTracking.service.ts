import {
  ContentsDb,
  CreatorsDb,
  VideoViewsDb,
  SystemSettingsDb
} from '../db/supabaseClient';
import { BUSINESS_RULES } from '@naagrik/shared-types';

export class ViewTrackingService {
  /**
   * Register and validate a video view from backend.
   * Enforces strict maximum 3 counted/monetized views per user/video.
   */
  static async registerVideoView(userId: string, videoId: string) {
    const video = await ContentsDb.findById(videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    const currentViews = (video.views || 0) + 1;
    let currentEligibleViews = video.eligibleViews ?? video.eligible_views ?? 0;

    // Always increment total raw view count
    await ContentsDb.update(video.id, {
      views: currentViews
    });

    // Fetch system monetization settings
    const setting = await SystemSettingsDb.get();
    const maxCountedViews = setting?.maxCountedViewsPerVideo ?? setting?.max_counted_views_per_video ?? BUSINESS_RULES.MAX_COUNTED_VIEWS_PER_VIDEO;
    const ratePer1000 = setting?.earningRatePer1000Views ?? setting?.earning_rate_per_1000_views ?? BUSINESS_RULES.DEFAULT_EARNING_RATE_PER_1000_VIEWS;

    // Find or create user video view tracking record
    let viewRecord = await VideoViewsDb.findOne(userId, videoId);
    let isEligible = false;
    let countedViews = viewRecord ? (viewRecord.countedViewCount ?? viewRecord.counted_view_count ?? 0) : 0;

    if (!viewRecord) {
      if (countedViews < maxCountedViews) {
        countedViews += 1;
        isEligible = true;
      }
      viewRecord = await VideoViewsDb.create({
        userId,
        videoId,
        countedViewCount: countedViews
      });
    } else {
      if (countedViews < maxCountedViews) {
        countedViews += 1;
        isEligible = true;
        await VideoViewsDb.update(viewRecord.id, {
          countedViewCount: countedViews,
          counted_view_count: countedViews,
          lastViewedAt: new Date().toISOString(),
          last_viewed_at: new Date().toISOString()
        });
      } else {
        await VideoViewsDb.update(viewRecord.id, {
          lastViewedAt: new Date().toISOString(),
          last_viewed_at: new Date().toISOString()
        });
      }
    }

    if (isEligible) {
      currentEligibleViews += 1;
      await ContentsDb.update(video.id, {
        eligibleViews: currentEligibleViews,
        eligible_views: currentEligibleViews
      });

      // Calculate incremental earning ($ rate / 1000)
      const viewEarning = ratePer1000 / 1000;

      // Update Creator metrics
      const videoCreatorId = video.creatorId?.id || video.creatorId || video.creator_id;
      const creator = await CreatorsDb.findById(videoCreatorId);
      if (creator) {
        const prevTotalEligible = creator.totalEligibleViews ?? creator.total_eligible_views ?? 0;
        const prevBalance = creator.availableBalance ?? creator.available_balance ?? 0;
        const prevLifetime = creator.lifetimeEarnings ?? creator.lifetime_earnings ?? 0;

        await CreatorsDb.update(creator.id, {
          totalEligibleViews: prevTotalEligible + 1,
          total_eligible_views: prevTotalEligible + 1,
          availableBalance: Number((prevBalance + viewEarning).toFixed(6)),
          available_balance: Number((prevBalance + viewEarning).toFixed(6)),
          lifetimeEarnings: Number((prevLifetime + viewEarning).toFixed(6)),
          lifetime_earnings: Number((prevLifetime + viewEarning).toFixed(6))
        });
      }
    }

    return {
      isEligibleView: isEligible,
      currentCountedViews: countedViews,
      totalViews: currentViews,
      eligibleViews: currentEligibleViews
    };
  }
}
