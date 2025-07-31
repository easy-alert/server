import { prisma, prismaTypes } from '../../../../../../prisma';

interface ICreateGuaranteeSystem {
  data: prismaTypes.GuaranteeSystemCreateArgs;
}

export async function createGuaranteeSystem<T>({
  data,
}: ICreateGuaranteeSystem): Promise<T | null> {
  return prisma.guaranteeSystem.create(data) as unknown as Promise<T | null>;
}
