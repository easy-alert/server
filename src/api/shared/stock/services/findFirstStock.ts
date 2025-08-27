import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindFirstStock {
  data: prismaTypes.StockFindFirstArgs;
}

export async function findFirstStock<T>({ data }: IFindFirstStock): Promise<T | null> {
  return prisma.stock.findFirst(data) as Promise<T | null>;
}
