// TYPES
import { Response, Request } from 'express';

// CLASS
import { AuthServices } from '../../../shared/auth/services/authServices';
import { HandlerToken } from '../../../../utils/token/handlerToken';
import { Validator } from '../../../../utils/validator/validator';
import { UserServices } from '../../../shared/user/services/userServices';

import { PermissionServices } from '../../../shared/permission/services/permissionServices';

const permissionServices = new PermissionServices();
const authServices = new AuthServices();
const handlerToken = new HandlerToken();
const userServices = new UserServices();

const validator = new Validator();

export const authCompany = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  validator.notNull([
    { label: 'email', variable: email },
    { label: 'senha', variable: password },
  ]);

  const user = await authServices.findByEmail({ email });

  await authServices.canLogin({ user, password });

  await permissionServices.checkPermission({
    UserPermissions: user.UserPermissions,
    permission: 'Company',
  });

  await userServices.updateLastAccess({ userId: user.id! });

  const token = handlerToken.generateToken({
    tokenData: {
      userId: user.id,
      Permissions: user.UserPermissions,
      Company: user.UserCompanies[0].Company,
    },
  });

  return res.status(200).json({
    User: {
      id: user.id,
      image: user.image,
      name: user.name,
      email: user.email,
      lastAcess: user.lastAccess,
      createdAt: user.createdAt,
      Permissions: user.UserPermissions,
    },
    Company: user.UserCompanies[0].Company,
    token,
  });
};
