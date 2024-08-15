// TYPES
import { Response, Request } from 'express';

// CLASS
import { AuthServices } from '../../../shared/auth/services/authServices';
import { TokenServices } from '../../../../utils/token/tokenServices';
import { Validator } from '../../../../utils/validator/validator';

import { PermissionServices } from '../../../shared/permission/services/permissionServices';

const permissionServices = new PermissionServices();
const authServices = new AuthServices();
const tokenServices = new TokenServices();

const validator = new Validator();

export const authBackofficeCompany = async (req: Request, res: Response) => {
  const { userId, backofficeToken } = req.body;

  validator.notNull([
    { label: 'id do usuário', variable: userId },
    { label: 'token', variable: backofficeToken },
  ]);

  tokenServices.decode({ token: backofficeToken });

  const user = await authServices.findById({ userId });

  await permissionServices.checkPermission({
    UserPermissions: user.Permissions,
    permission: 'Company',
  });

  const token = tokenServices.generate({
    tokenData: {
      userId: user.id,
      Permissions: user.Permissions,
      Company: user.Companies[0].Company,
    },
  });

  return res.status(200).json({
    Account: {
      origin: 'Backoffice',
      User: {
        id: user.id,
        name: user.name,
        email: user.email,
        lastAccess: user.lastAccess,
        createdAt: user.createdAt,
        Permissions: user.Permissions,
      },
      Company: user.Companies[0].Company,
    },
    token,
  });
};
