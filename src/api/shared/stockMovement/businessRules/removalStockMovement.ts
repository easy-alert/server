import { createStockMovement } from '../services/createStockMovement';

interface ICreateFirstStockMovement {
  stockId: string;
  companyId: string;
  stockItemId: string;
  previousBalance: number;
  createdById: string;
}

export async function removalStockMovement({
  stockId,
  companyId,
  stockItemId,
  previousBalance,
  createdById,
}: ICreateFirstStockMovement) {
  const stockMovement = await createStockMovement({
    data: {
      data: {
        quantity: previousBalance,
        previousBalance,
        newBalance: 0,
        movementType: 'REMOVAL',
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
