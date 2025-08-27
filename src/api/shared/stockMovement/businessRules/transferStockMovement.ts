import type { StockMovementType } from '@prisma/client';

import { findUniqueStock } from '../../stock/services/findUniqueStock';
import { updateStock } from '../../stock/services/updateStock';
import { createStockMovement } from '../services/createStockMovement';

interface ITransferStockMovement {
  stockId: string;
  companyId: string;
  transferToId: string;
  lastUpdatedById: string;
  movementType: StockMovementType;
  quantity: number;
  notes?: string;
}

interface StockOutput {
  id: string;
  stockItemId: string;
  buildingId: string;
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

export async function transferStockMovement({
  companyId,
  stockId,
  transferToId,
  lastUpdatedById,
  movementType,
  quantity,
  notes,
}: ITransferStockMovement) {
  const previousOriginStock = await findUniqueStock<StockOutput>({
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

  const previousStockItemId = previousOriginStock?.stockItemId;

  if (!previousOriginStock) {
    throw new Error('Estoque de origem não encontrado');
  }

  const previousDestinationStock = await findUniqueStock<StockOutput>({
    data: {
      select: {
        id: true,
        stockItemId: true,
        quantity: true,
      },

      where: {
        buildingId_stockItemId: {
          buildingId: transferToId,
          stockItemId: previousOriginStock.stockItemId,
        },
      },
    },
  });

  const previousDestinationStockItemId = previousDestinationStock?.stockItemId;

  if (!previousDestinationStock) {
    throw new Error('Estoque de destino não encontrado');
  }

  if (previousStockItemId !== previousDestinationStockItemId) {
    throw new Error('Estoque de origem e destino não são iguais');
  }

  const updatedOriginStock = await updateStock<StockOutput>({
    data: {
      select: {
        id: true,
        stockItemId: true,
        quantity: true,
        buildingId: true,
      },

      where: {
        id: previousOriginStock.id,
      },

      data: {
        quantity: previousOriginStock.quantity + quantity,
      },
    },
  });

  if (!updatedOriginStock) {
    throw new Error('Erro ao atualizar estoque de origem');
  }

  const originStockMovement = await createStockMovement<StockMovementOutput>({
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
        quantity,
        previousBalance: previousOriginStock.quantity,
        newBalance: updatedOriginStock.quantity,
        notes,
        movementType,
        movementDate: new Date(),

        stock: {
          connect: {
            buildingId_stockItemId: {
              buildingId: updatedOriginStock.buildingId,
              stockItemId: updatedOriginStock.stockItemId,
            },
          },
        },

        stockItem: {
          connect: {
            id: updatedOriginStock.stockItemId,
          },
        },

        company: {
          connect: {
            id: companyId,
          },
        },

        lastUpdatedBy: {
          connect: {
            id: lastUpdatedById,
          },
        },

        transferTo: {
          connect: {
            id: transferToId,
          },
        },
      },
    },
  });

  if (!originStockMovement) {
    throw new Error('Erro ao criar movimentação de origem');
  }

  const updatedDestinationStock = await updateStock<StockOutput>({
    data: {
      select: {
        id: true,
        stockItemId: true,
        quantity: true,
      },

      where: {
        id: previousDestinationStock.id,
      },

      data: {
        quantity: previousDestinationStock.quantity + quantity * -1,
      },
    },
  });

  if (!updatedDestinationStock) {
    throw new Error('Erro ao atualizar estoque de destino');
  }

  const destinationStockMovement = await createStockMovement<StockMovementOutput>({
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
        quantity,
        previousBalance: previousDestinationStock.quantity,
        newBalance: updatedDestinationStock.quantity,
        movementType: 'TRANSFER_IN',
        movementDate: new Date(),

        stock: {
          connect: {
            id: previousDestinationStock.id,
          },
        },

        stockItem: {
          connect: {
            id: previousDestinationStock.stockItemId,
          },
        },

        company: {
          connect: {
            id: companyId,
          },
        },

        lastUpdatedBy: {
          connect: {
            id: lastUpdatedById,
          },
        },
      },
    },
  });

  if (!destinationStockMovement) {
    throw new Error('Erro ao criar movimentação de destino');
  }

  return {
    updatedOriginStock,
    updatedDestinationStock,
  };
}
