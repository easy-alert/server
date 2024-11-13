import { Request, Response } from 'express';

import { prisma } from '../../../../../prisma';

export async function findManyTicketDismissReasons(_req: Request, res: Response) {
  const ticketDismissReasons = await prisma.ticketDismissReasons.findMany();

  return res.status(200).json(ticketDismissReasons);
}
