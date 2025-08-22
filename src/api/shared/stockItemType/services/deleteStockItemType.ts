import { prisma, prismaTypes } from '../../../../../prisma';

interface IDeleteStockItemType {
  data: prismaTypes.StockItemTypeDeleteArgs;
}

export async function deleteStockItemType<T>({ data }: IDeleteStockItemType): Promise<T | null> {
  const result = await prisma.stockItemType.delete(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
