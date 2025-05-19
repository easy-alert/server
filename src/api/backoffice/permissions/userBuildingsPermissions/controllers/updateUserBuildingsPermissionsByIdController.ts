import { Request, Response } from 'express';

import { updateUserBuildingsPermissionsById } from '../../../../shared/permissions/userBuildingsPermissions/services/updateUserBuildingsPermissionsById';

export async function updateUserBuildingsPermissionsByIdController(req: Request, res: Response) {
  const { userId } = req.params;
  const { companyId, userBuildingsPermissions } = req.body;

  await updateUserBuildingsPermissionsById({ companyId, userId, userBuildingsPermissions });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Permissões de prédios do usuário atualizadas com sucesso.',
    },
  });
}
