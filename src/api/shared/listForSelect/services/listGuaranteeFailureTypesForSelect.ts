import { prisma } from '../../../../../prisma';

interface IListGuaranteeFailureTypesForSelect {
  companyId?: string;
  failureTypesIds?: string[];
}

export async function listGuaranteeFailureTypesForSelect({
  companyId,
  failureTypesIds,
}: IListGuaranteeFailureTypesForSelect) {
  return prisma.guaranteeFailureType.findMany({
    select: {
      id: true,
      name: true,
    },

    where: {
      companyId,

      AND: {
        id: {
          in: failureTypesIds,
        },
      },
    },

    orderBy: {
      name: 'asc',
    },
  });
}
