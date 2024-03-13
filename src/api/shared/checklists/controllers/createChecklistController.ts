import { Response, Request } from 'express';
import {
  checkMaximumNumber,
  checkMinimumNumber,
  checkValues,
} from '../../../../utils/newValidator';
import { TimeIntervalServices } from '../../timeInterval/services/timeIntervalServices';
import { BuildingServices } from '../../../company/buildings/building/services/buildingServices';
import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { checklistServices } from '../services/checklistServices';
import { addDays, setToUTCMidnight } from '../../../../utils/dateTime';
import { prismaTypes } from '../../../../../prisma';

interface IBody {
  buildingNanoId: string;
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
    buildingNanoId,
    date,
    description,
    frequency,
    frequencyTimeIntervalId,
    name,
    syndicId,
  }: IBody = req.body;

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingNanoId },
    { label: 'Data', type: 'date', value: date },
    { label: 'Nome', type: 'string', value: name },
    { label: 'ID do síndico', type: 'string', value: syndicId },

    { label: 'Descrição', type: 'string', value: description, required: false },
    { label: 'Frequência', type: 'int', value: frequency || null, required: false },
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

  const { id } = await buildingServices.findByNanoId({ buildingNanoId });

  await buildingNotificationConfigurationServices.findById({
    buildingNotificationConfigurationId: syndicId,
  });

  let frequencyInDays = 0;

  if (frequency && frequencyTimeIntervalId) {
    const frequencyData = await timeIntervalServices.findById({
      timeIntervalId: frequencyTimeIntervalId,
    });
    frequencyInDays = frequencyData.unitTime * frequency;

    checkMaximumNumber([{ label: 'Periodicidade em dias', max: 35000, value: frequencyInDays }]);
  }

  const parentChecklist = await checklistServices.create({
    data: {
      buildingId: id,
      date: setToUTCMidnight(new Date(date)),
      name,
      description,
      syndicId,
      frequency: frequency || null,
      frequencyTimeIntervalId: frequency ? frequencyTimeIntervalId : null,
      status: 'pending',
    },
  });

  if (frequencyInDays) {
    // criando 3 anos de registros proporcional a data
    const frequenciesToCreate = Math.ceil((365 / frequencyInDays) * 3);

    const childrenChecklists: prismaTypes.ChecklistCreateManyInput[] = [];

    for (let index = 0; index < frequenciesToCreate; index++) {
      childrenChecklists.push({
        groupId: parentChecklist.groupId,
        buildingId: parentChecklist.buildingId,
        name: parentChecklist.name,
        description: parentChecklist.description,
        syndicId: parentChecklist.syndicId,
        frequency: parentChecklist.frequency,
        frequencyTimeIntervalId: parentChecklist.frequencyTimeIntervalId,
        status: 'pending',
        date: addDays({
          date: parentChecklist.date,
          days: frequencyInDays * index + frequencyInDays,
        }),
      });
    }

    await checklistServices.createMany({ data: childrenChecklists });
  }

  return res.status(201).json({ ServerMessage: { message: 'Checklist cadastrado com sucesso.' } });
}
