// TYPES
import { Request, Response } from 'express';

// FUNCTIONS
import { sharedEditCompanyAndOwner } from '../../../../shared/users/accounts/controllers/editCompanyAndOwner';

export async function editCompanyAndOwner(req: Request, res: Response) {
  await sharedEditCompanyAndOwner({
    userId: req.body.userId,
    companyId: req.body.companyId,
    body: req.body,
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Informações atualizadas com sucesso.`,
    },
  });
}
