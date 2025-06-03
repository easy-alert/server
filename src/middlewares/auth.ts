// LIBS
import 'dotenv/config';
import { verify } from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';

// CLASS
import { ServerMessage } from '../utils/messages/serverMessage';
import { UserServices } from '../api/shared/users/user/services/userServices';
import { upsertApiLogs } from '../api/shared/apiLog/services/upsertApiLogs';

// TYPES
import type { IToken } from './types';

const userServices = new UserServices();

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new ServerMessage({
      statusCode: 401,
      message: 'Você precisa de um token válido.',
    });
  }

  const { body, method, params, query, originalUrl } = req;

  const isAllowedMethod = ['POST', 'PUT', 'DELETE'].includes(method);

  try {
    const [, token] = authorization.split(' ');
    const secret: any = process.env.JWT_SECRET;

    const decoded = verify(token, secret);
    const { companyId, userId } = decoded as IToken;

    const user = await userServices.findById({ userId });

    const selectedCompany = user?.Companies?.find(
      (company) => company?.Company?.id === companyId,
    )?.Company;

    req.userId = user.id;
    req.companyId = companyId;
    req.Company = selectedCompany || user?.Companies[0]?.Company || null;
    req.Permissions = user.Permissions;
    req.BuildingsPermissions = user.UserBuildingsPermissions;

    if (isAllowedMethod) {
      upsertApiLogs({
        companyId,
        userId: user.id,
        apiLogId: req.apiLogId,
        body,
        method,
        params,
        query,
        originalUrl,
      });
    }

    next();
  } catch (error) {
    throw new ServerMessage({
      statusCode: 401,
      message: 'Você precisa de um token válido.',
    });
  }
};
