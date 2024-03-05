import { prisma, prismaTypes } from '../../../../../prisma';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

class SupplierServices {
  async create(args: prismaTypes.SupplierCreateArgs) {
    return prisma.supplier.create(args);
  }

  async findMany(search: string = '') {
    return prisma.supplier.findMany({
      select: {
        id: true,
        description: true,
        email: true,
        image: true,
        phone: true,
        name: true,
        occupationArea: true,
      },
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findById(id: string) {
    const supplier = await prisma.supplier.findUnique({
      select: {
        id: true,
        description: true,
        email: true,
        image: true,
        phone: true,
        name: true,
        occupationArea: true,
        contractedValue: true,
        link: true,
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
