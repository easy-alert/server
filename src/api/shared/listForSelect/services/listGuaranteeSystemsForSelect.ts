import { prisma } from '../../../../../prisma';

interface IListGuaranteeSystemsForSelect {
  companyId?: string;
  systemsIds?: string[];
}

export async function listGuaranteeSystemsForSelect({
  companyId,
  systemsIds,
}: IListGuaranteeSystemsForSelect) {
  return prisma.guaranteeSystem.findMany({
    select: {
      id: true,
      name: true,
    },

    where: {
      companyId,

      AND: {
        id: {
          in: systemsIds,
        },
      },
    },

    orderBy: {
      name: 'asc',
    },
  });
}
