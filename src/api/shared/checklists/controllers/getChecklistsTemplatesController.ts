import { Response, Request } from 'express';

import { getChecklistsTemplates } from '../services/getChecklistsTemplates';

import { checkValues } from '../../../../utils/newValidator';

export async function getChecklistsTemplatesController(req: Request, res: Response) {
  const { buildingId } = req.params;

  checkValues([{ label: 'ID da edificação', type: 'string', value: buildingId }]);

  const checklistTemplate = await getChecklistsTemplates({ buildingId });

  return res.status(201).json(checklistTemplate);
}
