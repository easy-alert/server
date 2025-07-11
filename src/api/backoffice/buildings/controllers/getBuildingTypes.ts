import { Request, Response } from 'express';
import { listBuildingTypes } from '../services/listBuildingTypes';

export async function getBuildingTypes(_req: Request, res: Response) {
  try {
    const buildingTypes = await listBuildingTypes();
    return res.status(200).json(buildingTypes);
  } catch (error: any) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: error.message || 'Erro ao buscar tipos de edificação.',
      },
    });
  }
}
