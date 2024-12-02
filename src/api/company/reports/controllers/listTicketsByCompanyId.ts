import { Response, Request } from 'express';

import { findManyTicketsReports } from '../services/findManyTicketReports';

export async function listTicketsByCompanyId(req: Request, res: Response) {
  const { id: companyId } = req.Company;

  const ticketPdfs = await findManyTicketsReports({ companyId });

  return res.status(200).json({ ticketPdfs });
}
