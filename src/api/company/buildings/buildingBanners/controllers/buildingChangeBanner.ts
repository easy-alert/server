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

  await buildingServices.findById({ buildingId: data[0].buildingId });

  data.forEach((banner) => {
    validator.check([
      {
        label: 'nome do banner',
        type: 'string',
        variable: banner.bannerName,
      },
      {
        label: 'nome do arquivo',
        type: 'string',
        variable: banner.originalName,
      },
      {
        label: 'tipo do banner',
        type: 'string',
        variable: banner.type,
      },
      {
        label: 'url do banner',
        type: 'string',
        variable: banner.url,
      },
      {
        label: 'url de redirecionamento do banner',
        type: 'string',
        variable: banner.redirectUrl,
      },
    ]);
  });

  // #endregion

  await buildingBannersServices.changeBanners({ data });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: `Edificação cadastrada com sucesso.`,
    },
  });
}
