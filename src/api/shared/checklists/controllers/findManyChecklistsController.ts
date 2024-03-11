import { Response, Request } from 'express';
import { checklistServices } from '../services/checklistServices';
import { checkValues } from '../../../../utils/newValidator';

export async function findManyChecklistsController(req: Request, res: Response) {
  const { buildingId, date } = req.params as any as { buildingId: string; date: string };

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingId },
    { label: 'Data', type: 'date', value: new Date(date) },
  ]);

  await checklistServices.checkAccess({ buildingId });

  const checklists = await checklistServices.findMany({ buildingId, date });

  // Pode ser que fique pesado no futuro
  const calendarDates = await checklistServices.findChecklistDataByMonth({ buildingId });

  return res.status(200).json({ checklists, calendarDates });
}
