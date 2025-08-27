import { prisma, prismaTypes } from '../../../../../prisma';

interface ICreateStock {
  data: prismaTypes.StockCreateArgs;
}

export async function createStock<T>({ data }: ICreateStock): Promise<T | null> {
  const result = await prisma.stock.create(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
