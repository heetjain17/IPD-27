import { Router } from 'express';
import * as authController from './controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from './schema.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.me);
router.post('/refresh', authController.refresh);

export default router;
