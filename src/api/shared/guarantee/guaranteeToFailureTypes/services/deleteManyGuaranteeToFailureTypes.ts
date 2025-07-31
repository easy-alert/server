import { prisma, prismaTypes } from '../../../../../../prisma';

interface IDeleteManyGuaranteeToFailureTypes {
  data: prismaTypes.GuaranteeToFailureTypeDeleteManyArgs;
}

export async function deleteManyGuaranteeToFailureTypes<T>({
  data,
}: IDeleteManyGuaranteeToFailureTypes): Promise<T | null> {
  return prisma.guaranteeToFailureType.deleteMany(data) as unknown as Promise<T | null>;
}
