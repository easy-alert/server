// # region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { BuildingServices } from '../services/buildingServices';

const buildingServices = new BuildingServices();
// #endregion

export async function findOldBuildingId(req: Request, res: Response) {
  const { oldBuildingId } = req.params;
  const { isSyndic } = req.query;

  const environment = process.env.CLIENT_URL;

  if (isSyndic) {
    const { buildingNanoId, syndicNanoId } = await buildingServices.findByOldIdForSyndic({
      oldBuildingId,
    });

    return res
      .status(200)
      .json({ url: `${environment}/${buildingNanoId}?syndicNanoId=${syndicNanoId}` });
  }

  const { buildingNanoId } = await buildingServices.findByOldId({ oldBuildingId });
  return res.status(200).json({ url: `${environment}/${buildingNanoId}` });
}
