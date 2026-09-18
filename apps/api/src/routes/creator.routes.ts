import { Router } from 'express';
import { CreatorController } from '../controllers/creator.controller';
import { ContentController } from '../controllers/content.controller';
import { requireAuth, requireRole } from '../middlewares/rbac';
import { validateBody } from '../middlewares/validate';
import { PayoutRequestSchema, ContentCreateSchema, UserRole } from '@naagrik/shared-types';

const router = Router();

router.use(requireAuth, requireRole(UserRole.CREATOR));

router.get('/dashboard', CreatorController.getDashboard);
router.get('/content', CreatorController.getMyContent);
router.post('/content', validateBody(ContentCreateSchema), ContentController.createContent);
router.put('/content/:id', CreatorController.updateMyContent);
router.delete('/content/:id', CreatorController.deleteMyContent);
router.get('/analytics', CreatorController.getAnalytics);
router.post('/payout-methods', CreatorController.addPayoutMethod);
router.get('/payout-methods', CreatorController.getPayoutMethods);
router.post('/request-payout', validateBody(PayoutRequestSchema), CreatorController.requestPayout);
router.get('/payout-history', CreatorController.getPayoutHistory);
router.get('/payout-requests', CreatorController.getPayoutHistory);
router.post('/payout-requests', validateBody(PayoutRequestSchema), CreatorController.requestPayout);

export default router;
