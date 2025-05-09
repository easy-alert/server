import { Response, Request } from 'express';

import { findManyChecklistReports } from '../services/findManyChecklistReports';

export async function listChecklistReportsByCompanyIdController(req: Request, res: Response) {
  const { id: companyId } = req.Company;

  const checklistPdfs = await findManyChecklistReports({ companyId });

  return res.status(200).json({ checklistPdfs });
}
