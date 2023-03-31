// TYPES
import { Response, Request } from 'express';

// CLASS
import { AuthServices } from '../../../shared/auth/services/authServices';
import { TokenServices } from '../../../../utils/token/tokenServices';
import { Validator } from '../../../../utils/validator/validator';
import { UserServices } from '../../../shared/users/user/services/userServices';

import { PermissionServices } from '../../../shared/permission/services/permissionServices';

const permissionServices = new PermissionServices();
const authServices = new AuthServices();
const tokenServices = new TokenServices();
const userServices = new UserServices();

const validator = new Validator();

export const authBackoffice = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  validator.notNull([
    { label: 'email', variable: email },
    { label: 'senha', variable: password },
  ]);

  const user = await authServices.findByEmail({ email });

  await authServices.canLogin({ user, password });

  await permissionServices.checkPermission({
    UserPermissions: user.Permissions,
    permission: 'Backoffice',
  });

  await userServices.updateLastAccess({ userId: user.id! });

  const token = tokenServices.generate({
    tokenData: {
      userId: user.id!,
      Permissions: user.Permissions,
    },
  });

  return res.status(200).json({
    User: {
      id: user.id,
      image: user.image,
      name: user.name,
      email: user.email,
      lastAccess: user.lastAccess,
      createdAt: user.createdAt,
      Permissions: user.Permissions,
    },
    token,
  });
};
