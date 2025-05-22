import { prisma } from '../../../../../prisma';

interface IGetCompanyLastServiceOrder {
  companyId: string;
}

export async function getCompanyLastServiceOrder({ companyId }: IGetCompanyLastServiceOrder) {
  const lastServiceOrder = await prisma.maintenanceHistory.findFirst({
    select: {
      serviceOrderNumber: true,
    },

    where: {
      ownerCompanyId: companyId,
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return lastServiceOrder?.serviceOrderNumber ?? 0;
}
