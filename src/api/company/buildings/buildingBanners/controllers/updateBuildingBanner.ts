// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { BuildingBannerServices } from '../services/buildingBannerServices';
import { prismaTypes } from '../../../../../../prisma';

const buildingBannersServices = new BuildingBannerServices();
// #endregion

export async function updateBuildingBanner(req: Request, res: Response) {
  const { originalName, redirectUrl, url, id }: prismaTypes.BuildingBannersUpdateInput = req.body;

  await buildingBannersServices.update({
    data: {
      originalName,
      redirectUrl: redirectUrl || null,
      url,
    },
    where: { id: String(id) },
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Banner atualizado com sucesso.',
    },
  });
}
