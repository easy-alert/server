// LIBS
import 'dotenv/config';
import { verify } from 'jsonwebtoken';

import type { NextFunction, Request, Response } from 'express';

// CLASS
import { ServerMessage } from '../utils/messages/serverMessage';
import { UserServices } from '../api/shared/users/user/services/userServices';

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

  try {
    const [, token] = authorization.split(' ');
    const secret: any = process.env.JWT_SECRET;

    const decoded = verify(token, secret);
    const { userId } = decoded as IToken;

    const user = await userServices.findById({ userId });

    req.userId = user.id;
    req.Company =
      user.Companies.length > 0 ? user.Companies[0].Company : ({} as Request['Company']);
    req.Permissions = user.Permissions;
    req.BuildingsPermissions = user.UserBuildingsPermissions;

    next();
  } catch (error) {
    throw new ServerMessage({
      statusCode: 401,
      message: 'Você precisa de um token válido.',
    });
  }
};
