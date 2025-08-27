import type { Request, Response } from 'express';

import { updateStock } from '../services/updateStock';
import { removalStockMovement } from '../../stockMovement/businessRules/removalStockMovement';

import { checkValues } from '../../../../utils/newValidator';
import { findUniqueStock } from '../services/findUniqueStock';

interface StockOutput {
  id: string;
  quantity: number;

  stockItem: {
    id: string;
    name: string;
  };

  building: {
    id: string;
    name: string;
  };
}

interface IPreviousStock {
  quantity: number;
}

export async function deleteStockController(req: Request, res: Response) {
  const { companyId, userId } = req;
  const { stockId } = req.params;

  checkValues([
    { label: 'ID do estoque', type: 'string', value: stockId, required: true },
    { label: 'ID da empresa', type: 'string', value: companyId, required: true },
  ]);

  const previousStock = await findUniqueStock<IPreviousStock>({
    data: {
      select: {
        quantity: true,
      },

      where: {
        id: stockId,
      },
    },
  });

  if (!previousStock) {
    return res.status(404).json({
      ServerMessage: { message: 'Estoque não encontrado' },
    });
  }

  const stock = await updateStock<StockOutput>({
    data: {
      select: {
        id: true,

        stockItem: {
          select: {
            id: true,
            name: true,
          },
        },

        building: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      data: {
        quantity: 0,

        isActive: false,
      },

      where: {
        id: stockId,
      },
    },
  });

  if (!stock) {
    return res.status(404).json({
      ServerMessage: { message: 'Estoque não encontrado' },
    });
  }

  await removalStockMovement({
    stockId,
    companyId,
    stockItemId: stock.stockItem.id,
    previousBalance: previousStock.quantity,
    createdById: userId,
  });

  return res.status(200).json({
    stock,
    ServerMessage: {
      message: `Estoque ${stock.stockItem.name} do edifício ${stock.building.name} foi deletado com sucesso!`,
    },
  });
}
