// LIBS
import 'dotenv/config';
import { verify } from 'jsonwebtoken';

import { NextFunction, Response, Request } from 'express';

import { prisma } from '../../prisma';

// TYPES
import type { IToken } from './types';

// eslint-disable-next-line consistent-return
export const logCatcherMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    const { body, method, params, query, originalUrl } = req;

    let userId;

    if (authorization && authorization.includes('Bearer') && !authorization.includes('null')) {
      const [, token] = authorization.split(' ');

      const secret: any = process.env.JWT_SECRET;

      const decoded = verify(token, secret);

      userId = (decoded as IToken)?.userId;
    }

    if (!['POST', 'PUT', 'DELETE'].includes(method)) return next();

    await prisma.apiLogs.create({
      data: {
        method,
        path: originalUrl,
        body: JSON.stringify(body),
        query: JSON.stringify(query),
        params: JSON.stringify(params),
        userId,
      },
    });

    return next();
  } catch (error) {
    next(error);
  }
};
