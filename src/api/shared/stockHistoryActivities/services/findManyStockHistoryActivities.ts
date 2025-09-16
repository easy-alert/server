import { prisma } from '../../../../../prisma';

export async function findManyStockHistoryActivities(stockId: string) {
  const stockActivities = await prisma.stockHistoryActivities.findMany({
    where: {
      stockId,
    },

    include: {
      images: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return { stockActivities };
}
