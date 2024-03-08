import { Response, Request } from 'express';
import { checkMinimumNumber, checkValues } from '../../../../utils/newValidator';
import { TimeIntervalServices } from '../../timeInterval/services/timeIntervalServices';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { checklistServices } from '../services/checklistServices';
import { setToUTCMidnight } from '../../../../utils/dateTime';

interface IBody {
  buildingId: string;
  name: string;
  date: string;
  syndicId: string;

  description: string | null;
  frequency: number | null;
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
    { label: 'ID da edificação', type: 'string', value: buildingId },
    { label: 'Data', type: 'date', value: date },
    { label: 'Nome', type: 'string', value: name },
    { label: 'ID do síndico', type: 'string', value: syndicId },

    { label: 'Descrição', type: 'string', value: description, required: false },
    { label: 'Frequência', type: 'int', value: frequency, required: false },
    {
      label: 'Intervalo da frequência',
      type: 'string',
      value: frequencyTimeIntervalId,
      required: false,
    },
  ]);

  if (frequency) {
    checkMinimumNumber([{ label: 'Frequência', min: 1, value: frequency }]);
  }

  await buildingServices.findById({ buildingId });

  await buildingNotificationConfigurationServices.findById({
    buildingNotificationConfigurationId: syndicId,
  });

  let frequencyInDays = 0;

  if (frequency && frequencyTimeIntervalId) {
    const frequencyData = await timeIntervalServices.findById({
      timeIntervalId: frequencyTimeIntervalId,
    });
    frequencyInDays = frequencyData.unitTime * frequency;
    console.log('frequencyInDays:', frequencyInDays);
  }

  const parentChecklist = await checklistServices.create({
    data: {
      buildingId,
      date: setToUTCMidnight(new Date(date)),
      name,
      description,
      syndicId,
      frequency,
      frequencyTimeIntervalId,
      status: 'pending',
    },
  });
  console.log('parentChecklist:', parentChecklist);

  return res.status(201).json({ ServerMessage: { message: 'Checklist cadastrado com sucesso.' } });
}
