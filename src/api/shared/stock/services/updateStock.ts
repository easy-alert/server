import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateStock {
  data: prismaTypes.StockUpdateArgs;
}

export async function updateStock<T>({ data }: IUpdateStock): Promise<T | null> {
  const result = await prisma.stock.update(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
