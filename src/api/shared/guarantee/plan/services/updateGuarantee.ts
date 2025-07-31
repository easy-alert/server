import { prisma, prismaTypes } from '../../../../../../prisma';

interface IUpdateGuarantee {
  data: prismaTypes.GuaranteeUpdateArgs;
}

export async function updateGuarantee<T>({ data }: IUpdateGuarantee): Promise<T | null> {
  return prisma.guarantee.update(data) as unknown as Promise<T | null>;
}
