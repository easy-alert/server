// # region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { BuildingServices } from '../services/buildingServices';
import { changeTime } from '../../../../../utils/dateTime/changeTime';
import { prisma } from '../../../../../../prisma';

const buildingServices = new BuildingServices();
// #endregion

interface IQuery {
  companyId: string;
  search: string;
  page: string;
  checkPerms: string;
  filterBy: 'mostRecent' | 'oldest' | 'mostScore' | 'leastScore' | '';
}

interface IBuilding {
  id: string;
  nanoId: string;
  name: string;
  neighborhood: string | null;
  city: string | null;
  createdAt: Date;
  MaintenanceScore: number;
  MaintenancesCount: {
    name: string;
    singularLabel: string;
    pluralLabel: string;
    count: number;
  }[];
  ticketsCount: number;
}

export async function listBuilding(req: Request, res: Response) {
  const { companyId, search, page, checkPerms, filterBy } = req.query as unknown as IQuery;

  const isAdmin = req.Permissions.some((permission) =>
    permission.Permission.name.includes('admin'),
  );

  const parsedCheckPerms = checkPerms === 'true';
  const pagination = page ?? 1;

  let permittedBuildings: string[] | undefined;

  if (parsedCheckPerms) {
    permittedBuildings = req.BuildingsPermissions?.map((b: any) => b.Building.id);
  }

  const { Buildings, buildingsCount } = await buildingServices.list({
    search: search as string,
    companyId: (req?.Company?.id || companyId) as string,
    buildingsIds: isAdmin ? undefined : permittedBuildings,
    page: Number(pagination),
    filterBy,
  });

  const buildings: IBuilding[] = [];

  for (let i = 0; i < Buildings.length; i++) {
    const MaintenancesCount = [
      {
        name: 'completed',
        singularLabel: 'concluída',
        pluralLabel: 'concluídas',
        count: 0,
      },
      {
        name: 'pending',
        singularLabel: 'pendente',
        pluralLabel: 'pendentes',
        count: 0,
      },
      {
        name: 'expired',
        singularLabel: 'vencida',
        pluralLabel: 'vencidas',
        count: 0,
      },
    ];

    Buildings[i].MaintenancesHistory.forEach((maintenance) => {
      switch (maintenance.MaintenancesStatus.name) {
        case 'completed':
          MaintenancesCount[0] = {
            ...MaintenancesCount[0],
            count: MaintenancesCount[0].count + 1,
          };
          break;

        case 'overdue':
          MaintenancesCount[0] = {
            ...MaintenancesCount[0],
            count: MaintenancesCount[0].count + 1,
          };
          break;

        case 'expired':
          MaintenancesCount[2] = {
            ...MaintenancesCount[2],
            count: MaintenancesCount[2].count + 1,
          };
          break;

        case 'pending':
          if (
            maintenance.notificationDate >
            changeTime({
              date: new Date(),
              time: {
                h: 0,
                m: 0,
                s: 0,
                ms: 0,
              },
            })
          )
            break;

          MaintenancesCount[1] = {
            ...MaintenancesCount[1],
            count: MaintenancesCount[1].count + 1,
          };
          break;

        default:
          break;
      }
    });

    const totalScore = MaintenancesCount.reduce((acc, maintenance) => acc + maintenance.count, 0);
    const completedScore = MaintenancesCount[0].count;
    const score = completedScore / totalScore;

    buildings.push({
      id: Buildings[i].id,
      nanoId: Buildings[i].nanoId,
      name: Buildings[i].name,
      city: Buildings[i].city,
      neighborhood: Buildings[i].neighborhood,
      createdAt: Buildings[i].createdAt,
      MaintenanceScore: score,
      MaintenancesCount,
      ticketsCount: Buildings[i]._count.tickets,
    });
  }

  if (filterBy === 'mostScore') {
    buildings.sort((a, b) => b.MaintenanceScore - a.MaintenanceScore);
  } else if (filterBy === 'leastScore') {
    buildings.sort((a, b) => a.MaintenanceScore - b.MaintenanceScore);
  }

  return res.status(200).json({ buildings, buildingsCount });
}
