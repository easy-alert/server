import type { GuaranteeFailureType } from '@prisma/client';
import type { Request, Response } from 'express';

import { findManyGuarantees } from '../../../../shared/guarantee/plan/services/findManyGuarantees';

interface IQuery {
  companyId: string;
}

export async function getGuaranteePlanController(req: Request, res: Response) {
  const { companyId } = req.query as unknown as IQuery;

  const companyIdFilter =
    !companyId || companyId === 'undefined' ? undefined : companyId.split(',');

  const guarantees = await findManyGuarantees({
    data: {
      include: {
        company: true,
        building: true,
        system: true,
        failureTypes: {
          include: {
            failureType: true,
          },
        },
        documents: true,
      },

      where: {
        companyId: {
          in: companyIdFilter,
        },
      },
    },
  });

  return res.status(200).json({
    guarantees,
  });
}
