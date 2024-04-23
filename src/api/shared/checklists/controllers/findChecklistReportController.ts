import { Response, Request } from 'express';
import { checklistServices } from '../services/checklistServices';

export async function findChecklistReportController(req: Request, res: Response) {
  const companyId = req.Company.id;

  await checklistServices.checkAccessByCompany({ companyId });

  const checklists = await checklistServices.findManyForReport({ companyId });

  return res.status(200).json({ checklists });
}
