import { Response } from 'express';
import { AuthRequest } from '../middlewares/rbac';
import {
  CreatorsDb,
  ContentsDb,
  PayoutMethodsDb,
  PayoutRequestsDb
} from '../db/supabaseClient';
import { PayoutService } from '../services/payout.service';
import { ModerationStatus } from '@naagrik/shared-types';

export class CreatorController {
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      if (!req.user || !req.user.creatorId) {
        return res.status(403).json({ success: false, error: 'Creator profile required' });
      }

      const creator = await CreatorsDb.findById(req.user.creatorId);
      if (!creator) return res.status(404).json({ success: false, error: 'Creator not found' });

      const totalContent = await ContentsDb.count({ creatorId: creator.id });
      const publishedContent = await ContentsDb.count({ creatorId: creator.id, moderationStatus: ModerationStatus.APPROVED });
      const pendingContent = await ContentsDb.count({ creatorId: creator.id, moderationStatus: ModerationStatus.PENDING_REVIEW });
      const rejectedContent = await ContentsDb.count({ creatorId: creator.id, moderationStatus: ModerationStatus.REJECTED });

      const pendingRequests = await PayoutRequestsDb.find({ creatorId: creator.id, status: 'PENDING' });
      const pendingPayoutAmount = pendingRequests.reduce((acc: number, cur: any) => acc + (cur.amount || 0), 0);

      const availableBalance = creator.availableBalance ?? creator.available_balance ?? 0;
      const lifetimeEarnings = creator.lifetimeEarnings ?? creator.lifetime_earnings ?? 0;
      const totalEligibleViews = creator.totalEligibleViews ?? creator.total_eligible_views ?? 0;
      const totalPaid = creator.totalPaid ?? creator.total_paid ?? 0;

      return res.json({
        success: true,
        stats: {
          totalContent,
          publishedContent,
          pendingContent,
          rejectedContent,
          totalEligibleViews,
          availableBalance,
          lifetimeEarnings,
          pendingPayoutAmount,
          totalPaid
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getMyContent(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });

      const result = await ContentsDb.find({ creatorId: req.user.creatorId });
      return res.json({ success: true, contents: result.contents });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAnalytics(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });

      const result = await ContentsDb.find({ creatorId: req.user.creatorId });
      const contents = result.contents;

      let totalViews = 0;
      let totalEligibleViews = 0;
      let totalLikes = 0;
      let totalShares = 0;
      let totalSaves = 0;

      contents.forEach(c => {
        totalViews += (c.views || 0);
        totalEligibleViews += (c.eligibleViews ?? c.eligible_views ?? 0);
        totalLikes += (c.likes || 0);
        totalShares += (c.shares || 0);
        totalSaves += (c.saves || 0);
      });

      return res.json({
        success: true,
        analytics: {
          totalContentCount: contents.length,
          totalViews,
          totalEligibleViews,
          nonEligibleViews: Math.max(0, totalViews - totalEligibleViews),
          totalLikes,
          totalShares,
          totalSaves
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getPayoutMethods(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });

      const methods = await PayoutMethodsDb.findByCreatorId(req.user.creatorId);
      return res.json({ success: true, methods });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async addPayoutMethod(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });
      const { type, bankDetails, upiId } = req.body;

      if (type === 'BANK' && (!bankDetails || !bankDetails.accountNumber || !bankDetails.ifsc)) {
        return res.status(400).json({ success: false, error: 'Bank account number and IFSC are required' });
      }
      if (type === 'UPI' && !upiId) {
        return res.status(400).json({ success: false, error: 'UPI ID is required' });
      }

      // Deactivate existing default methods
      await PayoutMethodsDb.updateMany(req.user.creatorId, { isDefault: false, is_default: false });

      const method = await PayoutMethodsDb.create({
        creatorId: req.user.creatorId,
        type,
        bankDetails,
        upiId,
        isDefault: true
      });

      return res.status(201).json({ success: true, method });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async requestPayout(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });
      const { amount, payoutMethodId } = req.body;

      const payoutRequest = await PayoutService.createPayoutRequest(
        req.user.creatorId,
        parseFloat(amount),
        payoutMethodId
      );

      return res.status(201).json({
        success: true,
        payoutRequest,
        message: 'Payout request submitted successfully. Target processing time within 24 hours.'
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getPayoutHistory(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });

      const requests = await PayoutRequestsDb.find({ creatorId: req.user.creatorId });
      return res.json({ success: true, requests });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
