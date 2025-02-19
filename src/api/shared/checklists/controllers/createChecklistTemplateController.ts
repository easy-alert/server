import { Response, Request } from 'express';

import { createChecklistTemplate } from '../services/createChecklistTemplate';

import { checkValues } from '../../../../utils/newValidator';

interface IBody {
  name: string;
  description?: string;
  items: {
    name: string;
  }[];
}

export async function createChecklistTemplateController(req: Request, res: Response) {
  const { buildingId } = req.params;
  const { name, description, items }: IBody = req.body;

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingId },
    { label: 'Título', type: 'string', value: name },
    { label: 'Itens', type: 'array', value: items },
  ]);

  const checklistTemplate = await createChecklistTemplate({ buildingId, name, description, items });

  return res.status(201).json(checklistTemplate);
}
