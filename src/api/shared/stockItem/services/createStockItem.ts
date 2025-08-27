import { prisma, prismaTypes } from '../../../../../prisma';

interface ICreateStockItem {
  data: prismaTypes.StockItemCreateArgs;
}

export async function createStockItem<T>({ data }: ICreateStockItem): Promise<T | null> {
  const result = await prisma.stockItem.create(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
