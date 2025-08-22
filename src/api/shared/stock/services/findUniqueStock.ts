import { prisma, prismaTypes } from '../../../../../prisma';

interface IFindUniqueStock {
  data: prismaTypes.StockFindUniqueArgs;
}

export async function findUniqueStock<T>({ data }: IFindUniqueStock): Promise<T | null> {
  return prisma.stock.findUnique(data) as Promise<T | null>;
}
