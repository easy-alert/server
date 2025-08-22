import { createStockMovement } from '../services/createStockMovement';

interface ICreateFirstStockMovement {
  stockId: string;
  companyId: string;
  stockItemId: string;
  initialBalance: number;
  createdById: string;
}

export async function createFirstStockMovement({
  stockId,
  companyId,
  stockItemId,
  initialBalance,
  createdById,
}: ICreateFirstStockMovement) {
  const stockMovement = await createStockMovement({
    data: {
      data: {
        quantity: initialBalance,
        previousBalance: 0,
        newBalance: initialBalance,
        movementType: 'REGISTRATION',
        movementDate: new Date(),

        stock: {
          connect: {
            id: stockId,
          },
        },

        company: {
          connect: {
            id: companyId,
          },
        },

        stockItem: {
          connect: {
            id: stockItemId,
          },
        },

        lastUpdatedBy: {
          connect: {
            id: createdById,
          },
        },
      },
    },
  });

  return stockMovement;
}
