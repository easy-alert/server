import { prisma } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

class SharedCategoryAndMaintenanceServices {
  async findByName({ name }: { name: string }) {
    const category = await prisma.categoryAndMaintenanceTypes.findFirst({
      where: {
        name,
      },
    });

    if (!category) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Tipo de categoria ou manutenção não encontrado.',
      });
    }

    return category;
  }
}

export const sharedCategoryAndMaintenanceServices = new SharedCategoryAndMaintenanceServices();
