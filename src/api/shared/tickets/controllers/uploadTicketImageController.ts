import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

const prisma = new PrismaClient();

export async function uploadTicketImageController(req: Request, res: Response) {
  const { ticketId } = req.params as any as { ticketId: string };
  const { url, name } = req.body as { url: string; name: string };

  if (!url || !name) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'URL e nome da imagem são obrigatórios.',
    });
  }

  const ticketImage = await prisma.ticketImage.create({
    data: {
      ticketId,
      url,
      name,
    },
  });

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { lastEditedAt: new Date() },
  });

  return res.status(200).json({
    message: 'Imagem associada ao ticket com sucesso.',
    ticketImage,
  });
}
