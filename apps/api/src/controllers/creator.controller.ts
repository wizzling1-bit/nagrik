import { Response } from 'express';
import { AuthRequest } from '../middlewares/rbac';
import {
  CreatorsDb,
  ContentsDb,
  PayoutMethodsDb,
  PayoutRequestsDb,
  CategoriesDb
} from '../db/supabaseClient';
import { PayoutService } from '../services/payout.service';
import { ModerationStatus, PayoutMethodType } from '@naagrik/shared-types';

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

      const stats = {
        totalContent,
        publishedContent,
        pendingContent,
        rejectedContent,
        totalEligibleViews,
        availableBalance,
        lifetimeEarnings,
        pendingPayoutAmount,
        totalPaid
      };

      return res.json({
        success: true,
        stats,
        data: { stats }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getMyContent(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });

      const result = await ContentsDb.find({ creatorId: req.user.creatorId });
      const contents = result.contents || [];
      return res.json({
        success: true,
        contents,
        data: contents
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async updateMyContent(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });
      const { id } = req.params;
      const content = await ContentsDb.findById(id);
      if (!content) return res.status(404).json({ success: false, error: 'Content not found' });

      const creatorId = content.creatorId?.id || content.creatorId || content.creator_id;
      if (creatorId !== req.user.creatorId) {
        return res.status(403).json({ success: false, error: 'Unauthorized to edit this content' });
      }

      const { title, category, categoryId, description } = req.body;
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;

      const catToResolve = categoryId || category;
      if (catToResolve) {
        const str = catToResolve.toString().trim();
        const cleanSlug = str.toLowerCase().replace(/^cat_/, '');
        const bySlug = await CategoriesDb.findBySlug(cleanSlug);
        if (bySlug) {
          updateData.categoryId = bySlug.id;
        } else {
          const byId = await CategoriesDb.findById(str);
          if (byId) updateData.categoryId = byId.id;
        }
      }

      const updated = await ContentsDb.update(id, updateData);
      return res.json({ success: true, content: updated, data: updated });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async deleteMyContent(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });
      const { id } = req.params;
      const content = await ContentsDb.findById(id);
      if (!content) return res.status(404).json({ success: false, error: 'Content not found' });

      const creatorId = content.creatorId?.id || content.creatorId || content.creator_id;
      if (creatorId !== req.user.creatorId) {
        return res.status(403).json({ success: false, error: 'Unauthorized to delete this content' });
      }

      await ContentsDb.delete(id);
      return res.json({ success: true, message: 'Content deleted successfully.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAnalytics(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });

      const result = await ContentsDb.find({ creatorId: req.user.creatorId });
      const contents = result.contents || [];

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

      const analytics = {
        totalContentCount: contents.length,
        totalViews,
        totalEligibleViews,
        nonEligibleViews: Math.max(0, totalViews - totalEligibleViews),
        totalLikes,
        totalShares,
        totalSaves
      };

      return res.json({
        success: true,
        analytics,
        data: analytics
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getPayoutMethods(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });

      const methods = await PayoutMethodsDb.findByCreatorId(req.user.creatorId);
      return res.json({ success: true, methods, data: methods });
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
        type: (type as PayoutMethodType) || PayoutMethodType.UPI,
        bankDetails,
        upiId,
        isDefault: true
      });

      return res.status(201).json({ success: true, method, data: method });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async requestPayout(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.creatorId) return res.status(403).json({ success: false, error: 'Creator required' });
      let { amount, payoutMethodId, payoutMethod, details } = req.body;
      const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);

      if (!payoutMethodId) {
        if (payoutMethod || details) {
          const method = await PayoutMethodsDb.create({
            creatorId: req.user.creatorId,
            type: (payoutMethod as PayoutMethodType) || PayoutMethodType.UPI,
            upiId: details?.upiId || req.body.upiId || `${req.user.email?.split('@')[0] || 'creator'}@oksbi`,
            bankDetails: details?.bankDetails || req.body.bankDetails,
            isDefault: true
          });
          payoutMethodId = method.id;
        } else {
          const methods = await PayoutMethodsDb.findByCreatorId(req.user.creatorId);
          const defaultMethod = methods.find((m: any) => m.isDefault || m.is_default) || methods[0];
          if (defaultMethod) {
            payoutMethodId = defaultMethod.id;
          } else {
            const method = await PayoutMethodsDb.create({
              creatorId: req.user.creatorId,
              type: PayoutMethodType.UPI,
              upiId: `${req.user.email?.split('@')[0] || 'creator'}@oksbi`,
              isDefault: true
            });
            payoutMethodId = method.id;
          }
        }
      }

      const payoutRequest = await PayoutService.createPayoutRequest(
        req.user.creatorId,
        parsedAmount || 10.00,
        payoutMethodId
      );

      return res.status(201).json({
        success: true,
        payoutRequest,
        data: payoutRequest,
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
      const requestList = Array.isArray(requests) ? requests : [];
      return res.json({
        success: true,
        requests: requestList,
        data: requestList
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
