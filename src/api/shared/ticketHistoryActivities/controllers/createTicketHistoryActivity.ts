import { Response, Request } from 'express';

import { createOneTicketHistoryActivity } from '../services/createOneTicketHistoryActivity';

import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

interface IImage {
  originalName: string;
  url: string;
}

interface IBody {
  ticketId: string;
  syndicNanoId?: string;
  userId?: string;
  activityContent: string;
  activityImages?: IImage[];
}

export async function createTicketHistoryActivity(req: Request, res: Response) {
  const { ticketId, syndicNanoId, userId, activityContent, activityImages } = req.body as IBody;

  checkValues([
    { label: 'ID do histórico do ticket', type: 'string', value: ticketId },
    { label: 'NanoID do síndico', type: 'string', value: syndicNanoId, required: !userId },
    { label: 'ID do usuário', type: 'string', value: userId, required: !syndicNanoId },
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

  await createOneTicketHistoryActivity({
    ticketId,
    syndicNanoId,
    userId,
    activityContent,
    activityImages,
  });

  return res.status(201).json({ ServerMessage: { message: 'Atividade cadastrada com sucesso.' } });
}
