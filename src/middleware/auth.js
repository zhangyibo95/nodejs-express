import { AppError } from '../utils/appError.js';
import { getTokenFromHeader, verifyToken } from '../utils/jwt.js';

const protect = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      throw new AppError('请先登录', 401);
    }

    req.user = verifyToken(token);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('令牌无效或已过期', 401));
    }

    next(error);
  }
};

export { protect };
