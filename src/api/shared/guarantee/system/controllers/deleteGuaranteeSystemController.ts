import type { Request, Response } from 'express';

import { deleteGuaranteeSystem } from '../services/deleteGuaranteeSystem';
import { findFirstGuaranteeSystem } from '../services/findFirstGuaranteeSystem';

import { checkValues } from '../../../../../utils/newValidator';

interface IQuery {
  guaranteeSystemId: string;
}

export async function deleteGuaranteeSystemController(req: Request, res: Response) {
  const { guaranteeSystemId } = req.params as unknown as IQuery;

  checkValues([
    { label: 'ID do sistema', value: guaranteeSystemId, type: 'string', required: true },
  ]);

  const systemExists = await findFirstGuaranteeSystem<{
    _count: {
      guarantees: number;
    };
  }>({
    data: {
      select: {
        _count: {
          select: {
            guarantees: true,
          },
        },
      },

      where: {
        id: guaranteeSystemId,
      },
    },
  });

  if (systemExists && systemExists._count.guarantees > 0) {
    return res.status(404).json({
      ServerMessage: {
        statusCode: 404,
        message: 'Sistema em uso',
      },
    });
  }

  const system = await deleteGuaranteeSystem<{ name: string }>({
    data: {
      where: {
        id: guaranteeSystemId,
      },

      select: {
        name: true,
      },
    },
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Sistema '${system?.name}' deletado com sucesso.`,
    },
  });
}
