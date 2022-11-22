// #region IMPORTS
import { prisma } from '../../../../../../prisma';

// TYPES
import { ICreateBuilding, IEditBuilding, IListBuildings, IListMaintenances } from './types';

// // CLASS
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

// #endregion

export class BuildingServices {
  async create({ data }: ICreateBuilding) {
    await prisma.building.create({
      data,
    });
  }

  async edit({ buildingId, data }: IEditBuilding) {
    await prisma.building.update({
      data,
      where: {
        id: buildingId,
      },
    });
  }

  async delete({ buildingId }: { buildingId: string }) {
    await prisma.building.delete({
      where: {
        id: buildingId,
      },
    });
  }

  async findById({ buildingId }: { buildingId: string }) {
    const building = await prisma.building.findUnique({
      where: {
        id: buildingId,
      },
    });

    validator.needExist([{ label: 'Edificação', variable: building }]);

    return building;
  }

  async list({ take = 20, page, search = '', companyId }: IListBuildings) {
    const [Buildings, buildingsCount] = await prisma.$transaction([
      prisma.building.findMany({
        select: {
          id: true,
          name: true,
          neighborhood: true,
          city: true,
        },
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
          companyId,
        },
        orderBy: {
          name: 'asc',
        },

        take,
        skip: (page - 1) * take,
      }),

      prisma.building.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
          companyId,
        },
      }),
    ]);

    return { Buildings, buildingsCount };
  }

  async listDetails({ buildingId }: { buildingId: string }) {
    const Building = await prisma.building.findUnique({
      select: {
        id: true,
        name: true,
        cep: true,
        city: true,
        state: true,
        neighborhood: true,
        streetName: true,
        area: true,
        deliveryDate: true,
        warrantyExpiration: true,
        keepNotificationAfterWarrantyEnds: true,
        BuildingType: {
          select: {
            id: true,
            name: true,
          },
        },
        NotificationsConfigurations: {
          select: {
            id: true,
            name: true,
            email: true,
            emailIsConfirmed: true,
            contactNumber: true,
            contactNumberIsConfirmed: true,
            role: true,
            isMain: true,
          },

          orderBy: [{ isMain: 'desc' }, { name: 'asc' }],
        },
        Annexes: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
      },
      where: {
        id: buildingId,
      },
    });

    validator.needExist([{ label: 'Edificação', variable: Building }]);

    return Building;
  }

  async listMaintenances({ buildingId }: IListMaintenances) {
    return prisma.buildingCategory.findMany({
      include: {
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
        Maintenances: {
          select: {
            Maintenance: {
              select: {
                id: true,
                element: true,
                activity: true,
                frequency: true,
                delay: true,
                period: true,
                responsible: true,
                source: true,
                observation: true,
                ownerCompanyId: true,
                FrequencyTimeInterval: {
                  select: {
                    id: true,
                    name: true,
                    pluralLabel: true,
                    singularLabel: true,
                  },
                },
                DelayTimeInterval: {
                  select: {
                    id: true,
                    name: true,
                    pluralLabel: true,
                    singularLabel: true,
                  },
                },
                PeriodTimeInterval: {
                  select: {
                    id: true,
                    name: true,
                    pluralLabel: true,
                    singularLabel: true,
                  },
                },
              },
            },
          },
        },
      },

      where: {
        buildingId,
      },
    });
  }

  async listForSelect({ companyId, buildingId }: { companyId: string; buildingId: string }) {
    return prisma.building.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        companyId,
        NOT: {
          id: buildingId,
        },
      },
    });
  }
}
