import { prisma } from '../../../../../utils/prismaClient';
// TYPES
import { ICreateCategory } from './types';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export class SharedCategoryServices {
  async create({ name, ownerCompanyId }: ICreateCategory) {
    return prisma.category.create({
      data: {
        name,
        ownerCompanyId,
      },
    });
  }

  async edit({
    name,
    categoryId,
  }: {
    name: string;
    categoryId: string;
    ownerCompanyId: string;
  }) {
    await this.findById({ categoryId });

    return prisma.category.update({
      data: { name },
      where: {
        id: categoryId,
      },
    });
  }

  async findById({ categoryId }: { categoryId: string }) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    validator.needExist([{ label: 'categoria', variable: category }]);

    return category;
  }
}
