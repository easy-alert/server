import { Response, Request } from 'express';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';
import { BuildingServices } from '../../building/services/buildingServices';

const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

const buildingServices = new BuildingServices();

interface IUniqueData {
  customId: string;
  name: string;
  email: string;
  contactNumber: string;
  role: string;
}

export async function findDataForAutocompleteInCreate(req: Request, res: Response) {
  const { buildingId } = req.params;

  const building = await buildingServices.findById({ buildingId });

  const data = await sharedBuildingNotificationConfigurationServices.findByCompanyId({
    companyId: building.companyId,
    buildingId,
  });

  const uniqueData: IUniqueData[] = [];

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    const foundData = uniqueData.find(
      (e) =>
        e.name === element.name &&
        e.email === element.email &&
        e.contactNumber === element.contactNumber &&
        e.role === element.role,
    );

    if (!foundData) {
      uniqueData.push({
        customId: String(i),
        name: element.name,
        email: element.email || '',
        contactNumber: element.contactNumber || '',
        role: element.role,
      });
    }
  }

  return res.status(200).json(uniqueData);
}
