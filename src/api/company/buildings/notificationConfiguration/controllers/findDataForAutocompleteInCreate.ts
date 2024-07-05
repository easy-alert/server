import { Response, Request } from 'express';
import { SharedBuildingNotificationConfigurationServices } from '../../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';
import { BuildingServices } from '../../building/services/buildingServices';

const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

const buildingServices = new BuildingServices();

interface IUniqueData {
  name: string;
  email: string | null;
  contactNumber: string | null;
  role: string;
}

interface IUniqueDataWithId extends IUniqueData {
  customId: string;
}

function removeDuplicates(data: IUniqueData[]): IUniqueData[] {
  const uniqueData = new Set<string>();
  return data.filter((item) => {
    const itemKey = `${item.name}-${item.email}-${item.contactNumber}-${item.role}`;
    if (uniqueData.has(itemKey)) {
      return false;
    }
    uniqueData.add(itemKey);
    return true;
  });
}
export async function findDataForAutocompleteInCreate(req: Request, res: Response) {
  const { buildingId } = req.params;

  const building = await buildingServices.findById({ buildingId });

  const data = await sharedBuildingNotificationConfigurationServices.findByCompanyId({
    companyId: building.companyId,
    buildingId,
  });

  const uniqueData = removeDuplicates(data);
  const uniqueDataWithId: IUniqueDataWithId[] = [];

  uniqueData.forEach((element, index) => {
    uniqueDataWithId.push({ ...element, customId: String(index) });
  });

  return res.status(200).json(uniqueDataWithId);
}
