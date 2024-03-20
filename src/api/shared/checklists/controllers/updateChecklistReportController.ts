import { Response, Request } from 'express';
import { checkValues } from '../../../../utils/newValidator';
import { checklistServices } from '../services/checklistServices';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

interface IBody {
  checklistId: string;
  observation: string | null | undefined;
  images?: {
    name: string;
    url: string;
  }[];
}

export async function updateChecklistReportController(req: Request, res: Response) {
  const { checklistId, images, observation }: IBody = req.body;

  checkValues([
    { label: 'ID do checklist', type: 'string', value: checklistId },
    { label: 'Observações', type: 'string', value: observation, required: false },
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

  if (foundChecklist.status === 'pending') {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Você só pode editar um checklist concluído.',
    });
  }

  await checklistServices.update({
    data: {
      observation,
      resolutionDate: new Date(),
      images: {
        deleteMany: {},
        createMany: {
          data: Array.isArray(images) ? images : [],
        },
      },
    },
    where: { id: checklistId },
  });

  return res
    .status(200)
    .json({ ServerMessage: { message: 'Relato do checklist editado com sucesso.' } });
}
