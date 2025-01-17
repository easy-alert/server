import { NextFunction, Request, Response } from 'express';

import { ServerMessage } from '../../utils/messages/serverMessage';

import type { TPermissionsNames } from '../../types/TPermissionsNames';

interface IPermCheck {
  origin: 'backoffice' | 'company' | 'client';
  permsToCheck: TPermissionsNames[];
}

export function permCheck({ origin, permsToCheck }: IPermCheck) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    let hasAdminPerm = false;

    switch (origin) {
      case 'company':
        hasAdminPerm = req.Permissions.some(
          ({ Permission }) => Permission.name === 'admin:company',
        );
        break;
      case 'backoffice':
        hasAdminPerm = req.Permissions.some(
          ({ Permission }) => Permission.name === 'admin:backoffice',
        );
        break;
      case 'client':
        hasAdminPerm = req.Permissions.some(({ Permission }) => Permission.name === 'admin:client');
        break;
      default:
        break;
    }

    if (hasAdminPerm) {
      next();
      return;
    }

    const hasPermission = req.Permissions.some(({ Permission }) =>
      permsToCheck?.includes(Permission.name as TPermissionsNames),
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

export const handleBackofficePermCheck = (permsToCheck: TPermissionsNames[]) =>
  permCheck({ origin: 'backoffice', permsToCheck });

export const handleCompanyPermCheck = (permsToCheck: TPermissionsNames[]) =>
  permCheck({ origin: 'company', permsToCheck });

export const handleClientPermCheck = (permsToCheck: TPermissionsNames[]) =>
  permCheck({ origin: 'client', permsToCheck });
