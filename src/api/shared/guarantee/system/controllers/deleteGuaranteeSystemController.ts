import type { Request, Response } from 'express';
import type { GuaranteeSystem } from '@prisma/client';

import { deleteGuaranteeSystem } from '../services/deleteGuaranteeSystem';
import { checkValues } from '../../../../../utils/newValidator';

interface IQuery {
  guaranteeSystemId: string;
}

export async function deleteGuaranteeSystemController(req: Request, res: Response) {
  const { guaranteeSystemId } = req.params as unknown as IQuery;

  checkValues([
    { label: 'ID do sistema', value: guaranteeSystemId, type: 'string', required: true },
  ]);

  const system = await deleteGuaranteeSystem<GuaranteeSystem>({
    data: {
      where: {
        id: guaranteeSystemId,
      },
    },
  });

  return res.status(200).json({
    system,
    ServerMessage: {
      statusCode: 200,
      message: `Sistema '${system?.name}' deletado com sucesso.`,
    },
  });
}
