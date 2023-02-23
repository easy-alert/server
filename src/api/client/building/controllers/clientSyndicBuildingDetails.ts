// # region IMPORTS
import { Request, Response } from 'express';
import { DynamicFutureYears } from '../../../../utils/dateTime/dynamicFutureYears';
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

  const statusFilter = status === '' ? undefined : String(status);
  const monthFilter = month === '' ? undefined : String(month);

  const startDate =
    year === ''
      ? new Date(`${monthFilter ?? '01'}/01/${String(Number(new Date().getFullYear()) - 2)}`)
      : new Date(`${monthFilter ?? '01'}/01/${String(year)}`);

  const endDate =
    year === ''
      ? new Date(`${monthFilter ?? '12'}/31/${String(Number(new Date().getFullYear()) + 2)}`)
      : new Date(`${monthFilter ?? '12'}/31/${String(year)}`);

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
    status: statusFilter,
    startDate,
    endDate,
  });

  // #region MOUNTING FILTERS

  const filterYears = DynamicFutureYears({ showFutureYears: false });

  const Filters = {
    years: filterYears,
    months: [
      {
        monthNumber: '01',
        label: 'janeiro',
      },
      {
        monthNumber: '02',
        label: 'fevereiro',
      },
      {
        monthNumber: '03',
        label: 'março',
      },
      {
        monthNumber: '04',
        label: 'abril',
      },
      {
        monthNumber: '05',
        label: 'maio',
      },
      {
        monthNumber: '06',
        label: 'junho',
      },
      {
        monthNumber: '07',
        label: 'julho',
      },
      {
        monthNumber: '08',
        label: 'agosto',
      },
      {
        monthNumber: '09',
        label: 'setembro',
      },
      {
        monthNumber: '10',
        label: 'outubro',
      },
      {
        monthNumber: '11',
        label: 'novembro',
      },
      {
        monthNumber: '12',
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

  const kanban = clientBuildingServices.syndicSeparePerStatus({ data: MaintenancesHistory });

  for (let i = 0; i < kanban.length; i++) {
    for (let j = 0; j < kanban[i].maintenances.length; j++) {
      kanban[i].maintenances.sort((a: any, b: any) => (a.date > b.date ? 1 : -1));
    }
  }
  //

  // #endregion

  return res.status(200).json({
    buildingName: buildingNotificationConfig.Building.name,
    kanban,
    Filters,
  });
}
