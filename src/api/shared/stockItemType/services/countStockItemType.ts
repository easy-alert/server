import { prisma, prismaTypes } from '../../../../../prisma';

interface ICountStockItemType {
  data: prismaTypes.StockItemTypeCountArgs;
}

export async function countStockItemType<T>({ data }: ICountStockItemType): Promise<T | null> {
  return prisma.stockItemType.count(data) as Promise<T | null>;
}
