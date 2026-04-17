import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

/**
 * 生成 JWT。
 * 当前项目默认用于 accessToken 签发。
 *
 * @param {object} payload 要写入 token 的载荷
 * @returns {string} JWT 字符串
 */
const generateToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

/**
 * 语义化的 accessToken 生成函数。
 * 目前内部直接复用 `generateToken`，后续如果要区分 refreshToken，
 * 可以只改这里而不影响控制器调用方。
 *
 * @param {object} payload accessToken 载荷
 * @returns {string} JWT accessToken
 */
const generateAccessToken = (payload) => {
  return generateToken(payload);
};

/**
 * 校验 JWT 是否有效。
 *
 * @param {string} token JWT 字符串
 * @returns {object} 解码后的 token 载荷
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

/**
 * 从请求头中提取 Bearer Token。
 * 只接受标准格式：`Authorization: Bearer <token>`
 *
 * @param {import('express').Request} req 请求对象
 * @returns {string|null} 提取成功返回 token，失败返回 null
 */
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export { generateToken, generateAccessToken, verifyToken, getTokenFromHeader };
