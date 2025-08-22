import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateStockItem {
  data: prismaTypes.StockItemUpdateArgs;
}

export async function updateStockItem<T>({ data }: IUpdateStockItem): Promise<T | null> {
  const result = await prisma.stockItem.update(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
