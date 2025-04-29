import { Request, Response } from 'express';

import { dashboardServices } from '../services/dashboardServices';

export async function getBuildingsQuantityController(req: Request, res: Response) {
  const { status } = req.query;

  const buildingsCount = await dashboardServices.countBuildings({
    buildingStatus: status === undefined ? undefined : status === 'blocked',
  });

  return res.status(200).json({ buildingsCount });
}
