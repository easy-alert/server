import { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  checkMaximumNumber,
  checkMinimumNumber,
  checkValues,
} from '../../../../utils/newValidator';
import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { checklistServices } from '../services/checklistServices';
import { addDays, setToUTCMidnight } from '../../../../utils/dateTime';
import { TimeIntervalServices } from '../../timeInterval/services/timeIntervalServices';
import { prisma, prismaTypes } from '../../../../../prisma';

type TUpdateMode = 'this' | 'thisAndFollowing' | '';

interface IBody {
  id: string;
  name: string;
  date: string;
  syndicId: string;

  description: string | null;
  frequency: number | null;
  frequencyTimeIntervalId: string | null;

  mode: TUpdateMode;

  detailImages:
    | {
        name: string;
        url: string;
      }[]
    | null
    | undefined;
}

const timeIntervalServices = new TimeIntervalServices();
const buildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

export async function updateChecklistController(req: Request, res: Response) {
  const {
    id,
    date,
    description,
    frequency,
    frequencyTimeIntervalId,
    name,
    syndicId,
    mode,
    detailImages,
  }: IBody = req.body;

  checkValues([
    { label: 'ID da checklist', type: 'string', value: id },
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

    { label: 'Tipo da edição', type: 'string', value: mode },
    { label: 'Imagens', type: 'array', value: detailImages, required: false },
  ]);

  detailImages?.forEach((data) => {
    checkValues([
      { label: 'Nome da imagem', type: 'string', value: data.name },
      { label: 'Link da imagem', type: 'string', value: data.url },
    ]);
  });

  if (frequency) {
    checkMinimumNumber([{ label: 'Frequência', min: 1, value: frequency }]);
  }

  let frequencyInDays = 0;

  if (frequency && frequencyTimeIntervalId) {
    const frequencyData = await timeIntervalServices.findById({
      timeIntervalId: frequencyTimeIntervalId,
    });
    frequencyInDays = frequencyData.unitTime * frequency;

    checkMaximumNumber([{ label: 'Periodicidade em dias', max: 35000, value: frequencyInDays }]);
  }

  await buildingNotificationConfigurationServices.findById({
    buildingNotificationConfigurationId: syndicId,
  });

  const {
    groupId,
    date: defaultDate,
    frequencyTimeInterval: oldFrequencyTimeInterval,
    frequency: oldFrequency,
    building,
  } = await checklistServices.findById(id);

  await checklistServices.checkAccess({ buildingNanoId: building.nanoId });

  const oldFrequencyInDays =
    oldFrequencyTimeInterval && oldFrequency ? oldFrequencyTimeInterval.unitTime * oldFrequency : 0;

  const newDate = setToUTCMidnight(new Date(date));
  const createNewGroupId =
    newDate.getTime() < defaultDate.getTime() || oldFrequencyInDays !== frequencyInDays;

  const updatedChecklist = await checklistServices.update({
    data: {
      date: newDate,
      name,
      description,
      syndicId,
      frequency: frequency || null,
      frequencyTimeIntervalId: frequency ? frequencyTimeIntervalId : null,
      groupId: createNewGroupId ? uuidv4().substring(0, 12) : undefined,

      detailImages: {
        deleteMany: {},
        createMany: {
          data: Array.isArray(detailImages)
            ? detailImages.map((data) => ({ name: data.name, url: data.url }))
            : [],
        },
      },
    },
    where: {
      id,
    },
  });

  if (mode === 'thisAndFollowing') {
    await checklistServices.deleteMany({
      where: {
        groupId,
        date: { gt: defaultDate },
        status: 'pending',
        NOT: { id: updatedChecklist.id },
      },
    });

    if (frequencyInDays) {
      // criando 3 anos de registros proporcional a data
      const frequenciesToCreate = Math.ceil((365 / frequencyInDays) * 3);

      const childrenChecklists: prismaTypes.ChecklistUncheckedCreateInput[] = [];

      for (let index = 0; index < frequenciesToCreate; index++) {
        childrenChecklists.push({
          groupId: updatedChecklist.groupId,
          buildingId: updatedChecklist.buildingId,
          name: updatedChecklist.name,
          description: updatedChecklist.description,
          syndicId: updatedChecklist.syndicId,
          frequency: updatedChecklist.frequency,
          frequencyTimeIntervalId: updatedChecklist.frequencyTimeIntervalId,
          status: 'pending',
          date: addDays({
            date: updatedChecklist.date,
            days: frequencyInDays * index + frequencyInDays,
          }),
          detailImages: {
            createMany: {
              data: Array.isArray(detailImages)
                ? detailImages.map((data) => ({ name: data.name, url: data.url }))
                : [],
            },
          },
        });
      }

      await prisma.$transaction(
        childrenChecklists.map((data) => prisma.checklist.create({ data })),
      );
    }
  }

  return res.status(200).json({ ServerMessage: { message: 'Checklist editado com sucesso.' } });
}
