import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindFirstStockItemType {
  data: prismaTypes.StockItemTypeFindFirstArgs;
}

export async function findFirstStockItemType<T>({
  data,
}: IFindFirstStockItemType): Promise<T | null> {
  return prisma.stockItemType.findFirst(data) as Promise<T | null>;
}
