import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middlewares/rbac';
import { validateBody } from '../middlewares/validate';
import { ModerationActionSchema, ProcessPayoutSchema, UserRole } from '@naagrik/shared-types';

const router = Router();

router.use(requireAuth, requireRole(UserRole.ADMIN));

router.get('/dashboard', AdminController.getDashboard);
router.get('/moderation', AdminController.getModerationQueue);
router.post('/moderation/action', validateBody(ModerationActionSchema), AdminController.reviewContent);

router.get('/payouts', AdminController.getPayoutRequests);
router.post('/payouts/process', validateBody(ProcessPayoutSchema), AdminController.processPayout);

router.get('/ads', AdminController.getAds);
router.post('/ads', AdminController.createAd);

router.get('/settings', AdminController.getSettings);
router.put('/settings', AdminController.updateSettings);

router.get('/audit-logs', AdminController.getAuditLogs);

router.get('/categories', AdminController.getCategories);
router.post('/categories', AdminController.createCategory);

export default router;
