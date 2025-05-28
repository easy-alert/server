import { Response, Request } from 'express';

import { getChecklists } from '../services/getChecklists';

import { checkValues } from '../../../../utils/newValidator';

import { findChecklistReportController } from './findChecklistReportController';

export async function getChecklistsController(req: Request, res: Response) {
  const { checklistId } = req.params;
  const { Company } = req;

  checkValues([{ label: 'ID do checklist', type: 'string', value: checklistId }]);

  if (checklistId === 'reports') {
    return findChecklistReportController(req, res);
  }

  const checklists = await getChecklists({ companyId: Company.id, checklistId });

  const formattedChecklists = checklists.map((checklist) => {
    const { checklistUsers, ...rest } = checklist;

    const formattedChecklistUsers = checklistUsers.map((checklistUser) => ({
      id: checklistUser.user.id,
      name: checklistUser.user.name,
      image: checklistUser.user.image,
      email: checklistUser.user.email,
    }));

    return {
      ...rest,
      checklistUsers: formattedChecklistUsers,
    };
  });

  return res.status(201).json(formattedChecklists);
}
