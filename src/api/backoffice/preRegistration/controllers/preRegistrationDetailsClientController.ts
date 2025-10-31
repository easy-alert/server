import { Request, Response } from 'express';
import { preRegistrationDetailsClientService } from '../services/preRegistrationDetailsClientService';
import { checkValues } from '../../../../utils/newValidator';

export async function preRegistrationDetailsClient(req: Request, res: Response) {
  const { token } = req.params;

  checkValues([{ label: 'Token', type: 'string', value: token }]);

  try {
    const details = await preRegistrationDetailsClientService(token);

    if (!details) {
      return res.status(404).json({
        ServerMessage: {
          statusCode: 404,
          message: 'Link de pré-cadastro não encontrado, expirado ou já utilizado.',
        },
      });
    }

    return res.status(200).json(details);
  } catch (error) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: 'Erro ao buscar detalhes do pré-cadastro.',
      },
    });
  }
}
