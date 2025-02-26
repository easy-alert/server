import { Response, Request } from 'express';

import { getChecklists } from '../services/getChecklists';

import { checkValues } from '../../../../utils/newValidator';

export async function getChecklistsController(req: Request, res: Response) {
  const { checklistId } = req.params;
  const { Company } = req;

  checkValues([{ label: 'ID do checklist', type: 'string', value: checklistId }]);

  const checklists = await getChecklists({ companyId: Company.id, checklistId });

  return res.status(201).json(checklists);
}
