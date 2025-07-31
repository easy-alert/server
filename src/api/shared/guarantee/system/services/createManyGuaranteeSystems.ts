import { prisma, prismaTypes } from '../../../../../../prisma';

interface ICreateManyGuaranteeSystem {
  data: prismaTypes.GuaranteeSystemCreateManyArgs;
}

export async function createManyGuaranteeSystems<T>({
  data,
}: ICreateManyGuaranteeSystem): Promise<T | null> {
  return prisma.guaranteeSystem.createMany(data) as Promise<T | null>;
}
