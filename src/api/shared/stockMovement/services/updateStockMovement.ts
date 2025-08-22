import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateStockMovement {
  data: prismaTypes.StockMovementUpdateArgs;
}

export async function updateStockMovement<T>({ data }: IUpdateStockMovement): Promise<T | null> {
  const result = await prisma.stockMovement.update(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
