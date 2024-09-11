// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { BuildingBannerServices } from '../services/buildingBannerServices';

const buildingBannersServices = new BuildingBannerServices();
// #endregion

export async function deleteBuildingBanner(req: Request, res: Response) {
  const { bannerId } = req.params as any as { bannerId: string };

  await buildingBannersServices.delete(bannerId);

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Banner excluído com sucesso.',
    },
  });
}
