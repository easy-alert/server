// TYPES
import { Response, Request } from 'express';

// CLASS
import { TokenServices } from '../../../../utils/token/tokenServices';
import { Validator } from '../../../../utils/validator/validator';
import { UserServices } from '../../../shared/users/user/services/userServices';

import { PermissionServices } from '../../../shared/permissions/permission/services/permissionServices';
import { AuthServices } from '../../../shared/auth/services/authServices';

const permissionServices = new PermissionServices();
const tokenServices = new TokenServices();
const userServices = new UserServices();
const authServices = new AuthServices();
const validator = new Validator();

export const authCompany = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  validator.notNull([
    { label: 'email', variable: email },
    { label: 'senha', variable: password },
  ]);

  const user = await authServices.canLogin({ email, password });

  await permissionServices.checkPermission({
    UserPermissions: user.Permissions,
    permissions: ['admin:company', 'access:company'],
  });

  await userServices.updateLastAccess({ userId: user.id! });

  const isCompanyOwner = await authServices.isCompanyOwner({
    userId: user.id,
    companyId: user.Companies[0].Company.id,
  });

  const token = tokenServices.generate({
    tokenData: {
      userId: user.id,
    },
  });

  return res.status(200).json({
    token,

    Account: {
      origin: 'Company',
      Company: user.Companies[0].Company,
      User: {
        id: user.id,
        name: user.name,
        email: user.email,
        // phoneNumber: user.phoneNumber,
        lastAccess: user.lastAccess,
        createdAt: user.createdAt,
        isCompanyOwner,
        Permissions: user.Permissions,
        BuildingsPermissions: user.UserBuildingsPermissions,
      },
    },
  });
};
