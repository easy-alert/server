import { Request, Response } from 'express';

import { prisma } from '../../../../../prisma';
import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

export async function createTicketPlace(req: Request, res: Response) {
  const { label } = req.body as { label?: string };

  checkValues([{ label: 'Nome do local', type: 'string', value: label }]);

  try {
    const place = await prisma.ticketPlace.create({
      data: { label: String(label).trim(), companyId: req.Company?.id ?? null },
      select: { id: true, label: true },
    });

    return res.status(201).json({
      place,
      ServerMessage: { statusCode: 201, message: 'Local criado com sucesso.' },
    });
  } catch (error: any) {
    // Unique constraint or other known errors
    throw new ServerMessage({ statusCode: 400, message: 'Não foi possível criar o local.' });
  }
}
