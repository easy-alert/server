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
  const { login, password } = req.body;

  validator.notNull([
    { label: 'login', variable: login },
    { label: 'senha', variable: password },
  ]);

  const user = await authServices.canLogin({ login, password });

  if (user.Companies.length > 1) {
    return res.status(200).json({
      userId: user.id,
      Companies: user.Companies.map((company) => ({
        id: company.Company.id,
        name: company.Company.name,
        image: company.Company.image,
      })),
    });
  }

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
      companyId: user.Companies[0].Company.id,
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
        emailIsConfirmed: user.emailIsConfirmed,
        phoneNumber: user.phoneNumber,
        phoneNumberIsConfirmed: user.phoneNumberIsConfirmed,
        role: user.role,
        image: user.image,
        colorScheme: user.colorScheme,

        isBlocked: user.isBlocked,
        isCompanyOwner,

        lastAccess: user.lastAccess,
        createdAt: user.createdAt,

        Permissions: user.Permissions,
        BuildingsPermissions: user.UserBuildingsPermissions,
      },
    },
  });
};
