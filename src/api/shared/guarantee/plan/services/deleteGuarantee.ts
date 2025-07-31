import { prisma, prismaTypes } from '../../../../../../prisma';

interface IDeleteGuarantee {
  data: prismaTypes.GuaranteeDeleteArgs;
}

export async function deleteGuarantee<T>({ data }: IDeleteGuarantee): Promise<T | null> {
  return prisma.guarantee.delete(data) as unknown as Promise<T | null>;
}
