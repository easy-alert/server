import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindFirstStockItem {
  data: prismaTypes.StockItemFindFirstArgs;
}

export async function findFirstStockItem<T>({ data }: IFindFirstStockItem): Promise<T | null> {
  return prisma.stockItem.findFirst(data) as Promise<T | null>;
}
