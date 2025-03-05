import { prisma } from '../../../../../prisma';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

interface IFindBuildingLogo {
  buildingId: string;
}

export async function findBuildingLogo({ buildingId }: IFindBuildingLogo) {
  let buildingLogo: string | null = '';

  const building = await prisma.building.findUnique({
    select: { companyId: true, image: true },
    where: { id: buildingId },
  });

  if (!building) {
    throw new ServerMessage({
      statusCode: 404,
      message: 'Prédio não encontrado.',
    });
  }

  buildingLogo = building.image;

  if (!buildingLogo) {
    const company = await prisma.company.findFirst({
      select: { image: true },
      where: { id: building.companyId },
    });

    if (!company) {
      throw new ServerMessage({
        statusCode: 404,
        message: 'Empresa não encontrada.',
      });
    }

    buildingLogo = company.image;
  }

  return buildingLogo;
}
