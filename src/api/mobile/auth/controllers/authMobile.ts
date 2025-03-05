import { Request, Response } from 'express';

import { TokenServices } from '../../../../utils/token/tokenServices';
import { AuthServices } from '../services/authServices';
import { PermissionServices } from '../../../shared/permissions/permission/services/permissionServices';

import { needExist } from '../../../../utils/newValidator';

// Instância do serviço
const authServices = new AuthServices();
const permissionServices = new PermissionServices();
const tokenServices = new TokenServices();

export async function authMobile(req: Request, res: Response) {
  try {
    // Obtém o phoneNumber da query string
    const { login, password } = req.body;

    needExist([
      { label: 'Login', variable: login },
      { label: 'Senha', variable: password },
    ]);

    const user = await authServices.canLogin({ login, password });

    await permissionServices.checkPermission({
      UserPermissions: user.Permissions,
      permissions: ['admin:company', 'access:company'],
    });

    const isCompanyOwner = await authServices.isCompanyOwner({
      userId: user.id,
      companyId: user.Companies[0].Company.id,
    });

    const authToken = tokenServices.generate({
      tokenData: {
        userId: user.id,
      },
    });

    return res.status(200).json({ authToken, user: { isCompanyOwner, ...user } });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar os prédios do responsável' });
  }
}
