import { Response, Request } from 'express';

import { getChecklistsTemplates } from '../services/getChecklistsTemplates';
import { checkValues } from '../../../../utils/newValidator';

export async function getChecklistsTemplatesController(req: Request, res: Response) {
  const { companyId } = req;
  const { buildingId } = req.query;

  checkValues([{ label: 'ID da empresa', type: 'string', value: companyId }]);

  const formattedBuildingId = buildingId ? String(buildingId) : undefined;

  const checklistTemplate = await getChecklistsTemplates({
    companyId,
    buildingId: formattedBuildingId,
  });

  return res.status(201).json(checklistTemplate);
}
