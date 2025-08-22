import type { Request, Response } from 'express';

import { findManyStockMovements } from '../services/findManyStockMovements';
import { countStockMovements } from '../services/countStockMovements';

import { checkValues } from '../../../../utils/newValidator';

interface StockItemTypeOutput {
  quantity: number;
  previousBalance: number;
  newBalance: number;

  movementType: string;
  movementDate: Date;

  stock: {
    building: {
      id: string;
      name: string;
    };
  };

  stockItem: {
    id: string;
    name: string;
  };

  lastUpdatedBy: {
    id: string;
    name: string;
  };
}

export async function getStockMovementsController(req: Request, res: Response) {
  const { companyId } = req;
  const { buildingId, page, limit } = req.query as unknown as {
    buildingId: string;
    page: string;
    limit: string;
  };

  checkValues([{ label: 'ID da empresa', type: 'string', value: companyId, required: true }]);

  const stockMovements = await findManyStockMovements<StockItemTypeOutput>({
    data: {
      select: {
        quantity: true,
        previousBalance: true,
        newBalance: true,

        movementType: true,
        movementDate: true,

        stock: {
          select: {
            building: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        stockItem: {
          select: {
            id: true,
            name: true,
          },
        },

        lastUpdatedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      where: {
        companyId,

        ...(buildingId && {
          stock: {
            building: {
              id: buildingId,
            },
          },
        }),

        ...(page && {
          skip: (Number(page) - 1) * Number(limit),
        }),

        ...(limit && {
          take: Number(limit),
        }),
      },

      orderBy: {
        movementDate: 'desc',
      },
    },
  });

  const stockMovementsCount = await countStockMovements({
    data: {
      where: {
        companyId,

        ...(buildingId && {
          stock: {
            building: {
              id: buildingId,
            },
          },
        }),

        ...(page && {
          skip: (Number(page) - 1) * Number(limit),
        }),

        ...(limit && {
          take: Number(limit),
        }),
      },
    },
  });

  return res.status(200).json({
    stockMovements,
    stockMovementsCount,
  });
}
