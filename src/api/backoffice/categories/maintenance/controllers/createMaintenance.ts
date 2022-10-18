import { Request, Response } from 'express';
import { sharedCreateMaintenance } from '../../../../shared/categories/maintenace/controllers/sharedCreateMaintenance';

export async function createMaintenance(req: Request, res: Response) {
  const maintenance = await sharedCreateMaintenance({
    ownerCompanyId: null,
    body: req.body,
  });

  return res.status(200).json({
    maintenance,
    ServerMessage: {
      statusCode: 201,
      message: 'Manutenção cadastrada com sucesso.',
    },
  });
}
