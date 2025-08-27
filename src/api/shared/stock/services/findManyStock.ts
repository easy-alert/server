import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindManyStock {
  data: prismaTypes.StockFindManyArgs;
}

export async function findManyStock<T>({ data }: IFindManyStock): Promise<T | null> {
  return prisma.stock.findMany(data) as Promise<T | null>;
}
