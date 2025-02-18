import { prisma } from '../../../../../../prisma';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

interface ICheckIsMainContact {
  buildingId: string;
}

export async function checkIsMainContact({ buildingId }: ICheckIsMainContact) {
  const userBuilding = await prisma.userBuildingsPermissions.findFirst({
    where: {
      buildingId,
      isMainContact: true,
    },
  });

  if (userBuilding) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Já existe um contato principal para essa edificação.',
    });
  }
}
