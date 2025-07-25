import type { GuaranteeSystem } from '@prisma/client';
import type { Request, Response } from 'express';

import { findManyGuaranteeSystem } from '../services/findManyGuaranteeSystem';

interface IQuery {
  companyId: string;
}

export async function getGuaranteeSystemController(req: Request, res: Response) {
  const { companyId } = req.query as unknown as IQuery;

  const companyIdFilter =
    !companyId || companyId === 'undefined' ? undefined : companyId.split(',');

  const systems = await findManyGuaranteeSystem<GuaranteeSystem>({
    data: {
      include: {
        _count: {
          select: {
            Guarantee: true,
          },
        },
      },

      where: {
        companyId: {
          in: companyIdFilter,
        },
      },

      orderBy: [
        {
          name: 'asc',
        },
      ],
    },
  });

  return res.status(200).json({
    systems,
  });
}
