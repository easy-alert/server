import { prisma, prismaTypes } from '../../../../../../prisma';

interface IDeleteGuaranteeSystem {
  data: prismaTypes.GuaranteeSystemDeleteArgs;
}

export async function deleteGuaranteeSystem<T>({
  data,
}: IDeleteGuaranteeSystem): Promise<T | null> {
  return prisma.guaranteeSystem.delete(data) as unknown as Promise<T | null>;
}
