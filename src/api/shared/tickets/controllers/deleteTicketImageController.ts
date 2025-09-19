import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

const prisma = new PrismaClient();

export async function deleteTicketImageController(req: Request, res: Response) {
  const { imageId } = req.params as any as { imageId: string };

  const ticketImage = await prisma.ticketImage.findUnique({
    where: { id: imageId },
    select: { ticketId: true },
  });

  if (!ticketImage) {
    throw new ServerMessage({
      statusCode: 404,
      message: 'Imagem não encontrada.',
    });
  }

  await prisma.ticketImage.delete({
    where: { id: imageId },
  });

  await prisma.ticket.update({
    where: { id: ticketImage.ticketId },
    data: { lastEditedAt: new Date() },
  });

  return res.status(200).json({ message: 'Imagem removida com sucesso.' });
}
