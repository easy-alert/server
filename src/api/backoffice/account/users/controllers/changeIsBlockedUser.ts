// TYPES
import { Request, Response } from 'express';

// SERVICES
import { userServices } from '../services/userServices';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export async function changeIsBlockedUser(req: Request, res: Response) {
  const { userId } = req.body;

  try {
    validator.check([{ label: 'ID do usuário', type: 'string', variable: userId }]);
  } catch (validationError: any) {
    return res.status(400).json({
      ServerMessage: {
        statusCode: 400,
        message: validationError.message || 'ID do usuário é obrigatório.',
      },
    });
  }

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
