import type { Request, Response } from 'express';

import { findManyStockItem } from '../services/findManyStockItem';
import { countStockItems } from '../services/countStockItems';

import { checkValues } from '../../../../utils/newValidator';

interface StockItemOutput {
  id: string;
  name: string;
  description: string;
  unit: string;
  isActive: boolean;

  stockItemType: {
    id: string;
    name: string;
  };

  _count: {
    stocks: number;
  };
}

export async function getStockItemController(req: Request, res: Response) {
  const { companyId } = req;
  const { buildingId, page, limit } = req.query as unknown as {
    buildingId: string;
    page: string;
    limit: string;
  };

  checkValues([{ label: 'ID da empresa', type: 'string', value: companyId, required: true }]);

  const stockItems = await findManyStockItem<StockItemOutput>({
    data: {
      select: {
        id: true,
        name: true,
        description: true,
        unit: true,
        imageUrl: true,
        isActive: true,

        stockItemType: {
          select: {
            id: true,
            name: true,
          },
        },

        _count: {
          select: {
            stocks: true,
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

  const stockItemCount = await countStockItems({
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
    stockItems,
    stockItemCount,
  });
}
