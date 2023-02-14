import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { ClientBuildingServices } from '../services/clientBuildingServices';

const clientBuildingServices = new ClientBuildingServices();
const validator = new Validator();

export async function findClientInformations(req: Request, res: Response) {
  const { buildingId } = req.params;
  console.log(buildingId);

  console.log('ff');
  validator.check([{ label: 'id da edificaçao', type: 'string', variable: buildingId }]);

  const mainContact = await clientBuildingServices.findMainContactInformation({ buildingId });

  const formattedMainContact = {
    buldingName: mainContact?.name,
    annexes: mainContact?.Annexes,
    mainContact:
      mainContact?.NotificationsConfigurations.length === 1
        ? mainContact?.NotificationsConfigurations.shift()
        : null,
  };

  return res.status(200).json(formattedMainContact);
}
