import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/rbac';
import { RegisterSchema, LoginSchema } from '@naagrik/shared-types';

const router = Router();

// Creator / Admin Authentication
router.post('/register', validate(RegisterSchema), AuthController.register);
router.post('/login', validate(LoginSchema), AuthController.login);
router.get('/me', requireAuth, AuthController.getMe);

export default router;
