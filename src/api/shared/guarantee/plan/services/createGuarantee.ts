import { prisma, prismaTypes } from '../../../../../../prisma';

interface ICreateGuarantee {
  data: prismaTypes.GuaranteeCreateArgs;
}

export async function createGuarantee<T>({ data }: ICreateGuarantee): Promise<T | null> {
  return prisma.guarantee.create(data) as unknown as Promise<T | null>;
}
