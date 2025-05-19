import { Request, Response } from 'express';

import { updateUserPermissionsById } from '../../../../shared/permissions/userPermissions/services/updateUserPermissionsById';

export async function updateUserPermissionsByIdController(req: Request, res: Response) {
  const { userId } = req.params;
  const { companyId, userPermissions } = req.body;

  await updateUserPermissionsById({ companyId, userId, userPermissions });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Permissões do usuário atualizadas com sucesso.',
    },
  });
}
