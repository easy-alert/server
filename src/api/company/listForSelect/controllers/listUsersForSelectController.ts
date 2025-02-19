import { Request, Response } from 'express';

import { listUsersForSelect } from '../../../shared/listForSelect/services/listUsersForSelect';

export async function listUsersForSelectController(req: Request, res: Response) {
  const { buildingId } = req.query as { buildingId?: string };
  const companyId = req.Company.id;

  const users = await listUsersForSelect({ companyId, buildingId });

  res.status(200).json({ users });
}
