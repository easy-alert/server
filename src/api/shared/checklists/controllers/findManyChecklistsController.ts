import { Response, Request } from 'express';
import { checklistServices } from '../services/checklistServices';
import { checkValues } from '../../../../utils/newValidator';

export async function findManyChecklistsController(req: Request, res: Response) {
  const { buildingNanoId, date } = req.params as any as { buildingNanoId: string; date: string };

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingNanoId },
    { label: 'Data', type: 'date', value: new Date(date) },
  ]);

  await checklistServices.checkAccess({ buildingNanoId });

  const checklists = await checklistServices.findMany({ buildingNanoId, date });

  return res.status(200).json({ checklists });
}
