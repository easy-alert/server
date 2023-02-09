import { Request, Response } from 'express';
import { sharedDeleteMaintenance } from '../../../../shared/maintenance/controllers/sharedDeleteMaintenance';

export async function deleteMaintenance(req: Request, res: Response) {
  await sharedDeleteMaintenance({
    ownerCompanyId: req.Company.id,
    body: req.body,
  });
  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Manutenção excluída com sucesso.',
    },
  });
}
