import { prisma } from '../../../../../prisma';

interface IFindMany {
  buildingNanoId: string;
  page?: number;
  take?: number;
}

class ServiceTypesService {
  async findMany({ buildingNanoId, page, take }: IFindMany) {
    const serviceTypes = await prisma.serviceType.findMany({
      select: {
        id: true,
        name: true,
        label: true,
        singularLabel: true,
        pluralLabel: true,
        color: true,
        backgroundColor: true,
      },

      skip: page && take ? (page - 1) * take : 0,
      take: take || 10,

      where: {
        tickets: {
          some: {
            ticket: {
              building: {
                nanoId: buildingNanoId,
              },
            },
          },
        },
      },
    });

    return serviceTypes;
  }
}

export const serviceTypesServices = new ServiceTypesService();
