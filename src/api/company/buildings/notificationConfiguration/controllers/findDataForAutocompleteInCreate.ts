import { Response, Request } from 'express';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';

const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

interface IUniqueData {
  customId: string;
  name: string;
  email: string;
  contactNumber: string;
  role: string;
}

export async function findDataForAutocompleteInCreate(req: Request, res: Response) {
  const { buildingId } = req.params;

  const data = await sharedBuildingNotificationConfigurationServices.findByCompanyId({
    companyId: req.Company.id,
    buildingId,
  });

  const uniqueData: IUniqueData[] = [];

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    const foundName = uniqueData.find((e) => e.name === element.name);
    const foundEmail = uniqueData.find((e) => e.email === element.email);
    const foundContactNumber = uniqueData.find((e) => e.contactNumber === element.contactNumber);
    const foundRole = uniqueData.find((e) => e.role === element.role);

    if (!foundName || !foundEmail || !foundContactNumber || !foundRole) {
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
