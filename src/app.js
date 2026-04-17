import express from 'express';
import cors from 'cors';

import { corsOptions } from './config/cors.js';
import { swaggerSpec, swaggerUi, swaggerUiOptions } from './config/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { protect } from './middleware/auth.js';
import { rootRouter } from './routes/rootRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { authRouter } from './routes/authRoutes.js';

const app = express();

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', rootRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', protect, userRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get('/api-docs.json', (req, res) => {
  res.status(200).json(swaggerSpec);
});

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
