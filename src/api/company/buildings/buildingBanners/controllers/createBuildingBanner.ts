// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { BuildingServices } from '../../building/services/buildingServices';
import { BuildingBannerServices } from '../services/buildingBannerServices';
import { prismaTypes } from '../../../../../../prisma';

const buildingBannersServices = new BuildingBannerServices();
const buildingServices = new BuildingServices();
// #endregion

export async function createBuildingBanner(req: Request, res: Response) {
  const {
    buildingId,
    originalName,
    redirectUrl,
    url,
  }: prismaTypes.BuildingBannersUncheckedCreateInput = req.body;

  const building = req.body.buildingNanoId
    ? await buildingServices.findByNanoId({ buildingNanoId: req.body.buildingNanoId })
    : await buildingServices.findById({ buildingId });

  await buildingBannersServices.create({
    buildingId: building.id,
    originalName,
    redirectUrl: redirectUrl || null,
    url,
  });

  return res.status(201).json({
    ServerMessage: {
      statusCode: 201,
      message: 'Banner adicionado com sucesso.',
    },
  });
}
