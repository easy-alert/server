// # region IMPORTS
import { Request, Response } from 'express';

// CLASS
import { BuildingServices } from '../services/buildingServices';

const buildingServices = new BuildingServices();
// #endregion

export async function listBuilding(req: Request, res: Response) {
  const { search, page } = req.query;

  const pagination = page ?? 1;

  const { Buildings, buildingsCount } = await buildingServices.list({
    search: search as string,
    companyId: req.Company.id,
    page: Number(pagination),
  });

  for (let i = 0; i < Buildings.length; i++) {
    const MaintenancesCount = [
      {
        name: 'expired',
        pluralLabel: 'vencida',
        singularLabel: 'vencidas',
        count: 0,
      },
      {
        name: 'pending',
        pluralLabel: 'concluídas',
        singularLabel: 'concluída',
        count: 0,
      },
      {
        name: 'completed',
        pluralLabel: 'concluídas',
        singularLabel: 'concluída',
        count: 0,
      },
    ];

    Buildings[i].MaintenancesHistory.forEach((maintenance) => {
      switch (maintenance.MaintenancesStatus.name) {
        case 'pending':
          MaintenancesCount[0] = {
            ...MaintenancesCount[0],
            count: MaintenancesCount[0].count + 1,
          };
          break;

        case 'completed':
          MaintenancesCount[1] = {
            ...MaintenancesCount[1],
            count: MaintenancesCount[1].count + 1,
          };
          break;

        case 'overdue':
          MaintenancesCount[1] = {
            ...MaintenancesCount[1],
            count: MaintenancesCount[1].count + 1,
          };
          break;

        case 'expired':
          MaintenancesCount[2] = {
            ...MaintenancesCount[2],
            count: MaintenancesCount[2].count + 1,
          };
          break;

        default:
          break;
      }
    });

    Buildings[i] = {
      id: Buildings[i].id,
      name: Buildings[i].name,
      city: Buildings[i].city,
      neighborhood: Buildings[i].neighborhood,
      // @ts-ignore
      MaintenancesCount,
    };
  }

  return res.status(200).json({ Buildings, buildingsCount });
}
