import { prisma, prismaTypes } from '../../../../../prisma';

interface ICountStockItems {
  data: prismaTypes.StockItemCountArgs;
}

export async function countStockItems<T>({ data }: ICountStockItems): Promise<T | null> {
  return prisma.stockItem.count(data) as Promise<T | null>;
}
