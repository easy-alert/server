// # region IMPORTS
import { Request, Response } from 'express';
import { ClientBuildingServices } from '../../api/client/building/services/clientBuildingServices';
import { BuildingServices } from '../../api/company/buildings/building/services/buildingServices';
import { prisma } from '../../../prisma';
import { ServerMessage } from '../messages/serverMessage';

// CLASS
const clientBuildingServices = new ClientBuildingServices();
const buildingServices = new BuildingServices();

// #endregion

export async function deleteAllExpiredMaintenancesFromBuilding(req: Request, res: Response) {
  const { buildingId } = req.params;
  const { token } = req.query;

  if (token !== 'Easy4L3rt!1') {
    throw new ServerMessage({
      message: 'Acesso negado.',
      statusCode: 401,
    });
  }

  // #region VALIDATION
  const building = await buildingServices.findById({ buildingId });
  // #endregion

  const { MaintenancesHistory } = await clientBuildingServices.findSyndicMaintenanceHistory({
    buildingId,
    status: 'expired',
    startDate: new Date('1900-01-01'),
    endDate: new Date('2200-01-01'),
    categoryIdFilter: undefined,
  });

  const kanban = await clientBuildingServices.syndicSeparePerStatus({ data: MaintenancesHistory });

  // VENCIDAS
  const idsToDelete = kanban[0].maintenances
    .filter(({ cantReportExpired }: any) => cantReportExpired === true)
    .map(({ id }: any) => id);

  if (idsToDelete.length > 0) {
    await prisma.maintenanceHistory.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });
  } else {
    return res.status(200).json({
      ServerMessage: {
        message: `Nenhuma manutenção expirada foi encontrada na edificação ${building.name}.`,
      },
    });
  }

  return res.status(200).json({
    ServerMessage: {
      message: `Manutenções expiradas excluídas com sucesso na edificação ${building.name}.`,
    },
  });
}
