import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateStockItemType {
  data: prismaTypes.StockItemTypeUpdateArgs;
}

export async function updateStockItemType<T>({ data }: IUpdateStockItemType): Promise<T | null> {
  const result = await prisma.stockItemType.update(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
