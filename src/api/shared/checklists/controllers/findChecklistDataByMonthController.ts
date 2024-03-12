import { Response, Request } from 'express';
import { checklistServices } from '../services/checklistServices';
import { checkValues } from '../../../../utils/newValidator';

export async function findChecklistDataByMonthController(req: Request, res: Response) {
  const { buildingNanoId } = req.params as any as { buildingNanoId: string };

  checkValues([{ label: 'ID da edificação', type: 'string', value: buildingNanoId }]);

  await checklistServices.checkAccess({ buildingNanoId });

  const calendarDates = await checklistServices.findChecklistDataByMonth({ buildingNanoId });

  return res.status(200).json({ calendarDates });
}
