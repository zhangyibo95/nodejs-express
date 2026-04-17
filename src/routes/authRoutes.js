import { Router } from 'express';

import { getProfile, login, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const authRouter = Router();

authRouter.post('/api/login', login);
authRouter.post('/api/register', register);
authRouter.get('/api/me', protect, getProfile);

export { authRouter };
