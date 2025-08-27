import { prisma, prismaTypes } from '../../../../../prisma';

interface ICreateStockItemType {
  data: prismaTypes.StockItemTypeCreateArgs;
}

export async function createStockItemType<T>({ data }: ICreateStockItemType): Promise<T | null> {
  const result = await prisma.stockItemType.create(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
