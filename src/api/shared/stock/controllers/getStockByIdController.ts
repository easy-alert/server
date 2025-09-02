import type { Request, Response } from 'express';

import { checkValues } from '../../../../utils/newValidator';
import { findUniqueStock } from '../services/findUniqueStock';

interface StockOutput {
  id: string;
  quantity: number;
  minimumQuantity: number;
  location: string;
  notes: string;
  isActive: boolean;

  createdBy: {
    id: string;
    name: string;
  };

  stockItem: {
    id: string;
    name: string;
    description: string;
    unit: string;
    imageUrl: string;
    isActive: boolean;

    stockItemType: {
      id: string;
      name: string;
    };
  };

  building: {
    id: string;
    name: string;
  };

  movements: {
    movementType: string;
    movementDate: Date;

    lastUpdatedBy: {
      id: string;
      name: string;
    };

    transferTo: {
      id: string;
      name: string;
    };
  };
}

export async function getStockByIdController(req: Request, res: Response) {
  const { companyId } = req;
  const { stockId } = req.params;

  checkValues([
    { label: 'ID do estoque', type: 'string', value: stockId, required: true },
    { label: 'ID da empresa', type: 'string', value: companyId, required: true },
  ]);

  const stock = await findUniqueStock<StockOutput>({
    data: {
      select: {
        id: true,

        quantity: true,
        minimumQuantity: true,
        location: true,
        notes: true,
        isActive: true,

        stockItem: {
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
          },
        },

        building: {
          select: {
            id: true,
            name: true,
          },
        },

        movements: {
          select: {
            notes: true,

            movementType: true,
            movementDate: true,

            lastUpdatedBy: {
              select: {
                id: true,
                name: true,
              },
            },

            transferTo: {
              select: {
                id: true,
                name: true,
              },
            },
          },

          take: 5,

          orderBy: {
            movementDate: 'desc',
          },
        },
      },

      where: {
        id: stockId,
      },
    },
  });

  return res.status(200).json({
    stock,
  });
}
