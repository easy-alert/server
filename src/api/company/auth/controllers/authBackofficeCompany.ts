// TYPES
import { Response, Request } from 'express';

import { PermissionServices } from '../../../shared/permissions/permission/services/permissionServices';

// CLASS
import { AuthServices } from '../../../shared/auth/services/authServices';
import { TokenServices } from '../../../../utils/token/tokenServices';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

const permissionServices = new PermissionServices();
const authServices = new AuthServices();
const tokenServices = new TokenServices();
const validator = new Validator();

export const authBackofficeCompany = async (req: Request, res: Response) => {
  const { companyId, userId, backofficeToken } = req.body;

  validator.notNull([
    { label: 'id do usuário', variable: userId },
    { label: 'token', variable: backofficeToken },
  ]);

  tokenServices.decode({ token: backofficeToken });

  const user = await authServices.findById({ userId });
  const selectedCompany = user.Companies.find(
    (company) => company.Company.id === companyId,
  )?.Company;

  if (!selectedCompany) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Usuário não pertence a empresa informada.',
    });
  }

  await permissionServices.checkPermission({
    UserPermissions: user.Permissions,
    permissions: ['admin:company', 'access:company'],
  });

  const isCompanyOwner = await authServices.isCompanyOwner({
    userId,
    companyId: selectedCompany.id,
  });

  const token = tokenServices.generate({
    tokenData: {
      userId: user.id,
      companyId: selectedCompany.id,
    },
  });

  return res.status(200).json({
    token,

    Account: {
      origin: 'Backoffice',
      Company: selectedCompany,
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
