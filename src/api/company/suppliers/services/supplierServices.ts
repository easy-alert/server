import { prisma, prismaTypes } from '../../../../../prisma';
import { unmask } from '../../../../utils/dataHandler';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

interface IFindMany {
  page: number;
  take: number;
  search?: string;
}

class SupplierServices {
  async create(args: prismaTypes.SupplierCreateArgs) {
    return prisma.supplier.create(args);
  }

  async findMany({ page, take, search = '' }: IFindMany) {
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
}

export const supplierServices = new SupplierServices();
