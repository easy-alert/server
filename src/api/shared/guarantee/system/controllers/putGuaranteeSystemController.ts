import type { GuaranteeSystem } from '@prisma/client';
import type { Request, Response } from 'express';

import { updateGuaranteeSystem } from '../services/updateGuaranteeSystem';
import { findFirstGuaranteeSystem } from '../services/findFirstGuaranteeSystem';

import { checkValues } from '../../../../../utils/newValidator';

interface IQuery {
  guaranteeSystemId: string;
}

interface IBody {
  companyId: string;
  systemName: string;
}

export async function putGuaranteeSystemController(req: Request, res: Response) {
  const { guaranteeSystemId } = req.params as unknown as IQuery;
  const { companyId, systemName } = req.body as unknown as IBody;

  checkValues([
    { label: 'ID do sistema', value: guaranteeSystemId, type: 'string', required: true },
    { label: 'Nome do sistema', value: systemName, type: 'string', required: true },
  ]);

  const systemExists = await findFirstGuaranteeSystem<GuaranteeSystem>({
    data: {
      where: {
        name: systemName,
      },
    },
  });

  if (systemExists) {
    return res.status(404).json({
      ServerMessage: {
        statusCode: 404,
        message: 'Sistema já cadastrado.',
      },
    });
  }

  const systemUpdated = await updateGuaranteeSystem<GuaranteeSystem>({
    data: {
      data: {
        name: systemName,
        companyId,
      },

      where: {
        id: guaranteeSystemId,
      },
    },
  });

  return res.status(200).json({
    systemUpdated,
    ServerMessage: {
      statusCode: 200,
      message: 'Sistema atualizado com sucesso.',
    },
  });
}
