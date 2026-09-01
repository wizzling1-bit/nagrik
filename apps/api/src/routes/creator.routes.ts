import { Router } from 'express';
import { CreatorController } from '../controllers/creator.controller';
import { requireAuth, requireRole } from '../middlewares/rbac';
import { validateBody } from '../middlewares/validate';
import { PayoutRequestSchema, UserRole } from '@naagrik/shared-types';

const router = Router();

router.use(requireAuth, requireRole(UserRole.CREATOR));

router.get('/dashboard', CreatorController.getDashboard);
router.get('/content', CreatorController.getMyContent);
router.get('/analytics', CreatorController.getAnalytics);
router.get('/payout-methods', CreatorController.getPayoutMethods);
router.post('/payout-methods', CreatorController.addPayoutMethod);
router.post('/request-payout', validateBody(PayoutRequestSchema), CreatorController.requestPayout);
router.get('/payout-history', CreatorController.getPayoutHistory);

export default router;
