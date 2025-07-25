import { prisma, prismaTypes } from '../../../../../../prisma';

interface IUpdateGuaranteeSystem {
  data: prismaTypes.GuaranteeSystemUpdateArgs;
}

export async function updateGuaranteeSystem<T>({
  data,
}: IUpdateGuaranteeSystem): Promise<T | null> {
  return prisma.guaranteeSystem.update(data) as unknown as Promise<T | null>;
}
