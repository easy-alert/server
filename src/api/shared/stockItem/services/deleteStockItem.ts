import { prisma, prismaTypes } from '../../../../../prisma';

interface IDeleteStockItem {
  data: prismaTypes.StockItemDeleteArgs;
}

export async function deleteStockItem<T>({ data }: IDeleteStockItem): Promise<T | null> {
  const result = await prisma.stockItem.delete(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
