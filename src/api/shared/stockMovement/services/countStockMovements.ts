import { prisma, prismaTypes } from '../../../../../prisma';

interface ICountStockMovements {
  data: prismaTypes.StockMovementCountArgs;
}

export async function countStockMovements<T>({ data }: ICountStockMovements): Promise<T | null> {
  return prisma.stockMovement.count(data) as Promise<T | null>;
}
