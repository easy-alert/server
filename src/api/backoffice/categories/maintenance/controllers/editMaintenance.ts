import { Request, Response } from 'express';
import { sharedEditMaintenance } from '../../../../shared/maintenance/controllers/sharedEditMaintenance';

export async function editMaintenance(req: Request, res: Response) {
  const maintenance = await sharedEditMaintenance({
    ownerCompanyId: null,
    body: req.body,
  });
  return res.status(200).json({
    maintenance,
    ServerMessage: {
      statusCode: 200,
      message: 'Manutenção atualizada com sucesso.',
    },
  });
}
