// #region IMPORTS
import { prisma, prismaTypes } from '../../../../../../prisma';

// TYPES
import { ICreateBuilding, IEditBuilding, IListBuildings, IListMaintenances } from './types';

// // CLASS
import { Validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

const validator = new Validator();

// #endregion

export class BuildingServices {
  async create({ data }: ICreateBuilding) {
    return prisma.building.create({
      data,
      include: {
        Company: {
          select: {
            name: true,
          },
        },
      },
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
        Company: true,
        UserBuildingsPermissions: true,
      },

      where: {
        id: buildingId,
      },
    });

    validator.needExist([{ label: 'Edificação', variable: building }]);

    return building!;
  }

  async findByMaintenanceHistoryId({ maintenanceHistoryId }: { maintenanceHistoryId: string }) {
    const building = await prisma.building.findFirst({
      where: {
        MaintenancesHistory: {
          some: {
            id: maintenanceHistoryId,
          },
        },
      },
    });

    validator.needExist([{ label: 'Edificação', variable: building }]);

    return building!;
  }

  async findByOldId({ oldBuildingId }: { oldBuildingId: string }) {
    const building = await prisma.oldBuildingIds.findFirst({
      select: {
        building: {
          select: {
            nanoId: true,
            NotificationsConfigurations: {
              select: {
                nanoId: true,
              },
            },
          },
        },
      },
      where: {
        oldBuildingId,
      },
    });

    validator.needExist([{ label: 'edificação', variable: building }]);

    return {
      buildingNanoId: building!.building.nanoId,
    };
  }

  async findByOldIdForSyndic({ oldBuildingId }: { oldBuildingId: string }) {
    const building = await prisma.oldBuildingIds.findFirst({
      select: {
        building: {
          select: {
            nanoId: true,
            NotificationsConfigurations: {
              select: {
                nanoId: true,
              },
            },
          },
        },
      },
      where: {
        oldBuildingId,
        building: {
          NotificationsConfigurations: {
            every: {
              isMain: true,
            },
          },
        },
      },
    });

    if (!building || !building?.building.NotificationsConfigurations.length) {
      throw new ServerMessage({
        statusCode: 404,
        message: `A informação: edificação não existe na base de dados.`,
      });
    }

    return {
      buildingNanoId: building!.building.nanoId,
      syndicNanoId: building!.building.NotificationsConfigurations[0].nanoId,
    };
  }

  async findByNanoId({ buildingNanoId }: { buildingNanoId: string }) {
    const building = await prisma.building.findFirst({
      include: {
        Company: {
          select: { ticketInfo: true, ticketType: true, canAccessTickets: true, isBlocked: true },
        },

        Banners: {
          select: {
            originalName: true,
            redirectUrl: true,
            url: true,
            id: true,
          },

          orderBy: { createdAt: 'asc' },
        },
      },

      where: {
        nanoId: buildingNanoId,

        Company: {
          isBlocked: false,
        },
      },
    });

    validator.needExist([{ label: 'edificação', variable: building }]);

    return building!;
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

  async findBuildingMaintenanceDaysToAnticipate({
    buildingId,
    maintenanceId,
  }: {
    buildingId: string;
    maintenanceId: string;
  }) {
    return prisma.buildingMaintenance.findFirst({
      select: {
        daysToAnticipate: true,
      },
      where: {
        BuildingCategory: {
          buildingId,
        },
        maintenanceId,
      },
    });
  }

  async findByName({ name, companyId }: { name: string; companyId: string }) {
    const building = await prisma.building.findFirst({
      where: {
        name,
        companyId,
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

  async list({ take = 100, page, search = '', companyId, buildingsIds }: IListBuildings) {
    const where: prismaTypes.BuildingWhereInput = {
      id: {
        in: buildingsIds,
      },

      companyId,

      NOT: {
        isBlocked: true,
      },

      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          neighborhood: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          city: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    };

    const [Buildings, buildingsCount] = await prisma.$transaction([
      prisma.building.findMany({
        select: {
          id: true,
          name: true,
          neighborhood: true,
          city: true,
          nanoId: true,

          MaintenancesHistory: {
            select: {
              wasNotified: true,

              notificationDate: true,

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

        where,

        orderBy: {
          name: 'asc',
        },

        take,
        skip: (page - 1) * take,
      }),

      prisma.building.count({
        where,
      }),
    ]);

    return { Buildings, buildingsCount };
  }

  async listDetails({ buildingId }: { buildingId: string }) {
    const Building = await prisma.building.findFirst({
      select: {
        id: true,
        nanoId: true,
        name: true,
        cep: true,
        city: true,
        state: true,
        neighborhood: true,
        streetName: true,
        area: true,
        image: true,
        deliveryDate: true,
        warrantyExpiration: true,
        keepNotificationAfterWarrantyEnds: true,
        mandatoryReportProof: true,
        syndicPassword: true,
        residentPassword: true,
        nextMaintenanceCreationBasis: true,
        isActivityLogPublic: true,
        guestCanCompleteMaintenance: true,

        Company: {
          select: {
            image: true,
          },
        },

        MaintenancesHistory: {
          select: {
            wasNotified: true,
            notificationDate: true,
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
            showContact: true,
            nanoId: true,
          },

          orderBy: [{ isMain: 'desc' }, { name: 'asc' }],
        },

        UserBuildingsPermissions: {
          select: {
            isMainContact: true,
            showContact: true,

            User: {
              select: {
                id: true,
                name: true,
                email: true,
                emailIsConfirmed: true,
                phoneNumber: true,
                phoneNumberIsConfirmed: true,
                role: true,
                isMainContact: true,
                showContact: true,
              },
            },
          },

          where: {
            buildingId,
          },

          orderBy: {
            isMainContact: 'desc',
          },
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
            originalName: true,
            redirectUrl: true,
            url: true,
            id: true,
          },
          orderBy: { createdAt: 'asc' },
        },

        BuildingFolders: {
          select: {
            BuildingFolder: {
              select: {
                id: true,
                name: true,
                Parent: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                Folders: {
                  select: {
                    id: true,
                    name: true,
                  },
                  orderBy: {
                    name: 'asc',
                  },
                },

                Files: {
                  select: {
                    id: true,
                    name: true,
                    url: true,
                  },
                  orderBy: {
                    name: 'asc',
                  },
                },
              },
            },
          },

          where: {
            BuildingFolder: {
              parentId: null,
            },
          },
        },

        BuildingApartments: {
          select: {
            id: true,
            number: true,
            floor: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
      where: {
        id: buildingId,
      },
    });

    validator.needExist([{ label: 'Edificação', variable: Building }]);

    return Building!;
  }

  async listMaintenances({ buildingId }: IListMaintenances) {
    return prisma.buildingCategory.findMany({
      include: {
        Building: {
          select: {
            id: true,
            nanoId: true,
            name: true,

            MaintenancesHistory: {
              select: {
                id: true,
              },
            },
          },
        },

        Category: {
          select: {
            id: true,
            name: true,
          },
        },

        Maintenances: {
          select: {
            daysToAnticipate: true,
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
                priorityName: true,
                instructions: { select: { name: true, url: true } },

                FrequencyTimeInterval: {
                  select: {
                    id: true,
                    name: true,
                    pluralLabel: true,
                    singularLabel: true,
                    unitTime: true,
                  },
                },

                DelayTimeInterval: {
                  select: {
                    id: true,
                    name: true,
                    pluralLabel: true,
                    singularLabel: true,
                    unitTime: true,
                  },
                },

                PeriodTimeInterval: {
                  select: {
                    id: true,
                    name: true,
                    pluralLabel: true,
                    singularLabel: true,
                    unitTime: true,
                  },
                },

                MaintenancesHistory: {
                  select: {
                    wasNotified: true,
                    notificationDate: true,
                    resolutionDate: true,
                    MaintenancesStatus: {
                      select: {
                        name: true,
                        singularLabel: true,
                      },
                    },
                  },
                  where: {
                    buildingId,
                  },
                  orderBy: {
                    createdAt: 'desc',
                  },
                },

                MaintenanceAdditionalInformation: {
                  select: {
                    information: true,
                    user: true,
                  },

                  where: {
                    buildingId,
                  },
                },
              },
            },
          },
          orderBy: {
            Maintenance: { element: 'asc' },
          },
        },
      },

      orderBy: {
        Category: {
          name: 'asc',
        },
      },
      where: {
        buildingId,
      },
    });
  }

  async listMaintenancesHistoryByBuilding({ buildingId }: { buildingId: string }) {
    return prisma.maintenanceHistory.findMany({
      select: {
        maintenanceId: true,
        Maintenance: {
          select: {
            MaintenancesHistory: {
              select: {
                wasNotified: true,
                notificationDate: true,
                resolutionDate: true,
                MaintenancesStatus: {
                  select: {
                    name: true,
                    singularLabel: true,
                  },
                },
              },
              where: {
                buildingId,
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
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
                unitTime: true,
              },
            },
            DelayTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
                unitTime: true,
              },
            },
            PeriodTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
                unitTime: true,
              },
            },
          },
        },
      },
      where: { buildingId },
    });
  }

  async listForSelect({
    permittedBuildings,
    companyId,
  }: {
    permittedBuildings?: string[];
    companyId: string;
  }) {
    return prisma.building.findMany({
      select: {
        id: true,
        name: true,
        nanoId: true,
      },
      where: {
        id: {
          in: permittedBuildings,
        },
        companyId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async listBuildingApartments({
    companyId,
    buildingId,
  }: {
    companyId: string;
    buildingId: string;
  }) {
    return prisma.buildingApartment.findMany({
      where: {
        companyId,
        buildingId,
      },
    });
  }

  async updateBuildingApartments({
    companyId,
    buildingId,
    apartments,
  }: {
    companyId: string;
    buildingId: string;
    apartments: {
      id?: string;
      number: string;
      floor?: string;
    }[];
  }) {
    await prisma.buildingApartment.deleteMany({
      where: {
        companyId,
        buildingId,
      },
    });

    await prisma.buildingApartment.createMany({
      data: apartments.map((apartment) => ({
        companyId,
        buildingId,
        number: apartment.number,
        floor: apartment.floor,
      })),
    });
  }

  async createAdminBuildingPermissions({ buildingId }: { buildingId: string }) {
    const building = await prisma.building.findUnique({
      select: {
        Company: {
          select: {
            UserCompanies: {
              select: {
                userId: true,
              },

              where: {
                owner: true,
              },
            },
          },
        },
      },

      where: {
        id: buildingId,
      },
    });

    if (!building) {
      throw new ServerMessage({
        statusCode: 404,
        message: `A informação: edificação não existe na base de dados.`,
      });
    }

    await prisma.userBuildingsPermissions.createMany({
      data: building.Company.UserCompanies.map((user) => ({
        userId: user.userId,
        buildingId,
        isMainContact: true,
        showContact: true,
      })),
    });
  }
}

export const buildingServices = new BuildingServices();
