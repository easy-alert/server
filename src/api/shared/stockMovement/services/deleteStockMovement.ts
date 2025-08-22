import { prisma, prismaTypes } from '../../../../../prisma';

interface IDeleteStockMovement {
  data: prismaTypes.StockMovementDeleteArgs;
}

export async function deleteStockMovement<T>({ data }: IDeleteStockMovement): Promise<T | null> {
  const result = await prisma.stockMovement.delete(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
