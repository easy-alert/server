import { Response, Request } from 'express';

import { checklistServices } from '../services/checklistServices';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

import { checkValues } from '../../../../utils/newValidator';
import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { hasManagementPermission } from '../../../../utils/permissions/hasManagementPermission';

export async function findManyChecklistsController(req: Request, res: Response) {
  const { buildingNanoId, date } = req.params as any as { buildingNanoId: string; date: string };
  const { userId, Permissions } = req;

  const idAdmin = hasAdminPermission(Permissions);
  const isManager = hasManagementPermission(Permissions, 'management:checklist');
  const userIdForFilter = idAdmin || isManager ? undefined : userId;

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingNanoId },
    { label: 'Data', type: 'date', value: new Date(date) },
  ]);

  await checklistServices.checkAccess({ buildingNanoId });

  const checklists = await checklistServices.findMany({
    buildingNanoId,
    userId: userIdForFilter,
    date,
  });

  const formattedChecklist = checklists.map((checklist) => {
    const { checklistItem, checklistUsers, ...rest } = checklist;

    const totalItems = checklistItem.length;
    const completedItems = checklistItem.filter((item) => item.status !== 'pending').length;

    const formattedChecklistUsers = checklistUsers.map((checklistUser) => ({
      id: checklistUser.user.id,
      name: checklistUser.user.name,
      image: checklistUser.user.image,
      email: checklistUser.user.email,
    }));

    return {
      ...rest,
      checklistUsers: formattedChecklistUsers,
      totalItems,
      completedItems,
    };
  });

  const buildingName = (await buildingServices.findByNanoId({ buildingNanoId })).name;

  return res.status(200).json({ checklists: formattedChecklist, buildingName });
}
