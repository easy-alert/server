import { Response, Request } from 'express';
import { checkValues } from '../../../../utils/newValidator';
import { checklistServices } from '../services/checklistServices';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { addDays } from '../../../../utils/dateTime';

interface IBody {
  checklistId: string;
  observation: string | null | undefined;
  images:
    | {
        name: string;
        url: string;
      }[]
    | null
    | undefined;
}

export async function completeChecklistController(req: Request, res: Response) {
  const { checklistId, images, observation }: IBody = req.body;

  checkValues([
    { label: 'ID do checklist', type: 'string', value: checklistId },
    { label: 'Obvservações', type: 'string', value: observation, required: false },
    { label: 'Imagens', type: 'array', value: images, required: false },
  ]);

  images?.forEach(({ name, url }) => {
    checkValues([
      { label: 'Nome da imagem', type: 'string', value: name },
      { label: 'Link da imagem', type: 'string', value: url },
    ]);
  });

  const foundChecklist = await checklistServices.findById(checklistId);

  await checklistServices.checkAccess({ buildingNanoId: foundChecklist.building.nanoId });

  if (foundChecklist.status === 'completed') {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Esse checklist já foi concluído.',
    });
  }

  const updatedChecklist = await checklistServices.update({
    data: {
      status: 'completed',
      observation,
      resolutionDate: new Date(),
      images: {
        createMany: {
          data: Array.isArray(images) ? images : [],
        },
      },
    },
    where: { id: checklistId },
  });

  const latestChecklist = await checklistServices.findLatestChecklistFromGroup({
    groupId: updatedChecklist.groupId,
  });

  if (latestChecklist.frequency && latestChecklist.frequencyTimeInterval) {
    await checklistServices.create({
      data: {
        groupId: latestChecklist.groupId,
        buildingId: latestChecklist.buildingId,
        name: latestChecklist.name,
        description: latestChecklist.description,
        syndicId: latestChecklist.syndicId,
        frequency: latestChecklist.frequency,
        frequencyTimeIntervalId: latestChecklist.frequencyTimeIntervalId,
        status: 'pending',
        date: addDays({
          date: latestChecklist.date,
          days: latestChecklist.frequency * latestChecklist.frequencyTimeInterval.unitTime,
        }),
      },
    });
  }

  return res.status(200).json({ ServerMessage: { message: 'Checklist concluído com sucesso.' } });
}
