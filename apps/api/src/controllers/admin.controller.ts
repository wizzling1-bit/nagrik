import { Response } from 'express';
import { AuthRequest } from '../middlewares/rbac';
import {
  UsersDb,
  CreatorsDb,
  ContentsDb,
  PayoutRequestsDb,
  AdvertisementsDb,
  SystemSettingsDb,
  AuditLogsDb,
  CategoriesDb
} from '../db/supabaseClient';
import { ModerationService } from '../services/moderation.service';
import { PayoutService } from '../services/payout.service';
import { ModerationStatus, PayoutStatus, UserRole } from '@naagrik/shared-types';

export class AdminController {
  /**
   * High Information Density Admin Dashboard Metrics
   */
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      const totalUsers = await UsersDb.count(UserRole.USER);
      const activeCreators = await CreatorsDb.count();
      const publishedContent = await ContentsDb.count({ moderationStatus: ModerationStatus.APPROVED });
      const pendingModeration = await ContentsDb.count({ moderationStatus: ModerationStatus.PENDING_REVIEW });
      const flaggedModeration = await ContentsDb.count({ moderationStatus: ModerationStatus.FLAGGED });

      const pendingPayoutsCount = await PayoutRequestsDb.count(PayoutStatus.PENDING);
      const activeAds = await AdvertisementsDb.count('ACTIVE');

      const paidRequests = await PayoutRequestsDb.find({ status: PayoutStatus.PAID });
      const totalPaidOut = paidRequests.reduce((acc: number, cur: any) => acc + (cur.amount || 0), 0);

      const allContents = (await ContentsDb.find({})).contents;
      let totalViews = 0;
      let totalEligibleViews = 0;
      allContents.forEach(c => {
        totalViews += (c.views || 0);
        totalEligibleViews += (c.eligibleViews ?? c.eligible_views ?? 0);
      });

      const systemSetting = await SystemSettingsDb.get();

      return res.json({
        success: true,
        metrics: {
          totalUsers,
          activeCreators,
          publishedContent,
          pendingModeration,
          flaggedModeration,
          pendingPayoutsCount,
          activeAds,
          totalPaidOut,
          totalViews,
          totalEligibleViews,
          systemSetting
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Moderation Queue
   */
  static async getModerationQueue(req: AuthRequest, res: Response) {
    try {
      const { status, page, limit } = req.query;
      const targetStatus = (status as string) || ModerationStatus.PENDING_REVIEW;
      const p = Math.max(1, parseInt(page as string) || 1);
      const l = Math.min(50, parseInt(limit as string) || 20);
      const skip = (p - 1) * l;

      const result = await ContentsDb.find({
        moderationStatus: targetStatus,
        skip,
        limit: l
      });

      return res.json({
        success: true,
        items: result.contents,
        pagination: { page: p, limit: l, totalItems: result.total, totalPages: Math.ceil(result.total / l) }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Moderation Action (Approve / Reject / Flag)
   */
  static async reviewContent(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Auth required' });
      const { contentId, status, rejectionReason } = req.body;

      const updated = await ModerationService.reviewContent(
        req.user.id,
        req.user.email,
        contentId,
        status as ModerationStatus,
        rejectionReason
      );

      return res.json({ success: true, content: updated, message: `Content status updated to ${status}` });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Payout Request Processing Queue
   */
  static async getPayoutRequests(req: AuthRequest, res: Response) {
    try {
      const { status } = req.query;
      const requests = await PayoutRequestsDb.find(status ? { status: status as PayoutStatus } : undefined);
      return res.json({ success: true, requests });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Process Payout (Mark PAID with UTR / transactionReference)
   */
  static async processPayout(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, error: 'Auth required' });
      const { requestId, status, transactionReference, adminNote } = req.body;

      const payout = await PayoutService.processPayoutRequest(
        req.user.id,
        req.user.email,
        requestId,
        status as PayoutStatus,
        transactionReference,
        adminNote
      );

      return res.json({ success: true, payout, message: `Payout request updated to ${status}` });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * Manage Advertisements (CRUD)
   */
  static async getAds(req: AuthRequest, res: Response) {
    try {
      const ads = await AdvertisementsDb.list();
      return res.json({ success: true, ads });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createAd(req: AuthRequest, res: Response) {
    try {
      const { name, type, mediaUrl, targetLocation, targetCategory, startDate, endDate, frequency, status } = req.body;
      const ad = await AdvertisementsDb.create({
        name,
        type,
        mediaUrl,
        targetLocation,
        targetCategory,
        startDate: startDate || new Date(),
        endDate: endDate || new Date(Date.now() + 30 * 86400000),
        frequency: frequency || 4,
        status: status || 'ACTIVE'
      });
      return res.status(201).json({ success: true, ad });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get & Update System Settings ($10 min payout, rate per 1000 views, ad frequency)
   */
  static async getSettings(req: AuthRequest, res: Response) {
    try {
      const settings = await SystemSettingsDb.get();
      return res.json({ success: true, settings });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateSettings(req: AuthRequest, res: Response) {
    try {
      const { minPayoutAmount, earningRatePer1000Views, maxCountedViewsPerVideo, adFeedFrequency } = req.body;
      const settings = await SystemSettingsDb.upsert({
        minPayoutAmount,
        earningRatePer1000Views,
        maxCountedViewsPerVideo,
        adFeedFrequency
      });
      return res.json({ success: true, settings, message: 'System settings updated successfully.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Audit Logs Inspector
   */
  static async getAuditLogs(req: AuthRequest, res: Response) {
    try {
      const logs = await AuditLogsDb.listRecent(100);
      return res.json({ success: true, logs });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Category Management
   */
  static async getCategories(req: AuthRequest, res: Response) {
    try {
      const categories = await CategoriesDb.list();
      return res.json({ success: true, categories });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async createCategory(req: AuthRequest, res: Response) {
    try {
      const { name, slug, displayOrder } = req.body;
      const category = await CategoriesDb.create({ name, slug, displayOrder });
      return res.status(201).json({ success: true, category });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
