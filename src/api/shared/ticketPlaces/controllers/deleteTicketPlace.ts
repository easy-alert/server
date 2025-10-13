import { Request, Response } from 'express';
import { prisma } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

export async function deleteTicketPlace(req: Request, res: Response) {
  const { placeId } = req.params as { placeId: string };

  if (!placeId) throw new ServerMessage({ statusCode: 400, message: 'ID do local não informado.' });

  const place = await prisma.ticketPlace.findUnique({ select: { id: true, companyId: true }, where: { id: placeId } });
  if (!place) throw new ServerMessage({ statusCode: 404, message: 'Local não encontrado.' });

  if (place.companyId && place.companyId !== req.Company?.id) {
    throw new ServerMessage({ statusCode: 403, message: 'Sem permissão para excluir este local.' });
  }

  try {
    await prisma.ticketPlace.delete({ where: { id: placeId } });
  } catch (error: any) {
    // P2003: Foreign key constraint failed on the field
    const message = 'Este local está em uso e não pode ser excluído';
    throw new ServerMessage({ statusCode: 400, message });
  }

  return res.status(200).json({ ServerMessage: { statusCode: 200, message: 'Local excluído.' } });
}


