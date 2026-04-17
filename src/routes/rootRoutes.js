import { Router } from 'express';

import { getRoot, testDatabase } from '../controllers/rootController.js';

const rootRouter = Router();

rootRouter.get('/api', getRoot);
rootRouter.get('/api/test-db', testDatabase);

export { rootRouter };
