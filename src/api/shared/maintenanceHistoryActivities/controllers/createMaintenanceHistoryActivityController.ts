import { Response, Request } from 'express';
import { createMaintenanceHistoryActivityService } from '../services';
import { checkValues } from '../../../../utils/newValidator';
import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { UserServices } from '../../users/user/services/userServices';

interface IBody {
  syndicNanoId?: string;
  userId?: string;
  maintenanceHistoryId: string;
  content: string;
}

const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

const userServices = new UserServices();

export async function createMaintenanceHistoryActivityController(req: Request, res: Response) {
  const { maintenanceHistoryId, syndicNanoId, userId, content } = req.body as IBody;

  checkValues([
    { label: 'ID do histórico de manutenção', type: 'string', value: maintenanceHistoryId },
    { label: 'NanoID do síndico', type: 'string', value: syndicNanoId, required: !userId },
    { label: 'ID do usuário', type: 'string', value: userId, required: !syndicNanoId },
    { label: 'Comentário', type: 'string', value: content.trim() },
  ]);

  let author: string | null = null;

  if (syndicNanoId) {
    author = (await sharedBuildingNotificationConfigurationServices.findByNanoId({ syndicNanoId }))
      .name;
  }

  if (userId) {
    author = (await userServices.findById({ userId })).name;
  }

  await createMaintenanceHistoryActivityService({
    data: {
      content: content.trim(),
      title: `Nova atividade de ${author}`,
      type: 'comment',
      maintenanceHistoryId,
    },
  });

  return res.status(201).json({ ServerMessage: { message: 'Atividade cadastrado com sucesso.' } });
}
