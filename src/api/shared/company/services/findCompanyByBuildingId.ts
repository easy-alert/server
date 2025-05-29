import { prisma } from '../../../../../prisma';

interface IFindCompanyByBuildingId {
  buildingId: string;
}

export async function findCompanyByBuildingId({ buildingId }: IFindCompanyByBuildingId) {
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
