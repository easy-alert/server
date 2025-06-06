import { Response, Request } from 'express';

import { checklistServices } from '../services/checklistServices';

import { checkValues } from '../../../../utils/newValidator';

export async function findChecklistByIdController(req: Request, res: Response) {
  const { checklistId } = req.params as any as { checklistId: string };

  checkValues([{ label: 'ID da checklist', type: 'string', value: checklistId, required: true }]);

  await checklistServices.checkChecklistAccess({ checklistId });

  const checklist = await checklistServices.findById(checklistId);

  return res.status(200).json({ checklist });
}
