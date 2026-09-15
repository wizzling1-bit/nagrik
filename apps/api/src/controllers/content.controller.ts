import { Response } from 'express';
import { AuthRequest } from '../middlewares/rbac';
import { R2StorageService } from '../services/r2Storage.service';
import { ModerationService } from '../services/moderation.service';
import { FeedService } from '../services/feed.service';
import {
  ContentsDb,
  CreatorsDb,
  CategoriesDb,
  LocationsDb,
  UsersDb,
  ReportsDb,
  CmsDb
} from '../db/supabaseClient';
import { ModerationStatus, UserRole } from '@naagrik/shared-types';

export class ContentController {
  /**
   * Get All Public Legal CMS Pages
   */
  static async getCmsPages(req: AuthRequest, res: Response) {
    try {
      const pages = await CmsDb.list();
      return res.json({ success: true, pages });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get Single Legal CMS Page by slug
   */
  static async getCmsPage(req: AuthRequest, res: Response) {
    try {
      const { slug } = req.params;
      const page = await CmsDb.findBySlug(slug);
      if (!page) return res.status(404).json({ success: false, error: 'Legal page not found' });
      return res.json({ success: true, page });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get All Public Active Categories (For Flutter Mobile App)
   */
  static async getCategories(req: AuthRequest, res: Response) {
    try {
      const categories = await CategoriesDb.list();
      return res.json({ success: true, categories });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get Supported Locations for City / Locality Selection (For Flutter Mobile App)
   */
  static async getLocations(req: AuthRequest, res: Response) {
    try {
      const locations = await LocationsDb.list();
      return res.json({ success: true, locations });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Cloudflare R2 Presigned Upload URL generator
   */
  static async getUploadUrl(req: AuthRequest, res: Response) {
    try {
      const { folder, mimeType, fileExtension } = req.body;
      if (!folder || !mimeType || !fileExtension) {
        return res.status(400).json({ success: false, error: 'folder, mimeType, fileExtension are required' });
      }

      const result = await R2StorageService.getPresignedUploadUrl(folder, mimeType, fileExtension);
      return res.json({ success: true, ...result });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Helper to resolve a valid category ID from ID string, category slug, or fallback
   */
  private static async resolveCategoryId(categoryId: any): Promise<string | null> {
    if (!categoryId) return null;
    
    const byId = await CategoriesDb.findById(categoryId.toString());
    if (byId) return byId.id;

    const cleanSlug = categoryId.toString().toLowerCase().replace(/^cat_/, '');
    const bySlug = await CategoriesDb.findBySlug(cleanSlug);
    if (bySlug) return bySlug.id;

    const byName = await CategoriesDb.findByName(cleanSlug);
    if (byName) return byName.id;

    const defaultCat = await CategoriesDb.findBySlug('local');
    return defaultCat ? defaultCat.id : null;
  }

  /**
   * Create Content (Article or Video)
   */
  static async createContent(req: AuthRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== UserRole.CREATOR) {
        return res.status(403).json({ success: false, error: 'Only registered creators can create content.' });
      }

      let creator = await CreatorsDb.findByUserId(req.user.id);
      if (!creator) {
        creator = await CreatorsDb.create({ userId: req.user.id });
      }

      const { type, title, description, mediaUrl, thumbnailUrl, categoryId, location } = req.body;

      const targetCategoryId = await ContentController.resolveCategoryId(categoryId);
      if (!targetCategoryId) {
        return res.status(400).json({ success: false, error: `Invalid categoryId: '${categoryId}'. Please provide a valid category ID or slug.` });
      }

      // Automated scan check
      const scanResult = ModerationService.autoScanContent(`${title} ${description}`);
      let status = ModerationStatus.PENDING_REVIEW;
      let rejectionReason: string | undefined = undefined;

      if (!scanResult.isClean) {
        status = ModerationStatus.FLAGGED;
        rejectionReason = scanResult.flagReason;
      }

      const content = await ContentsDb.create({
        creatorId: creator.id,
        type,
        title,
        description,
        mediaUrl,
        thumbnailUrl,
        categoryId: targetCategoryId,
        location: location || { country: 'India', state: 'Bihar', city: 'Patna', area: 'Kankarbagh' },
        moderationStatus: status,
        rejectionReason,
        publicationStatus: 'PUBLISHED'
      });

      return res.status(201).json({
        success: true,
        content,
        moderationMessage: status === ModerationStatus.FLAGGED 
          ? 'Content flagged by automated system and queued for manual admin review.'
          : 'Content submitted successfully and pending admin approval.'
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Public Location-Based Feed Endpoint (Credential-Free)
   */
  static async getFeed(req: AuthRequest, res: Response) {
    try {
      const { country, state, city, area, categorySlug, contentType, page, limit } = req.query;

      const feed = await FeedService.getFeed({
        country: country as string,
        state: state as string,
        city: city as string,
        area: area as string,
        categorySlug: categorySlug as string,
        contentType: contentType as any,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20
      });

      return res.json({ success: true, ...feed });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Search Content (Credential-Free)
   */
  static async searchContent(req: AuthRequest, res: Response) {
    try {
      const { q, categoryId, city, type } = req.query;

      let targetCategoryId: string | undefined = undefined;
      if (categoryId) {
        const resolved = await ContentController.resolveCategoryId(categoryId);
        if (resolved) targetCategoryId = resolved;
      }

      const result = await ContentsDb.find({
        moderationStatus: ModerationStatus.APPROVED,
        publicationStatus: 'PUBLISHED',
        searchQuery: q as string,
        categoryId: targetCategoryId,
        city: city as string,
        type: type as any,
        limit: 30
      });

      return res.json({ success: true, contents: result.contents });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Get Detail by ID (Credential-Free for Approved Content)
   */
  static async getDetail(req: AuthRequest, res: Response) {
    try {
      const content = await ContentsDb.findById(req.params.id);

      if (!content) {
        return res.status(404).json({ success: false, error: 'Content not found' });
      }

      // If content is not approved, only creator or admin can view
      if (content.moderationStatus !== ModerationStatus.APPROVED && content.moderation_status !== ModerationStatus.APPROVED) {
        const creatorId = content.creatorId?.id || content.creatorId || content.creator_id;
        const isOwner = req.user && req.user.creatorId === creatorId;
        const isAdmin = req.user && req.user.role === UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
          return res.status(403).json({ success: false, error: 'Content is under review or rejected' });
        }
      }

      return res.json({ success: true, content });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Toggle Like on content (Credential-Free)
   */
  static async toggleLike(req: AuthRequest, res: Response) {
    try {
      const contentId = req.params.id;
      const content = await ContentsDb.findById(contentId);
      if (!content) return res.status(404).json({ success: false, error: 'Content not found' });

      const currentLikes = content.likes || 0;
      const newLikes = currentLikes + 1;
      await ContentsDb.update(contentId, { likes: newLikes });

      return res.json({ success: true, isLiked: true, likes: newLikes });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Save content (Credential-Free or Logged-in)
   */
  static async toggleSave(req: AuthRequest, res: Response) {
    try {
      const contentId = req.params.id;
      const content = await ContentsDb.findById(contentId);
      if (!content) return res.status(404).json({ success: false, error: 'Content not found' });

      const userId = req.user?.id;
      let isSaved = true;

      if (userId) {
        const user = await UsersDb.findById(userId);
        if (user) {
          const savedIds: string[] = user.savedContentIds || user.saved_content_ids || [];
          const index = savedIds.indexOf(contentId);
          const currentSaves = content.saves || 0;

          if (index >= 0) {
            savedIds.splice(index, 1);
            await ContentsDb.update(contentId, { saves: Math.max(0, currentSaves - 1) });
            isSaved = false;
          } else {
            savedIds.push(contentId);
            await ContentsDb.update(contentId, { saves: currentSaves + 1 });
            isSaved = true;
          }

          await UsersDb.update(user.id, {
            savedContentIds: savedIds,
            saved_content_ids: savedIds
          });
        }
      } else {
        // Increment saves count for guest
        await ContentsDb.update(contentId, { saves: (content.saves || 0) + 1 });
      }

      return res.json({ success: true, isSaved });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * Report content (Credential-Free)
   */
  static async reportContent(req: AuthRequest, res: Response) {
    try {
      const { reason, deviceId } = req.body;
      if (!reason) return res.status(400).json({ success: false, error: 'Reason required' });

      const reporterId = req.user?.id || deviceId || (req.headers['x-device-id'] as string) || 'anonymous-reporter';

      const report = await ReportsDb.create({
        reporterId,
        contentId: req.params.id,
        reason
      });

      return res.json({ success: true, report, message: 'Report submitted for review.' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
