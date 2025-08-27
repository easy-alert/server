import { prisma, prismaTypes } from '../../../../../prisma';

interface ICreateStockMovement {
  data: prismaTypes.StockMovementCreateArgs;
}

export async function createStockMovement<T>({ data }: ICreateStockMovement): Promise<T | null> {
  const result = await prisma.stockMovement.create(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
