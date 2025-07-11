// TYPES
import { Request, Response } from 'express';

// SERVICES
import { userServices } from '../services/userServices';

import { checkValues } from '../../../../../utils/newValidator/checkValues';

export async function changeIsBlockedUser(req: Request, res: Response) {
  const { userId } = req.body;

  checkValues([{ label: 'ID do usuário', type: 'string', value: userId }]);

  try {
    await userServices.changeIsBlocked({ userId });
    return res.status(200).json({
      ServerMessage: {
        statusCode: 200,
        message: 'Status alterado com sucesso.',
      },
    });
  } catch (error) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: 'Erro ao alterar status.',
      },
    });
  }
}
