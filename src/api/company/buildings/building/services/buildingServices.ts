// #region IMPORTS
import { prisma } from '../../../../../../prisma';

// TYPES
import { ICreateBuilding, IEditBuilding, IListBuildings, IListMaintenances } from './types';

// // CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

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
      include: {
        Banners: true,
      },
      where: {
        id: buildingId,
      },
    });

    validator.needExist([{ label: 'edificação', variable: building }]);

    return building;
  }

  async findMaintenancesPerBuilding({ buildingId }: { buildingId: string }) {
    const buildingMaintenance = await prisma.buildingMaintenance.findFirst({
      where: {
        BuildingCategory: {
          buildingId,
        },
      },
    });

    if (buildingMaintenance) {
      throw new ServerMessage({
        statusCode: 400,
        message: `Você não pode excluir uma edificação em uso.`,
      });
    }
  }

  async findByName({ name }: { name: string }) {
    const building = await prisma.building.findFirst({
      where: {
        name,
      },
    });

    validator.cannotExists([
      {
        label: 'Nome da edificação',
        variable: building,
      },
    ]);
  }

  async findByNameForEdit({ name, buildingId }: { name: string; buildingId: string }) {
    const building = await prisma.building.findFirst({
      where: {
        name,
        NOT: {
          id: buildingId,
        },
      },
    });

    validator.cannotExists([
      {
        label: 'Nome da edificação',
        variable: building,
      },
    ]);
  }

  async list({ take = 20, page, search = '', companyId }: IListBuildings) {
    const [Buildings, buildingsCount] = await prisma.$transaction([
      prisma.building.findMany({
        select: {
          id: true,
          name: true,
          neighborhood: true,
          city: true,

          MaintenancesHistory: {
            select: {
              wasNotified: true,
              MaintenancesStatus: {
                select: {
                  name: true,
                  pluralLabel: true,
                  singularLabel: true,
                },
              },
            },
          },
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
    const Building = await prisma.building.findFirst({
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
        MaintenancesHistory: {
          select: {
            wasNotified: true,
            MaintenancesStatus: {
              select: {
                name: true,
                pluralLabel: true,
                singularLabel: true,
              },
            },
          },
        },
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
            originalName: true,
            url: true,
          },
        },
        Banners: {
          select: {
            bannerName: true,
            originalName: true,
            redirectUrl: true,
            type: true,
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
