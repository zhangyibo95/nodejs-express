import { AppError } from '../utils/appError.js';
import { getTokenFromHeader, verifyToken } from '../utils/jwt.js';

/**
 * JWT 鉴权中间件。
 * 作用：
 * 1. 从请求头里提取 Bearer Token
 * 2. 校验 token 是否合法
 * 3. 把解码后的用户信息挂到 `req.user` 上
 *
 * @param {import('express').Request} req 请求对象
 * @param {import('express').Response} res 响应对象
 * @param {import('express').NextFunction} next Express next
 */
const protect = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      throw new AppError('login required', 401);
    }

    req.user = verifyToken(token);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('access token invalid or expired', 401));
    }

    next(error);
  }
};

export { protect };
