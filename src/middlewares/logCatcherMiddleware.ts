import { NextFunction, Response, Request } from 'express';

import { prisma } from '../../prisma';

// eslint-disable-next-line consistent-return
export const logCatcherMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const { body, method, params, query, originalUrl } = req;

    if (!['POST', 'PUT', 'DELETE'].includes(method)) return next();

    await prisma.apiLogs.create({
      data: {
        method,
        path: originalUrl,
        body: JSON.stringify(body),
        query: JSON.stringify(query),
        params: JSON.stringify(params),
      },
    });

    return next();
  } catch (error) {
    next(error);
  }
};

