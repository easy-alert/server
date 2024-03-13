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

        regions: {
          select: {
            id: true,
            type: true,
            cities: { select: { city: true }, orderBy: { city: 'asc' } },
            states: { select: { state: true }, orderBy: { state: 'asc' } },
          },
          orderBy: {
            createdAt: 'asc',
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

  async createRegion(args: prismaTypes.SupplierRegionCreateArgs) {
    await this.findById(args.data.supplierId ?? '');

    await prisma.supplierRegion.create(args);
  }

  async findRegionById(id: string) {
    const region = await prisma.supplierRegion.findUnique({ where: { id } });

    validator.needExist([{ label: 'Fornecedor', variable: region }]);

    return region!;
  }

  async deleteRegion(id: string) {
    await this.findRegionById(id);

    return prisma.supplierRegion.delete({ where: { id } });
  }

  async updateRegion(args: prismaTypes.SupplierRegionUpdateArgs) {
    await this.findRegionById(args.where.id ?? '');

    return prisma.supplierRegion.update(args);
  }
}

export const supplierServices = new SupplierServices();
