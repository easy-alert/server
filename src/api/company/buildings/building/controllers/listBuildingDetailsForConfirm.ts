// # region IMPORTS
import { Request, Response } from 'express';
import { TokenServices } from '../../../../../utils/token/tokenServices';
import { ITokenWhatsAppConfirmation } from '../../../../../utils/token/types';
import { Validator } from '../../../../../utils/validator/validator';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';

// CLASS
import { BuildingServices } from '../services/buildingServices';

const buildingServices = new BuildingServices();
const validator = new Validator();
const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();
const tokenServices = new TokenServices();

// #endregion

export async function listBuildingDetailsForConfirm(req: Request, res: Response) {
  const { token } = req.body;

  // #region VALIDATIONS

  validator.check([
    {
      label: 'Token',
      type: 'string',
      variable: token,
    },
  ]);

  const foundToken = await tokenServices.find({
    token,
  });

  const { id: buildingNotificationConfigurationId } = tokenServices.decode({
    token: foundToken.token,
  }) as ITokenWhatsAppConfirmation;

  const buildingNotificationConfiguration =
    await buildingNotificationConfigurationServices.findById({
      buildingNotificationConfigurationId,
    });

  // #endregion

  const BuildingDetails = await buildingServices.listDetails({
    buildingId: buildingNotificationConfiguration!.buildingId,
  });

  return res.status(200).json({
    name: BuildingDetails.name,
    image: BuildingDetails.Company.image,
  });
}
