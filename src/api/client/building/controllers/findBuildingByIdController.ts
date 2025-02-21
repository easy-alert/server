import { Request, Response } from 'express';

import { findBuildingById } from '../services/findBuildingById';

export async function findBuildingByIdController(req: Request, res: Response) {
  const { buildingId } = req.params as { buildingId: string };

  if (!buildingId) {
    return res.status(400).json({ message: 'Id do prédio não informado' });
  }

  const building = await findBuildingById({ buildingId });

  return res.status(200).json({ building });
}
