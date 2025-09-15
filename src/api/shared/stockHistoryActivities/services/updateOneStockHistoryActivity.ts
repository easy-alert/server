import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateOneStockHistoryActivityInput {
  stockHistoryActivityId: string;
  data: prismaTypes.StockHistoryActivitiesUpdateArgs['data'];
}

export async function updateOneStockHistoryActivity({
  stockHistoryActivityId,
  data,
}: IUpdateOneStockHistoryActivityInput) {
  const stockHistoryActivity = await prisma.stockHistoryActivities.update({
    where: {
      id: stockHistoryActivityId,
    },

    data,
  });

  return { stockHistoryActivity };
}
