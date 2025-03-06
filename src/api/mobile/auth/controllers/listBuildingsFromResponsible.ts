import { Request, Response } from 'express';

import { AuthMobile } from '../services/authMobile';
import { PermissionServices } from '../../../shared/permissions/permission/services/permissionServices';

import { needExist } from '../../../../utils/newValidator';

// Instância do serviço
const authMobile = new AuthMobile();
const permissionServices = new PermissionServices();

export async function listBuildingsFromResponsible(req: Request, res: Response) {
  try {
    // Obtém o phoneNumber da query string
    const { login, password } = req.body;

    needExist([
      { label: 'Login', variable: login },
      { label: 'Senha', variable: password },
    ]);

    const user = await authMobile.canLogin({ login, password });

    await permissionServices.checkPermission({
      UserPermissions: user.Permissions,
      permissions: ['admin:company', 'access:company'],
    });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar os prédios do responsável' });
  }
}
