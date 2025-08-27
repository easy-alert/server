import { prisma } from '../../../../../prisma';

export async function listStockItemTypes({
  companyId,
  buildingId,
}: {
  companyId: string;
  buildingId?: string;
}) {
  return prisma.stockItemType.findMany({
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
