import { Response, Request } from 'express';
import { checkValues } from '../../../../utils/newValidator';
import { prisma } from '../../../../../prisma';
import { SharedBuildingNotificationConfigurationServices } from '../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';

const syndicService = new SharedBuildingNotificationConfigurationServices();

interface IBuildingsBySyndic {
  buildingName: string;
  syndicNanoId: string;
  syndicName: string;
  buildingNanoId: string;
  companyName: string;
  label: string;
}

export async function findManyBuildingsBySyndicNanoId(req: Request, res: Response) {
  const { syndicNanoId } = req.params as any as { syndicNanoId: string };

  checkValues([{ label: 'Nano ID do responsável', type: 'string', value: syndicNanoId }]);

  const syndic = await syndicService.findByNanoId({ syndicNanoId });

  const buildings: IBuildingsBySyndic[] = [];

  if (!syndic.contactNumberIsConfirmed) {
    return res.status(200).json({ buildings });
  }

  const syndics = await prisma.buildingNotificationConfiguration.findMany({
    select: {
      nanoId: true,
      name: true,
      Building: {
        select: {
          name: true,
          nanoId: true,
          Company: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: {
      contactNumberIsConfirmed: true,
      contactNumber: syndic.contactNumber,
    },
    orderBy: {
      Building: {
        name: 'asc',
      },
    },
  });

  syndics.forEach(({ Building, nanoId, name }) => {
    const hasDuplicatedBuilding =
      syndics.filter((data) => Building.nanoId === data.Building.nanoId).length > 1;

    buildings.push({
      buildingNanoId: Building.nanoId,
      buildingName: Building.name,
      syndicNanoId: nanoId,
      companyName: Building.Company.name,
      syndicName: name,
      label: hasDuplicatedBuilding ? `${`${Building.name} - ${name}`}` : Building.name,
    });
  });

  return res.status(200).json({ buildings });
}
