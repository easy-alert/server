import { prisma, prismaTypes } from '../../../../../../prisma';

interface IFindFirstGuarantee {
  data: prismaTypes.GuaranteeFindFirstArgs;
}

export async function findFirstGuarantee<T>({ data }: IFindFirstGuarantee): Promise<T | null> {
  return prisma.guarantee.findFirst(data) as Promise<T | null>;
}
