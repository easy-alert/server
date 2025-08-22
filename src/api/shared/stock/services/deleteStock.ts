import { prisma, prismaTypes } from '../../../../../prisma';

interface IDeleteStock {
  data: prismaTypes.StockDeleteArgs;
}

export async function deleteStock<T>({ data }: IDeleteStock): Promise<T | null> {
  const result = await prisma.stock.delete(data);

  if (!result) {
    return null;
  }

  return result as T | null;
}
