import { Router } from 'express';
import { ContentController } from '../controllers/content.controller';
import { requireAuth, optionalAuth } from '../middlewares/rbac';
import { validate } from '../middlewares/validate';
import { ContentCreateSchema } from '@naagrik/shared-types';

const router = Router();

// Public Discovery APIs (For Flutter app & Web)
router.get('/feed', optionalAuth, ContentController.getFeed);
router.get('/search', optionalAuth, ContentController.searchContent);
router.get('/categories', ContentController.getCategories);
router.get('/locations', ContentController.getLocations);

// Creator Content Creation & Upload URLs
router.post('/upload-url', requireAuth, ContentController.getUploadUrl);
router.post('/', requireAuth, validate(ContentCreateSchema), ContentController.createContent);

// Single Item & User Interactions
router.get('/:id', optionalAuth, ContentController.getDetail);
router.post('/:id/like', optionalAuth, ContentController.toggleLike);
router.post('/:id/save', optionalAuth, ContentController.toggleSave);
router.post('/:id/report', optionalAuth, ContentController.reportContent);

export default router;
