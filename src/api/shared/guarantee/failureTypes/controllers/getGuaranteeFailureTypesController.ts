import type { GuaranteeFailureType } from '@prisma/client';
import type { Request, Response } from 'express';

import { findManyGuaranteeFailureTypes } from '../services/findManyGuaranteeFailureTypes';

interface IQuery {
  companyId: string;
}

export async function getGuaranteeFailureTypesController(req: Request, res: Response) {
  const { companyId } = req.query as unknown as IQuery;

  const companyIdFilter =
    !companyId || companyId === 'undefined' ? undefined : companyId.split(',');

  const failureTypes = await findManyGuaranteeFailureTypes<GuaranteeFailureType>({
    data: {
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
    failureTypes,
  });
}
