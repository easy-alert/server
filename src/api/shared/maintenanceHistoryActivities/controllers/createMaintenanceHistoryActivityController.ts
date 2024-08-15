import { Response, Request } from 'express';
import { createMaintenanceHistoryActivityService } from '../services';
import { checkValues } from '../../../../utils/newValidator';
import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { UserServices } from '../../users/user/services/userServices';

interface IImage {
  originalName: string;
  url: string;
}

interface IBody {
  syndicNanoId?: string;
  userId?: string;
  maintenanceHistoryId: string;
  content: string | null;
  images?: IImage[];
}

const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

const userServices = new UserServices();

export async function createMaintenanceHistoryActivityController(req: Request, res: Response) {
  const { maintenanceHistoryId, syndicNanoId, userId, content, images } = req.body as IBody;

  checkValues([
    { label: 'ID do histórico de manutenção', type: 'string', value: maintenanceHistoryId },
    { label: 'NanoID do síndico', type: 'string', value: syndicNanoId, required: !userId },
    { label: 'ID do usuário', type: 'string', value: userId, required: !syndicNanoId },
    {
      label: 'Comentário',
      type: 'string',
      value: content ? content.trim() : null,
      required: false,
    },
    { label: 'Imagens', type: 'array', value: images, required: false },
  ]);

  images?.forEach(({ originalName, url }) => {
    checkValues([
      {
        label: 'Nome da imagem',
        type: 'string',
        value: originalName,
      },
      {
        label: 'URL da imagem',
        type: 'string',
        value: url,
      },
    ]);
  });

  let author: string = 'Convidado';
  // Gambiarra, ver lá na modal
  if (syndicNanoId && syndicNanoId !== 'true') {
    author = (await sharedBuildingNotificationConfigurationServices.findByNanoId({ syndicNanoId }))
      .name;
  }

  if (userId) {
    author = (await userServices.findById({ userId })).name;
  }

  await createMaintenanceHistoryActivityService({
    data: {
      content: content ? content.trim() : null,
      title: `Nova atividade de ${author}`,
      type: 'comment',
      maintenanceHistoryId,

      images: {
        createMany: {
          data: images
            ? images.map(({ originalName, url }) => ({
                name: originalName,
                url,
              }))
            : [],
        },
      },
    },
  });

  return res.status(201).json({ ServerMessage: { message: 'Atividade cadastrado com sucesso.' } });
}
