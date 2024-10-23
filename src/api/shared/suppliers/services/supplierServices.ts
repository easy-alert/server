import { prisma, prismaTypes } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export interface IParsedFilter {
  search: string | undefined;
  serviceTypeLabel: string | undefined;
  state: string | undefined;
  city: string | undefined;
}

interface IFindMany {
  page: number;
  take: number;
  companyId: string;
  filter?: IParsedFilter;
}

interface IFindManyByBuildingNanoId {
  page: number;
  take: number;
  buildingNanoId: string;
  filter?: IParsedFilter;
}

class SupplierServices {
  async create(args: prismaTypes.SupplierCreateArgs) {
    return prisma.supplier.create(args);
  }

  async findMany({ page, take, companyId, filter }: IFindMany) {
    const where: prismaTypes.SupplierWhereInput = {
      companyId,
    };

    if (filter) {
      if (filter.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } },
          { phone: { contains: filter.search, mode: 'insensitive' } },
          { city: { contains: filter.search, mode: 'insensitive' } },
          { state: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      if (filter.serviceTypeLabel) {
        where.categories = {
          some: {
            category: {
              id: {
                equals: filter.serviceTypeLabel,
                mode: 'insensitive',
              },
            },
          },
        };
      }

      if (filter.state) {
        where.state = { equals: filter.state, mode: 'insensitive' };
      }

      if (filter.city) {
        where.city = { equals: filter.city, mode: 'insensitive' };
      }
    }

    const suppliers = await prisma.supplier.findMany({
      select: {
        id: true,
        email: true,
        image: true,
        phone: true,
        name: true,
        link: true,
        city: true,
        cnpj: true,
        state: true,
        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },

          orderBy: {
            category: { name: 'asc' },
          },
        },
      },
      where,

      take,
      skip: (page - 1) * take,

      orderBy: {
        name: 'asc',
      },
    });

    const suppliersCount = await prisma.supplier.count({ where });

    return { suppliers, suppliersCount };
  }

  async findManyByBuildingNanoId({
    page,
    take,
    buildingNanoId,
    filter,
  }: IFindManyByBuildingNanoId) {
    const where: prismaTypes.SupplierWhereInput = {
      company: {
        Buildings: {
          some: {
            nanoId: buildingNanoId,
          },
        },
      },
    };

    if (filter) {
      if (filter.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } },
          { phone: { contains: filter.search, mode: 'insensitive' } },
          { city: { contains: filter.search, mode: 'insensitive' } },
          { state: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      if (filter.serviceTypeLabel) {
        where.categories = {
          some: {
            category: {
              id: {
                equals: filter.serviceTypeLabel,
                mode: 'insensitive',
              },
            },
          },
        };
      }

      if (filter.state) {
        where.state = { equals: filter.state, mode: 'insensitive' };
      }

      if (filter.city) {
        where.city = { equals: filter.city, mode: 'insensitive' };
      }
    }

    const [suppliers, suppliersCount] = await prisma.$transaction([
      prisma.supplier.findMany({
        select: {
          id: true,
          email: true,
          image: true,
          phone: true,
          name: true,
          link: true,
          city: true,
          cnpj: true,
          state: true,
          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },

            orderBy: {
              category: { name: 'asc' },
            },
          },
        },
        where,

        take,
        skip: (page - 1) * take,

        orderBy: {
          name: 'asc',
        },
      }),

      prisma.supplier.count({ where }),
    ]);

    return { suppliers, suppliersCount };
  }

  async findById(id: string) {
    const supplier = await prisma.supplier.findUnique({
      select: {
        id: true,
        email: true,
        image: true,
        phone: true,
        name: true,
        link: true,
        city: true,
        cnpj: true,
        state: true,

        categories: {
          select: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },

          orderBy: {
            category: { name: 'asc' },
          },
        },

        maintenances: {
          select: {
            maintenance: {
              select: {
                id: true,
                Category: { select: { name: true } },
                element: true,
                activity: true,
              },
            },
          },
          orderBy: [
            { maintenance: { Category: { name: 'asc' } } },
            { maintenance: { element: 'asc' } },
          ],
        },

        maintenancesHistory: {
          select: { id: true },
        },
      },
      where: { id },
    });

    validator.needExist([{ label: 'Fornecedor', variable: supplier }]);

    return supplier!;
  }

  async update(args: prismaTypes.SupplierUpdateArgs) {
    await this.findById(args.where.id ?? '');

    return prisma.supplier.update(args);
  }

  async delete(id: string) {
    const supplier = await this.findById(id);

    if (supplier.maintenancesHistory.length) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Você não pode excluir um fornecedor em uso.',
      });
    }

    return prisma.supplier.delete({ where: { id } });
  }

  async findManyByMaintenanceHistoryId(maintenanceHistoryId: string) {
    return prisma.supplier.findMany({
      select: {
        image: true,
        id: true,
        name: true,
        phone: true,
        email: true,
      },
      where: {
        maintenancesHistory: {
          some: {
            maintenanceHistoryId,
          },
        },
      },

      orderBy: { name: 'asc' },
    });
  }

  async findToSelectByMaintenanceHistoryId({
    companyId,
    categoryId,
    maintenanceHistoryId,
  }: {
    maintenanceHistoryId: string;
    categoryId: string;
    companyId: string;
  }) {
    const [suggestedSuppliers, remainingSuppliers] = await prisma.$transaction([
      prisma.supplier.findMany({
        select: {
          id: true,
          name: true,

          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: {
          OR: [
            {
              maintenances: {
                some: {
                  maintenance: {
                    Category: {
                      Maintenances: {
                        some: { MaintenancesHistory: { some: { id: maintenanceHistoryId } } },
                      },
                    },
                  },
                },
              },
            },

            {
              categories: {
                some: {
                  category: {
                    id: categoryId,
                  },
                },
              },
            },
          ],

          companyId,
        },

        orderBy: { name: 'asc' },
      }),

      prisma.supplier.findMany({
        select: {
          id: true,
          name: true,

          categories: {
            select: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: {
          AND: [
            {
              maintenances: {
                none: {
                  maintenance: {
                    Category: {
                      Maintenances: {
                        some: { MaintenancesHistory: { some: { id: maintenanceHistoryId } } },
                      },
                    },
                  },
                },
              },
            },

            {
              categories: {
                none: {
                  category: {
                    id: categoryId,
                  },
                },
              },
            },
          ],

          companyId,
        },
        orderBy: { name: 'asc' },
      }),
    ]);

    return { suggestedSuppliers, remainingSuppliers };
  }

  async linkWithMaintenanceHistory({
    maintenanceHistoryId,
    supplierId,
  }: {
    maintenanceHistoryId: string;
    supplierId: string;
  }) {
    // REMOVER ISSO SE TIVER MAIS DE UM SUPPLIER POR MaintenanceHistory
    await prisma.maintenanceHistorySupplier.deleteMany({
      where: {
        maintenanceHistoryId,
      },
    });

    await prisma.maintenanceHistorySupplier.create({
      data: {
        maintenanceHistoryId,
        supplierId,
      },
    });
  }

  async findMaintenanceHistorySupplier({
    maintenanceHistoryId,
    supplierId,
  }: {
    maintenanceHistoryId: string;
    supplierId: string;
  }) {
    const maintenanceHistorySupplier = await prisma.maintenanceHistorySupplier.findUnique({
      where: {
        maintenanceHistoryId_supplierId: {
          maintenanceHistoryId,
          supplierId,
        },
      },
    });

    validator.needExist([
      { label: 'Fornecedor da manutenção', variable: maintenanceHistorySupplier },
    ]);

    return maintenanceHistorySupplier!;
  }

  async unlinkWithMaintenanceHistory({
    maintenanceHistoryId,
    supplierId,
  }: {
    maintenanceHistoryId: string;
    supplierId: string;
  }) {
    await this.findMaintenanceHistorySupplier({
      maintenanceHistoryId,
      supplierId,
    });

    await prisma.maintenanceHistorySupplier.delete({
      where: {
        maintenanceHistoryId_supplierId: {
          maintenanceHistoryId,
          supplierId,
        },
      },
    });
  }

  async linkSuggestedSupplier({
    maintenanceId,
    supplierId,
  }: {
    maintenanceId: string;
    supplierId: string;
  }) {
    return prisma.maintenanceSupplier.upsert({
      create: {
        maintenanceId,
        supplierId,
      },
      update: {},
      where: {
        maintenanceId_supplierId: {
          maintenanceId,
          supplierId,
        },
      },
      select: {
        supplier: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findMaintenanceSuggestedSupplier({
    maintenanceId,
    supplierId,
  }: {
    maintenanceId: string;
    supplierId: string;
  }) {
    const maintenanceSuggestedSupplier = await prisma.maintenanceSupplier.findUnique({
      where: {
        maintenanceId_supplierId: {
          maintenanceId,
          supplierId,
        },
      },
    });

    validator.needExist([{ label: 'Fornecedor sugerido', variable: maintenanceSuggestedSupplier }]);

    return maintenanceSuggestedSupplier!;
  }

  async unlinkWithMaintenance({
    maintenanceId,
    supplierId,
  }: {
    maintenanceId: string;
    supplierId: string;
  }) {
    await this.findMaintenanceSuggestedSupplier({
      maintenanceId,
      supplierId,
    });

    await prisma.maintenanceSupplier.delete({
      where: {
        maintenanceId_supplierId: {
          maintenanceId,
          supplierId,
        },
      },
    });
  }

  async findMaintenanceHistory({ supplierId }: { supplierId: string }) {
    return prisma.maintenanceHistory.findMany({
      select: {
        id: true,
        notificationDate: true,
        resolutionDate: true,
        inProgress: true,
        dueDate: true,

        MaintenanceReport: {
          select: {
            observation: true,
            cost: true,

            ReportAnnexes: {
              select: {
                url: true,
                name: true,
              },
            },

            ReportImages: {
              select: {
                url: true,
              },
            },
          },
        },
        MaintenancesStatus: {
          select: {
            name: true,
          },
        },

        Building: {
          select: {
            name: true,
          },
        },
        Maintenance: {
          select: {
            element: true,
            activity: true,
            Category: {
              select: {
                name: true,
              },
            },
            source: true,
            responsible: true,
            observation: true,
            MaintenanceType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { notificationDate: 'desc' },
      where: {
        suppliers: { some: { supplierId } },
      },
    });
  }
}

export const supplierServices = new SupplierServices();
