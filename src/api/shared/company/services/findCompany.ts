import { prisma } from '../../../../../prisma';

interface IFindCompany {
  buildingId: string;
}

export async function findCompany({ buildingId }: IFindCompany) {
  return prisma.company.findFirst({
    where: {
      Buildings: {
        some: {
          id: buildingId,
        },
      },
    },
  });
}
