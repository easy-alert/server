import { Response, Request } from 'express';
import { checkValues } from '../../../../utils/newValidator';
import { TimeIntervalServices } from '../../timeInterval/services/timeIntervalServices';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';

interface IBody {
  buildingId: string;
  name: string;
  date: string;

  description: string | null;
  syndicId: string | null;
  frequency: string | null;
  frequencyTimeIntervalId: string | null;
}

const timeIntervalServices = new TimeIntervalServices();
const buildingServices = new BuildingServices();
const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

export async function createChecklistController(req: Request, res: Response) {
  const {
    buildingId,
    date,
    description,
    frequency,
    frequencyTimeIntervalId,
    name,
    syndicId,
  }: IBody = req.body;

  checkValues([
    { label: 'aa', type: 'string', value: buildingId },
    { label: 'aa', type: 'date', value: date },
    { label: 'aa', type: 'string', value: name },
    { label: 'aa', type: 'string', value: description, required: false },
    { label: 'aa', type: 'string', value: syndicId, required: false },
    { label: 'aa', type: 'string', value: frequency, required: false },
    { label: 'aa', type: 'string', value: frequencyTimeIntervalId, required: false },
  ]);

  await buildingServices.findById({ buildingId });

  if (syndicId) {
    await buildingNotificationConfigurationServices.findById({
      buildingNotificationConfigurationId: syndicId,
    });
  }

  if (frequency && frequencyTimeIntervalId) {
    const frequencyData = await timeIntervalServices.findById({
      timeIntervalId: frequencyTimeIntervalId,
    });
    // validar time interval id
  }

  return res.status(200).json({ message: 'Checklist cadastrado com sucesso.' });
}
