import { Router } from 'express';

import { createUser, getUsers, deleteUser } from '../controllers/userController.js';

const userRouter = Router();

/**
 * @openapi
 * /api/user:
 *   get:
 *     tags:
 *       - User
 *     summary: 获取用户列表
 *     description: 查询用户表中所有未删除的用户记录。
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: 查询成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       '401':
 *         description: accessToken 无效或已过期
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get('/', getUsers);

/**
 * @openapi
 * /api/user:
 *   post:
 *     tags:
 *       - User
 *     summary: 旧创建用户接口
 *     description: 这个接口为了兼容性被保留，但当前会提示调用方改用 /api/auth/register。
 *     deprecated: true
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account:
 *                 type: string
 *                 example: zhangsan
 *     responses:
 *       '400':
 *         description: 当前接口不再用于真正创建用户
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: accessToken 无效或已过期
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.post('/', createUser);

/**
 * @openapi
 * /api/user/{account}:
 *   delete:
 *     tags:
 *       - User
 *     summary: 按账号删除用户
 *     description: 通过把 is_deleted 设置为 1 的方式逻辑删除用户。
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: account
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户账号
 *     responses:
 *       '200':
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteUserResponse'
 *       '401':
 *         description: accessToken 无效或已过期
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.delete('/:account', deleteUser);

export { userRouter };
