import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindManyStockItemType {
  data: prismaTypes.StockItemTypeFindManyArgs;
}

export async function findManyStockItemType<T>({
  data,
}: IFindManyStockItemType): Promise<T | null> {
  return prisma.stockItemType.findMany(data) as Promise<T | null>;
}
