// TYPES
import { Request, Response } from 'express';

// FUNCTIONS
import { sharedEditCompanyAndOwner } from '../../../shared/users/accounts/controllers/editCompanyAndOwner';

export async function editCompanyAndOwner(req: Request, res: Response) {
  // Se o company souber que existem os booleanos ali de controle de acesso, ele consegue editar por API, porque é tudo junto
  await sharedEditCompanyAndOwner({
    userId: req.userId,
    companyId: req.Company.id,
    body: req.body,
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Informações atualizadas com sucesso.`,
    },
  });
}
