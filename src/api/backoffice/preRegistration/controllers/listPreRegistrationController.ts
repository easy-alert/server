import { Request, Response } from 'express';
import { listPreRegistrationServices } from '../services/listPreRegistrationService';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();
export async function listPreRegistrations(_req: Request, res: Response) {
  try {
    validator.check([]);

    const preRegistrations = await listPreRegistrationServices();

    return res.status(200).json({
      preRegistrations,
      ServerMessage: {
        statusCode: 200,
        message: 'Links de pré-cadastro listados com sucesso.',
      },
    });
  } catch (error) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: 'Erro ao buscar os links de pré-cadastro.',
      },
    });
  }
}
