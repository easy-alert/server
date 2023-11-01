import { Response, Request } from 'express';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';

const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

// interface IUniqueContactData {
//   name: string;
//   email: string;
//   string: string;
//   role: string;
// }

export async function findDataForAutocompleteInCreate(req: Request, res: Response) {
  const { buildingId } = req.params;

  const data = await sharedBuildingNotificationConfigurationServices.findByCompanyId({
    companyId: req.Company.id,
    buildingId,
  });

  return res.status(200).json(data.map((e, i) => ({ ...e, customId: String(i + 1) })));
}
