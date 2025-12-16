import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import httpStatus from 'http-status';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request against the schema
    const objectToValidate: Record<string, any> = {};

    if (req.body && Object.keys(req.body).length > 0) objectToValidate.body = req.body;
    if (req.query && Object.keys(req.query).length > 0) objectToValidate.query = req.query;
    if (req.params && Object.keys(req.params).length > 0) objectToValidate.params = req.params;

    // Parse and cast to 'any' to allow access to .body, .query, .params
    const validData = schema.parse(objectToValidate) as any;

    // Replace req values with validated ones
    if (validData.body) req.body = validData.body;
    
    if (validData.query) {
      Object.defineProperty(req, 'query', {
        value: validData.query,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
    
    if (validData.params) req.params = validData.params;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.issues
        .map((details) => `${details.path.join('.')}: ${details.message}`)
        .join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    next(error);
  }
};