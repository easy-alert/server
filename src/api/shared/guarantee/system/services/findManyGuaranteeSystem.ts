import { prisma, prismaTypes } from '../../../../../../prisma';

interface IFindManyGuaranteeSystem {
  data: prismaTypes.GuaranteeSystemFindManyArgs;
}

export async function findManyGuaranteeSystem<T>({
  data,
}: IFindManyGuaranteeSystem): Promise<T | null> {
  return prisma.guaranteeSystem.findMany(data) as Promise<T | null>;
}
