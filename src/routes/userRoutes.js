import { Router } from 'express';

import { createUser, getUsers, deleteUser } from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.delete('/:name', deleteUser);

export { userRouter };
