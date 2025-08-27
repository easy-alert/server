import { prisma } from '../../../../../prisma';

export async function listStockTransfersForSelect({
  companyId,
  stockItemId,
}: {
  companyId: string;
  stockItemId: string;
}) {
  return prisma.stock.findMany({
    select: {
      id: true,

      building: {
        select: {
          id: true,
          name: true,
        },
      },

      stockItem: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    where: {
      isActive: true,

      building: {
        companyId,
      },

      stockItem: {
        id: stockItemId,
      },
    },

    orderBy: {
      building: {
        name: 'asc',
      },
    },
  });
}
