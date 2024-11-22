import { Response, Request } from 'express';

import { findManyMaintenancePriority } from '../services/findManyMaintenancePriority';

export async function findAllMaintenancePriority(_req: Request, res: Response) {
  const { maintenancePriority } = await findManyMaintenancePriority();

  return res.status(200).json({ maintenancePriorities: maintenancePriority });
}
