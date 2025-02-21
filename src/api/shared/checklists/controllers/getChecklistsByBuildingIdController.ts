import { Response, Request } from 'express';

import { getChecklistsByBuildingId } from '../services/getChecklistsByBuildingId';

import { checkValues } from '../../../../utils/newValidator';

export async function getChecklistsByBuildingIdController(req: Request, res: Response) {
  const { buildingId } = req.params;
  const { Company } = req;

  checkValues([{ label: 'ID da edificação', type: 'string', value: buildingId }]);

  const checklists = await getChecklistsByBuildingId({
    companyId: Company.id,
    buildingId: [buildingId],
  });

  return res.status(201).json(checklists);
}
