// TYPES
import { prisma } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import { ICreateCategory } from './types';

// CLASS

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

  async delete({ categoryId }: { categoryId: string }) {
    await this.findById({ categoryId });

    await prisma.category.delete({
      where: { id: categoryId },
    });
  } // criar logica de nao excluir caso alguem use
}
