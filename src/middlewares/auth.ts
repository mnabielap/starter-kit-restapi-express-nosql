import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { config } from '../config/config';
import { roleRights } from '../config/roles';
import { ApiError } from '../utils/ApiError';
import { User } from '../models';
import { tokenTypes } from '../config/tokens';

export const auth = (...requiredRights: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Bearer token not found');
    }
    
    const token = authHeader.substring(7);

    // 1. Verify signature and validity
    let payload: any;
    try {
      payload = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }

    if (!payload || payload.type !== tokenTypes.ACCESS) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }

    // 2. Check if user exists
    const user = await User.findById(payload.sub);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    // 3. Save user to request
    req.user = user;

    // 4. Check access rights
    if (requiredRights.length > 0) {
      const userRights = roleRights.get(user.role) || [];
      const hasRequiredRights = requiredRights.every((right) => userRights.includes(right));
      
      const { userId } = req.params;
      
      if (!hasRequiredRights) {
        if (userId !== user.id) {
           throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};