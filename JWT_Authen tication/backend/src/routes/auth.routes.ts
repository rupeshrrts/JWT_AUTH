import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticateJWT, authController.me);

export default router;
