import { Router } from 'express';

import { getRoot, testDatabase } from '../controllers/rootController.js';

const rootRouter = Router();

/**
 * @openapi
 * /api:
 *   get:
 *     tags:
 *       - System
 *     summary: 服务存活文本接口
 *     description: 返回一个简单的纯文本内容，用于确认服务已经可访问。
 *     responses:
 *       '200':
 *         description: 纯文本成功响应
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello World!
 */
rootRouter.get('/api', getRoot);

/**
 * @openapi
 * /api/test-db:
 *   get:
 *     tags:
 *       - System
 *     summary: 测试数据库连接
 *     description: 执行一条简单 SQL，用于确认当前数据库连接是否可用。
 *     responses:
 *       '200':
 *         description: 数据库连接成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DatabaseTestResponse'
 *       '500':
 *         description: 数据库连接失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
rootRouter.get('/api/test-db', testDatabase);

export { rootRouter };
