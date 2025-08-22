import { prisma } from '../../../../../prisma';

export async function listStockItems({
  companyId,
  buildingId,
}: {
  companyId: string;
  buildingId?: string;
}) {
  return prisma.stockItem.findMany({
    select: {
      id: true,
      name: true,
    },

    where: {
      OR: [
        {
          companyId,
        },

        {
          buildingId,
        },
      ],
    },

    orderBy: {
      name: 'asc',
    },
  });
}
