// TYPES
import { Request, Response } from 'express';

// SERVICES
import { userServices } from '../services/userServices';

import { checkValues } from '../../../../../utils/newValidator/checkValues';

export async function changeIsBlockedUser(req: Request, res: Response) {
  const { userId } = req.body;

  checkValues([{ label: 'ID do usuário', type: 'string', value: userId }]);

  const updatedUser = await userServices.changeIsBlocked({ userId });
  return res.status(200).json({
    user: updatedUser,
    ServerMessage: {
      statusCode: 200,
      message: 'Status alterado com sucesso.',
    },
  });
}
