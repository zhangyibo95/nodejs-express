import { Router } from 'express';

import { getProfile, login, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/me', protect, getProfile);

export { authRouter };
