import { Response, Request } from 'express';

import { createOneStockHistoryActivity } from '../services/createOneStockHistoryActivity';

import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

interface IImage {
  originalName: string;
  url: string;
}

interface IBody {
  stockId: string;
  userId?: string;
  activityContent: string;
  activityImages?: IImage[];
}

export async function createStockHistoryActivity(req: Request, res: Response) {
  const { stockId, userId, activityContent, activityImages } = req.body as IBody;

  checkValues([
    { label: 'ID do histórico do estoque', type: 'string', value: stockId },
    { label: 'ID do usuário', type: 'string', value: userId },
    {
      label: 'Comentário',
      type: 'string',
      value: activityContent ? activityContent.trim() : null,
      required: false,
    },
    { label: 'Imagens', type: 'array', value: activityImages, required: false },
  ]);

  activityImages?.forEach(({ originalName, url }) => {
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

  if (!activityImages?.length && !activityContent?.trim()) {
    throw new ServerMessage({
      message: 'Envie um comentário ou imagem.',
      statusCode: 400,
    });
  }

  await createOneStockHistoryActivity({
    stockId,
    userId,
    activityContent,
    activityImages,
  });

  return res.status(201).json({ ServerMessage: { message: 'Atividade cadastrada com sucesso.' } });
}
