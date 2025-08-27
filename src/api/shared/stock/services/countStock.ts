import { prisma, prismaTypes } from '../../../../../prisma';

interface ICountStock {
  data: prismaTypes.StockCountArgs;
}

export async function countStock<T>({ data }: ICountStock): Promise<T | null> {
  return prisma.stock.count(data) as Promise<T | null>;
}
