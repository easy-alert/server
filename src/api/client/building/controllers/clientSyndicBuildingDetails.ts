// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedBuildingNotificationConfigurationServices } from '../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';
import { ClientBuildingServices } from '../services/clientBuildingServices';

// CLASS

const clientBuildingServices = new ClientBuildingServices();
const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

const validator = new Validator();
// #endregion

export async function clientSyndicBuildingDetails(req: Request, res: Response) {
  const { syndicId } = req.params;

  const { year, month, status } = req.query;

  // #region VALIDATION

  validator.check([
    {
      label: 'Id do síndico',
      type: 'string',
      variable: syndicId,
    },
  ]);

  const buildingNotificationConfig = await sharedBuildingNotificationConfigurationServices.findById(
    {
      buildingNotificationConfigurationId: syndicId,
    },
  );

  // #endregion

  const { MaintenancesHistory } = await clientBuildingServices.findSyndicMaintenanceHistory({
    buildingId: buildingNotificationConfig?.Building.id,
    status: status ? String(status) : undefined,
    startDate: new Date(`${month ?? '01'}/01/${year ?? new Date().getFullYear()}`),
    endDate: new Date(`${month ?? '12'}/31/${year ?? new Date().getFullYear()}`),
  });

  // #region MOUNTING FILTERS
  const filters = {
    years: ['2021', '2022', '2023', '2024', '2025'],
    months: [
      {
        dayNumber: '01',
        label: 'janeiro',
      },
      {
        dayNumber: '02',
        label: 'fevereiro',
      },
      {
        dayNumber: '03',
        label: 'março',
      },
      {
        dayNumber: '04',
        label: 'abril',
      },
      {
        dayNumber: '05',
        label: 'maio',
      },
      {
        dayNumber: '06',
        label: 'junho',
      },
      {
        dayNumber: '07',
        label: 'julho',
      },
      {
        dayNumber: '08',
        label: 'agosto',
      },
      {
        dayNumber: '09',
        label: 'setembro',
      },
      {
        dayNumber: '10',
        label: 'outubro',
      },
      {
        dayNumber: '11',
        label: 'novembro',
      },
      {
        dayNumber: '12',
        label: 'dezembro',
      },
    ],
    status: [
      { name: 'expired', label: 'vencidas' },
      { name: 'pending', label: 'pendentes' },
      { name: 'completed', label: 'concluídas' },
      { name: 'overdue', label: 'feitas em atraso' },
    ],
  };

  // #endregion

  // #region PROCESS DATA

  const kanban = clientBuildingServices.syndicSeparePerMonth({ data: MaintenancesHistory });

  // #endregion

  return res.status(200).json({
    kanban,
    filters,
  });
}
