import { prisma, prismaTypes } from '../../../../../../prisma';

interface IFindUniqueGuarantee {
  data: prismaTypes.GuaranteeFindUniqueArgs;
}

export async function findUniqueGuarantee<T>({ data }: IFindUniqueGuarantee): Promise<T | null> {
  return prisma.guarantee.findUnique(data) as Promise<T | null>;
}
