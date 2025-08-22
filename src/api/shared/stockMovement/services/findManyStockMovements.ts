import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindManyStockMovements {
  data: prismaTypes.StockMovementFindManyArgs;
}

export async function findManyStockMovements<T>({
  data,
}: IFindManyStockMovements): Promise<T | null> {
  return prisma.stockMovement.findMany(data) as Promise<T | null>;
}
