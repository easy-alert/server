import { Request, Response } from 'express';

import { getUserBuildingsById } from '../../../../shared/permissions/userBuildingsPermissions/services/getUserBuildingsById';

export async function getUserBuildingsByIdController(req: Request, res: Response) {
  const { buildingId } = req.params;

  const userBuildings = await getUserBuildingsById({ buildingId });

  return res.status(200).json({ userBuildings });
}
