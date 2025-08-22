import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindUniqueStockItemType {
  data: prismaTypes.StockItemTypeFindUniqueArgs;
}

export async function findUniqueStockItemType<T>({
  data,
}: IFindUniqueStockItemType): Promise<T | null> {
  return prisma.stockItemType.findUnique(data) as Promise<T | null>;
}
