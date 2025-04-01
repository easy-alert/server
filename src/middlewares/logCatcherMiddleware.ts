// LIBS
import 'dotenv/config';
// import { verify } from 'jsonwebtoken';

import { NextFunction, Response, Request } from 'express';

import { createApiLogs } from '../api/shared/apiLog/services/createApiLogs';

// TYPES
// import type { IToken } from './types';

// eslint-disable-next-line consistent-return
export const logCatcherMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { body, method, params, query, originalUrl } = req;

    if (!['POST', 'PUT', 'DELETE'].includes(method)) return next();

    const apiLog = await createApiLogs({
      body,
      method,
      params,
      query,
      originalUrl,
    });

    req.apiLogId = apiLog.id;

    return next();
  } catch (error) {
    next(error);
  }
};
