// #region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { BuildingServices } from '../../building/services/buildingServices';
import { BuildingBannerServices } from '../services/buildingBannerServices';
import { IBuildingChangeBanner } from './types';

const validator = new Validator();
const buildingBannersServices = new BuildingBannerServices();
const buildingServices = new BuildingServices();
// #endregion

export async function buildingChangeBanner(req: Request, res: Response) {
  const { data }: IBuildingChangeBanner = req.body;

  // #region VALIDATIONS

  for (let i = 0; i < data.length; i++) {
    await buildingServices.findById({ buildingId: data[0].buildingId });

    validator.check([
      {
        label: 'nome do banner',
        type: 'string',
        variable: data[i].bannerName,
      },
      {
        label: 'arquivo',
        type: 'string',
        variable: data[i].originalName,
      },
      {
        label: 'tipo do banner',
        type: 'string',
        variable: data[i].type,
      },
      {
        label: 'url do banner',
        type: 'string',
        variable: data[i].url,
      },
      {
        label: 'url de redirecionamento do banner',
        type: 'string',
        variable: data[i].redirectUrl,
      },
    ]);
  }

  // #endregion

  await buildingBannersServices.changeBanners({ data });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message:
        data.length >= 1 ? `Banners cadastrados com sucesso` : `Banner cadastrado com sucesso.`,
    },
  });
}
