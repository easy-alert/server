import { prisma, prismaTypes } from '../../../../../prisma';
import { capitalizeFirstLetter, unmask } from '../../../../utils/dataHandler';
import { checkValues } from '../../../../utils/newValidator';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

interface IFindMany {
  page: number;
  take: number;
  search?: string;
  companyId: string;
}

interface IFindManyByBuildingNanoId {
  page: number;
  take: number;
  search?: string;
  buildingNanoId: string;
}

interface ICreateOrConnectServiceTypesService {
  serviceTypeLabels: string[] | undefined;
  isUpdate: boolean;
}

class SupplierServices {
  async create(args: prismaTypes.SupplierCreateArgs) {
    return prisma.supplier.create(args);
  }

  async findMany({ page, take, search = '', companyId }: IFindMany) {
    const where: prismaTypes.SupplierWhereInput = {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: unmask(search),
            mode: 'insensitive',
          },
        },
        {
          state: {
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
        {
          serviceTypes: {
            some: {
              type: {
                label: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      ],

      companyId,
    };

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
          serviceTypes: {
            select: {
              type: {
                select: {
                  label: true,
                },
              },
            },
            orderBy: {
              type: { label: 'asc' },
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

  async findManyByBuildingNanoId({
    page,
    take,
    search = '',
    buildingNanoId,
  }: IFindManyByBuildingNanoId) {
    const where: prismaTypes.SupplierWhereInput = {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: unmask(search),
            mode: 'insensitive',
          },
        },
        {
          state: {
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
        {
          serviceTypes: {
            some: {
              type: {
                label: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      ],

      company: {
        Buildings: {
          some: {
            nanoId: buildingNanoId,
          },
        },
      },
    };

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
          serviceTypes: {
            select: {
              type: {
                select: {
                  label: true,
                },
              },
            },
            orderBy: {
              type: { label: 'asc' },
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
        serviceTypes: {
          select: {
            type: {
              select: {
                label: true,
              },
            },
          },
          orderBy: {
            type: { label: 'asc' },
          },
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
    await this.findById(id);

    return prisma.supplier.delete({ where: { id } });
  }

  createOrConnectServiceTypesService({
    serviceTypeLabels,
    isUpdate,
  }: ICreateOrConnectServiceTypesService) {
    serviceTypeLabels?.forEach((tag) => {
      checkValues([{ label: 'Tag', type: 'string', value: tag }]);
    });

    const uniqueLabels = [...new Set(serviceTypeLabels)].map((label) =>
      capitalizeFirstLetter(label.trim()),
    );

    const serviceTypes = {
      create: uniqueLabels.map((label) => ({
        type: { connectOrCreate: { create: { label }, where: { label } } },
      })),
    };

    if (isUpdate) {
      return { serviceTypes: { deleteMany: {}, ...serviceTypes } };
    }

    return { serviceTypes };
  }

  async findManyByMaintenanceHistoryId(maintenanceHistoryId: string) {
    return prisma.supplier.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        serviceTypes: {
          select: {
            type: {
              select: {
                label: true,
              },
            },
          },
          orderBy: {
            type: { label: 'asc' },
          },
        },
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

  async findToSelectByMaintenanceHistoryId(maintenanceHistoryId: string) {
    const [suggestedSuppliers, remainingSuppliers] = await prisma.$transaction([
      prisma.supplier.findMany({
        select: {
          id: true,
          name: true,
          serviceTypes: {
            select: {
              type: {
                select: {
                  label: true,
                },
              },
            },
            orderBy: {
              type: { label: 'asc' },
            },
          },
        },
        where: {
          maintenances: {
            some: { maintenance: { MaintenancesHistory: { some: { id: maintenanceHistoryId } } } },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.supplier.findMany({
        select: {
          id: true,
          name: true,
          serviceTypes: {
            select: {
              type: {
                select: {
                  label: true,
                },
              },
            },
            orderBy: {
              type: { label: 'asc' },
            },
          },
        },
        where: {
          maintenances: {
            none: { maintenance: { MaintenancesHistory: { some: { id: maintenanceHistoryId } } } },
          },
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
    await prisma.maintenanceSupplier.upsert({
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
    });
  }
}

export const supplierServices = new SupplierServices();
