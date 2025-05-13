import { Response, Request } from 'express';

import type { ChecklistTemplateItem } from '@prisma/client';

import { checkValues } from '../../../../utils/newValidator';
import { updateChecklistTemplate } from '../services/updateChecklistTemplate';

interface IBody {
  companyId: string;
  buildingId: string;
  name: string;
  items: ChecklistTemplateItem[];
}

export async function updateChecklistTemplateController(req: Request, res: Response) {
  const { checklistTemplateId } = req.params;
  const { companyId, buildingId, name, items }: IBody = req.body;

  checkValues([{ label: 'ID do modelo de checklist', type: 'string', value: checklistTemplateId }]);

  const updatedChecklistTemplate = await updateChecklistTemplate({
    checklistTemplateId,
    companyId,
    buildingId,
    name,
    items,
  });

  return res.status(200).json({
    message: 'Modelo de checklist atualizado com sucesso.',
    data: updatedChecklistTemplate,
  });
}
