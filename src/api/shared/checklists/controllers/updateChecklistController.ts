import { Response, Request } from 'express';

import type { ChecklistItem, ChecklistStatusName } from '@prisma/client';

import { getChecklists } from '../services/getChecklists';
import { saveChecklist } from '../services/saveChecklist';
import { updateChecklistsUsersById } from '../services/updateChecklistsUsersById';
import { updateChecklistsUsersByGroup } from '../services/updateChecklistsUsersByGroup';

import { checkValues } from '../../../../utils/newValidator';

interface IBody {
  buildingId: string;
  usersIds: string[];
  checklistItems: ChecklistItem[];
  observation: string;
  status: ChecklistStatusName;
  updateMode?: 'this' | 'thisAndFollowing' | 'all' | '';

  images:
    | {
        name: string;
        url: string;
      }[]
    | null
    | undefined;
}

export async function updateChecklistController(req: Request, res: Response) {
  const { userId } = req;
  const { checklistId } = req.params;
  const { buildingId, usersIds, checklistItems, observation, status, images, updateMode }: IBody =
    req.body;

  checkValues([
    { label: 'ID do checklist', type: 'string', value: checklistId },
    { label: 'ID do prédio', type: 'string', value: buildingId, required: false },
    { label: 'IDs dos usuários', type: 'array', value: usersIds, required: false },
    { label: 'Itens do checklist', type: 'array', value: checklistItems, required: false },
    { label: 'Descrição', type: 'string', value: observation, required: false },
    { label: 'Status', type: 'string', value: status, required: false },
  ]);

  images?.forEach((data) => {
    checkValues([
      { label: 'Nome da imagem', type: 'string', value: data.name },
      { label: 'Link da imagem', type: 'string', value: data.url },
    ]);
  });

  const checklist = await getChecklists({ checklistId });

  if (updateMode) {
    switch (updateMode) {
      case 'thisAndFollowing':
        await updateChecklistsUsersByGroup({
          groupId: checklist[0].groupId,
          usersIds,
          checklistDate: checklist[0].date,
        });

        break;

      default:
        await updateChecklistsUsersById({
          checklistId,
          usersIds,
        });

        break;
    }
  } else {
    await saveChecklist({
      checklistId,
      buildingId,
      checklistItems,
      observation,
      finishedById: userId,
      status,
      images,
    });
  }

  return res.status(200).json({ ServerMessage: { message: 'Checklist editado com sucesso.' } });
}
