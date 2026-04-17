import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';

const generateToken = (payload) => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};

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

export { generateToken, verifyToken, getTokenFromHeader };
