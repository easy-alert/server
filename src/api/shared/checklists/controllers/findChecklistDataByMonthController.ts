import { Response, Request } from 'express';

import { checklistServices } from '../services/checklistServices';

import { checkValues } from '../../../../utils/newValidator';
import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';

export async function findChecklistDataByMonthController(req: Request, res: Response) {
  const { buildingNanoId } = req.params as any as { buildingNanoId: string };
  const { userId, Permissions } = req;

  const idAdmin = hasAdminPermission(Permissions);
  const userIdForFilter = idAdmin ? undefined : userId;

  checkValues([{ label: 'ID da edificação', type: 'string', value: buildingNanoId }]);

  await checklistServices.checkAccess({ buildingNanoId });

  const calendarDates = await checklistServices.findChecklistDataByMonth({
    userId: userIdForFilter,
    buildingNanoId,
  });

  return res.status(200).json({ calendarDates });
}
