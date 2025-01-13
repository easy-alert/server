import { NextFunction, Request, Response } from 'express';

import { ServerMessage } from '../../utils/messages/serverMessage';

import type { TPermissionsNames } from '../../types/TPermissionsNames';

export function permCheck(permissionsToCheck: TPermissionsNames[]) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const hasPermission = req.Permissions.some(({ Permission }) =>
      permissionsToCheck.includes(Permission.name as TPermissionsNames),
    );

    if (!hasPermission) {
      throw new ServerMessage({
        statusCode: 403,
        message: `O usuário não tem permissão para acessar este recurso.`,
      });
    }

    next();
  };
}
