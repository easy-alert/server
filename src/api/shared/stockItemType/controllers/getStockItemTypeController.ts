import type { Request, Response } from 'express';

import { findManyStockItemType } from '../services/findManyStockItemType';
import { countStockItemType } from '../services/countStockItemType';

import { checkValues } from '../../../../utils/newValidator';

interface StockItemTypeOutput {
  id: string;
  name: string;
  description: string;
  isActive: boolean;

  _count: {
    stockItems: number;
  };
}

export async function getStockItemTypeController(req: Request, res: Response) {
  const { companyId } = req;
  const { buildingId, page, limit } = req.query as unknown as {
    buildingId: string;
    page: string;
    limit: string;
  };

  checkValues([{ label: 'ID da empresa', type: 'string', value: companyId, required: true }]);

  const stockItemTypes = await findManyStockItemType<StockItemTypeOutput>({
    data: {
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,

        _count: {
          select: {
            stockItems: true,
          },
        },
      },

      where: {
        companyId,

        ...(page && {
          skip: (Number(page) - 1) * Number(limit),
        }),

        ...(limit && {
          take: Number(limit),
        }),

        ...(buildingId && {
          building: {
            id: buildingId,
          },
        }),
      },

      orderBy: {
        name: 'asc',
      },
    },
  });

  const stockItemTypeCount = await countStockItemType({
    data: {
      where: {
        companyId,

        ...(buildingId && {
          building: {
            id: buildingId,
          },
        }),
      },
    },
  });

  return res.status(200).json({
    stockItemTypes,
    stockItemTypeCount,
  });
}
