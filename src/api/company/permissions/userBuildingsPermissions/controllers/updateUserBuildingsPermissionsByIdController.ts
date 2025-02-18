import { Request, Response } from 'express';

import { updateUserBuildingsPermissionsById } from '../../../../shared/permissions/userBuildingsPermissions/services/updateUserBuildingsPermissionsById';
import { updateUserBuildingsById } from '../../../../shared/permissions/userBuildingsPermissions/services/updateUserBuildingsById';
import { checkIsMainContact } from '../../../../shared/permissions/userBuildingsPermissions/services/checkIsMainContact';

export async function updateUserBuildingsPermissionsByIdController(req: Request, res: Response) {
  const { userId, buildingId } = req.params;
  const { userBuildingsPermissions, isMainContact, showContact } = req.body;

  if (userBuildingsPermissions) {
    await updateUserBuildingsPermissionsById({ userId, userBuildingsPermissions });

    return res.status(200).json({
      ServerMessage: {
        statusCode: 200,
        message: 'Permissões de prédios do usuário atualizadas com sucesso.',
      },
    });
  }

  if (isMainContact) {
    await checkIsMainContact({ buildingId });
  }

  await updateUserBuildingsById({ userId, buildingId, isMainContact, showContact });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Usuário responsável atualizado com sucesso',
    },
  });
}
