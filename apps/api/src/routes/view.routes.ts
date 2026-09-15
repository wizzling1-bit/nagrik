import { Router } from 'express';
import { ViewController } from '../controllers/view.controller';
import { optionalAuth } from '../middlewares/rbac';

const router = Router();

// Credential-Free or Authenticated Video View Tracking
router.post('/', optionalAuth, ViewController.registerView);

export default router;
