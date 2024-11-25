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

      orderBy: {
        label: 'asc',
      },
    });

    // Custom sorting to place 'other' label at the end
    serviceTypes.sort((a, b) => {
      if (a.label === 'Outros') return 1;
      if (b.label === 'Outros') return -1;
      return a.label.localeCompare(b.label);
    });

    return serviceTypes;
  }
}

export const serviceTypesServices = new ServiceTypesService();
