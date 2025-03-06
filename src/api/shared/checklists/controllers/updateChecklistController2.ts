import { Response, Request } from 'express';

import type { ChecklistItem, ChecklistStatusName } from '@prisma/client';

import { checkValues } from '../../../../utils/newValidator';
import { updateChecklist } from '../services/updateChecklist';

interface IBody {
  buildingId: string;
  status: ChecklistStatusName;
  checklistItems: ChecklistItem[];

  images:
    | {
        name: string;
        url: string;
      }[]
    | null
    | undefined;
}

export async function updateChecklistController2(req: Request, res: Response) {
  const { checklistId } = req.params;
  const { buildingId, checklistItems, status, images }: IBody = req.body;

  checkValues([
    { label: 'ID do checklist', type: 'string', value: checklistId },
    { label: 'Status', type: 'string', value: status },
  ]);

  images?.forEach((data) => {
    checkValues([
      { label: 'Nome da imagem', type: 'string', value: data.name },
      { label: 'Link da imagem', type: 'string', value: data.url },
    ]);
  });

  await updateChecklist({
    checklistId,
    buildingId,
    status,
    checklistItems,
    images,
  });

  return res.status(200).json({ ServerMessage: { message: 'Checklist editado com sucesso.' } });
}
