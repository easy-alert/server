import { prisma, prismaTypes } from '../../../../../../prisma';

interface IFindFirstGuaranteeSystem {
  data: prismaTypes.GuaranteeSystemFindFirstArgs;
}

export async function findFirstGuaranteeSystem<T>({
  data,
}: IFindFirstGuaranteeSystem): Promise<T | null> {
  return prisma.guaranteeSystem.findFirst(data) as Promise<T | null>;
}
