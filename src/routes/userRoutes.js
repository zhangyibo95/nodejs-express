import { Router } from 'express';

import { createUser, getUsers, deleteUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/api', getUsers);
userRouter.post('/api', createUser);
userRouter.delete('/api/:name', deleteUser);

export { userRouter };
