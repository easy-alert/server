import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindManyStockItem {
  data: prismaTypes.StockItemFindManyArgs;
}

export async function findManyStockItem<T>({ data }: IFindManyStockItem): Promise<T | null> {
  return prisma.stockItem.findMany(data) as Promise<T | null>;
}
