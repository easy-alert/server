import { Response, Request } from 'express';

import { getChecklistTemplateById } from '../services/getChecklistTemplateById';
import { deleteChecklistTemplate } from '../services/deleteChecklistTemplate';

import { checkValues } from '../../../../utils/newValidator';

export async function deleteChecklistTemplateController(req: Request, res: Response) {
  const { checklistTemplateId } = req.params as any as { checklistTemplateId: string };

  checkValues([{ label: 'ID da checklist', type: 'string', value: checklistTemplateId }]);

  const checklistTemplate = await getChecklistTemplateById({ checklistId: checklistTemplateId });

  await deleteChecklistTemplate({ where: { id: checklistTemplate?.id } });

  return res.status(200).json({ ServerMessage: { message: 'Checklist excluído com sucesso.' } });
}
