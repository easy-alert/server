import { prisma, prismaTypes } from '../../../../../../prisma';

interface IFindManyGuarantees {
  data: prismaTypes.GuaranteeFindManyArgs;
}

export async function findManyGuarantees<T>({ data }: IFindManyGuarantees): Promise<T | null> {
  return prisma.guarantee.findMany(data) as Promise<T | null>;
}
