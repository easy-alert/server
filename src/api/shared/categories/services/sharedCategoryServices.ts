// TYPES
import { prisma } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import { ICreateCategory } from './types';

// CLASS

const validator = new Validator();

export class SharedCategoryServices {
  async create({ name, ownerCompanyId, categoryTypeId }: ICreateCategory) {
    return prisma.category.create({
      data: {
        name,
        ownerCompanyId,
        categoryTypeId,
      },
    });
  }

  async checkCategoryIsUsed({ categoryId }: { categoryId: string }) {
    const category = await prisma.buildingCategory.findFirst({
      where: {
        categoryId,
      },
    });

    if (category) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Você não pode excluir uma categoria em uso.',
      });
    }
  }

  async edit({ name, categoryId }: { name: string; categoryId: string }) {
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

    validator.needExist([{ label: 'ID da categoria', variable: category }]);

    return category;
  }

  async findOccasionalByName({ categoryName }: { categoryName: string }) {
    return prisma.category.findFirst({
      where: {
        name: categoryName,
        CategoryType: {
          name: 'occasional',
        },
      },
    });
  }

  async listForSelect({ ownerCompanyId }: { ownerCompanyId: string }) {
    const companyCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        ownerCompanyId,
        NOT: {
          CategoryType: {
            name: 'occasional',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const defaultCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },

      where: {
        ownerCompanyId: null,
        NOT: {
          CategoryType: {
            name: 'occasional',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const categories = [...defaultCategories, ...companyCategories];

    // ordena alfabeticamente
    categories.sort((a, b) => a.name.localeCompare(b.name));

    return categories;
  }

  async listForSelectForBackoffice() {
    const defaultCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },

      where: {
        ownerCompanyId: null,
        NOT: {
          CategoryType: {
            name: 'occasional',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return defaultCategories;
  }

  async listOccasionalForSelect({ ownerCompanyId }: { ownerCompanyId: string }) {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,

        Maintenances: {
          select: {
            id: true,
            element: true,
            activity: true,
            responsible: true,
          },
        },
      },
      where: {
        OR: [
          {
            ownerCompanyId,
          },
          {
            ownerCompanyId: null,
          },
        ],
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  }

  async delete({ categoryId }: { categoryId: string }) {
    await this.findById({ categoryId });

    await prisma.category.delete({
      where: { id: categoryId },
    });
  }
}
