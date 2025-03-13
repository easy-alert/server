import { Response, Request } from 'express';

import { getChecklistTemplateById } from '../services/getChecklistTemplateById';
import { deleteChecklistTemplate } from '../services/deleteChecklistTemplate';

import { checkValues } from '../../../../utils/newValidator';

export async function deleteChecklistTemplateController(req: Request, res: Response) {
  const { checklistTemplateId } = req.params as any as { checklistTemplateId: string };

  checkValues([
    { label: 'ID do template de checklist', type: 'string', value: checklistTemplateId },
  ]);

  const checklistTemplate = await getChecklistTemplateById({ checklistId: checklistTemplateId });

  if (!checklistTemplate) {
    return res
      .status(404)
      .json({ ServerMessage: { message: 'Template de checklist não encontrado.' } });
  }

  try {
    await deleteChecklistTemplate({ checklistTemplateId: checklistTemplate.id });

    return res
      .status(200)
      .json({ ServerMessage: { message: 'Template de checklist excluído com sucesso.' } });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return res.status(409).json({
        ServerMessage: {
          message: 'Não foi possível excluir, há checklists vinculados a esse template.',
        },
      });
    }

    return res
      .status(500)
      .json({ ServerMessage: { message: 'Erro ao excluir o template de checklist.' } });
  }
}
