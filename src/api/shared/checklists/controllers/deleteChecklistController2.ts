import { Response, Request } from 'express';

import { deleteChecklist } from '../services/deleteChecklist';
import { getChecklists } from '../services/getChecklists';

import { checkValues } from '../../../../utils/newValidator';

type TDeleteMode = 'this' | 'all' | 'thisAndFollowing' | '';

export async function deleteChecklistController2(req: Request, res: Response) {
  const { checklistId, mode } = req.params as any as { checklistId: string; mode: TDeleteMode };
  const { Company } = req;

  checkValues([
    { label: 'ID da checklist', type: 'string', value: checklistId },
    { label: 'Tipo da exclusão', type: 'string', value: mode },
  ]);

  const checklist = await getChecklists({ companyId: Company?.id, checklistId });

  if (!checklist.length) {
    return res.status(404).json({ ServerMessage: { message: 'Checklist não encontrado.' } });
  }

  switch (mode) {
    case 'all':
      if (checklist[0].templateId) {
        await deleteChecklist({ where: { templateId: checklist[0].templateId } });
      } else {
        await deleteChecklist({ where: { groupId: checklist[0].groupId } });
      }
      break;

    case 'thisAndFollowing':
      if (checklist[0].templateId) {
        await deleteChecklist({
          where: {
            templateId: checklist[0].templateId,
            date: { gte: checklist[0].date },
          },
        });
      } else {
        await deleteChecklist({
          where: {
            groupId: checklist[0].groupId,
            date: { gte: checklist[0].date },
          },
        });
      }
      break;

    default:
      await deleteChecklist({ where: { id: checklistId } });
      break;
  }

  return res.status(200).json({ ServerMessage: { message: 'Checklist excluído com sucesso.' } });
}
