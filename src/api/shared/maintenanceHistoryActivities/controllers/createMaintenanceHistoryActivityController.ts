import { Response, Request } from 'express';
import { createMaintenanceHistoryActivityCommentService } from '../services';
import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

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

  if (!images?.length && !content?.trim()) {
    throw new ServerMessage({
      message: 'Envie um comentário ou imagem.',
      statusCode: 400,
    });
  }

  await createMaintenanceHistoryActivityCommentService({
    content,
    maintenanceHistoryId,
    images,
    syndicNanoId,
    userId,
  });

  return res.status(201).json({ ServerMessage: { message: 'Atividade cadastrada com sucesso.' } });
}
