import { Router } from 'express';
import { ContentController } from '../controllers/content.controller';
import { requireAuth, optionalAuth, requireRole } from '../middlewares/rbac';
import { validate } from '../middlewares/validate';
import { ContentCreateSchema, UserRole } from '@naagrik/shared-types';

const router = Router();

// Public Discovery APIs (For Flutter app & Web)
router.get('/feed', optionalAuth, ContentController.getFeed);
router.get('/search', optionalAuth, ContentController.searchContent);
router.get('/categories', ContentController.getCategories);
router.get('/locations', ContentController.getLocations);
router.get('/cms', ContentController.getCmsPages);
router.get('/cms/:slug', ContentController.getCmsPage);

// Creator Content Creation & Upload URLs (Publishers & Admins only)
router.post('/upload-url', requireAuth, requireRole(UserRole.CREATOR, UserRole.ADMIN), ContentController.getUploadUrl);
router.post('/', requireAuth, requireRole(UserRole.CREATOR, UserRole.ADMIN), validate(ContentCreateSchema), ContentController.createContent);

// Single Item & User Interactions
router.get('/:id', optionalAuth, ContentController.getDetail);
router.post('/:id/like', optionalAuth, ContentController.toggleLike);
router.post('/:id/save', optionalAuth, ContentController.toggleSave);
router.post('/:id/report', optionalAuth, ContentController.reportContent);

export default router;
