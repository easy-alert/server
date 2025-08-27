import type { Request, Response } from 'express';
import type { StockMovementType } from '@prisma/client';

import { createStockMovement } from '../services/createStockMovement';
import { findUniqueStock } from '../../stock/services/findUniqueStock';

import { transferStockMovement } from '../businessRules/transferStockMovement';

import { checkValues } from '../../../../utils/newValidator';
import { updateStock } from '../../stock/services/updateStock';

interface StockMovementInput {
  movementType: StockMovementType;
  stockId: string;
  quantity: string;
  transferToId?: string;
  notes?: string;
}

interface StockOutput {
  id: string;
  stockItemId: string;
  quantity: number;
}

interface StockMovementOutput {
  movementType: string;
  movementDate: Date;

  lastUpdatedBy: {
    id: string;
    name: string;
  };
}

export async function createStockMovementsController(req: Request, res: Response) {
  const { companyId, userId } = req;
  const { movementType, stockId, quantity, transferToId, notes } = req.body as StockMovementInput;

  const quantityNumber = Number(quantity);

  checkValues([
    { label: 'ID da empresa', type: 'string', value: companyId, required: true },
    { label: 'Tipo de movimentação', type: 'string', value: movementType, required: true },
    { label: 'ID do estoque', type: 'string', value: stockId, required: true },
    { label: 'Quantidade', type: 'int', value: quantityNumber, required: true },
    { label: 'Transferência para', type: 'string', value: transferToId, required: false },
    { label: 'Observações', type: 'string', value: notes, required: false },
  ]);

  if (movementType === 'TRANSFER_OUT' && transferToId) {
    try {
      await transferStockMovement({
        companyId,
        stockId,
        transferToId,
        lastUpdatedById: userId,
        movementType,
        quantity: quantityNumber,
        notes,
      });

      return res.status(200).json({
        message: 'Movimentação de transferência criada com sucesso',
      });
    } catch (error: any) {
      return res.status(500).json({
        error: error.message || 'Erro ao criar movimentação de transferência',
      });
    }
  }

  const previousStock = await findUniqueStock<StockOutput>({
    data: {
      select: {
        id: true,
        stockItemId: true,
        quantity: true,
      },

      where: {
        id: stockId,
      },
    },
  });

  if (!previousStock) {
    return res.status(404).json({
      error: 'Estoque não encontrado',
    });
  }

  const updatedStock = await updateStock<StockOutput>({
    data: {
      select: {
        id: true,
        stockItemId: true,
        quantity: true,
      },

      where: {
        id: stockId,
      },

      data: {
        quantity: previousStock.quantity + quantityNumber,
      },
    },
  });

  if (!updatedStock) {
    return res.status(404).json({
      error: 'Erro ao atualizar estoque',
    });
  }

  const stockMovement = await createStockMovement<StockMovementOutput>({
    data: {
      select: {
        movementType: true,
        movementDate: true,

        lastUpdatedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      data: {
        quantity: quantityNumber,
        previousBalance: previousStock.quantity,
        newBalance: updatedStock.quantity,
        notes,
        movementType,
        movementDate: new Date(),

        stock: {
          connect: {
            id: stockId,
          },
        },

        stockItem: {
          connect: {
            id: previousStock.stockItemId,
          },
        },

        company: {
          connect: {
            id: companyId,
          },
        },

        lastUpdatedBy: {
          connect: {
            id: userId,
          },
        },

        ...(transferToId && {
          transferTo: {
            connect: {
              id: transferToId,
            },
          },
        }),
      },
    },
  });

  if (!stockMovement) {
    return res.status(404).json({
      error: 'Movimentação não encontrada',
    });
  }

  return res.status(200).json({
    stockMovement,
  });
}
