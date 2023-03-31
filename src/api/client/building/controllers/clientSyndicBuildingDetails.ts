// # region IMPORTS
import { Request, Response } from 'express';
import { changeTime } from '../../../../utils/dateTime/changeTime';
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
  const { syndicNanoId } = req.params;

  const { year, month, status } = req.query;

  const monthFilter = month === '' ? undefined : String(month);
  const statusFilter = status === '' ? undefined : String(status);

  const startDate =
    year === ''
      ? changeTime({
          date: new Date(`${monthFilter ?? '01'}/01/${String(new Date().getFullYear() - 100)}`),
          time: {
            h: 0,
            m: 0,
            ms: 0,
            s: 0,
          },
        })
      : changeTime({
          date: new Date(`${monthFilter ?? '01'}/01/${String(year)}`),
          time: {
            h: 0,
            m: 0,
            ms: 0,
            s: 0,
          },
        });

  const endDate =
    year === ''
      ? changeTime({
          date: new Date(`${monthFilter ?? '12'}/31/${String(new Date().getFullYear())}`),
          time: {
            h: 0,
            m: 0,
            ms: 0,
            s: 0,
          },
        })
      : changeTime({
          date: new Date(`${monthFilter ?? '12'}/31/${String(year)}`),
          time: {
            h: 0,
            m: 0,
            ms: 0,
            s: 0,
          },
        });

  // #region VALIDATION

  validator.check([
    {
      label: 'Id do síndico',
      type: 'string',
      variable: syndicNanoId,
    },
  ]);

  const buildingNotificationConfig =
    await sharedBuildingNotificationConfigurationServices.findByNanoId({
      syndicNanoId,
    });

  // #endregion

  const { MaintenancesForFilter, MaintenancesHistory } =
    await clientBuildingServices.findSyndicMaintenanceHistory({
      buildingId: buildingNotificationConfig?.Building.id,
      status: statusFilter,
      startDate,
      endDate,
    });

  // #region MOUNTING FILTERS

  let yearsFiltered: string[] = [];

  // menor ou igual pra pegar o ano atual
  MaintenancesForFilter.forEach((date) => {
    if (new Date(date.notificationDate).getFullYear() <= new Date().getFullYear()) {
      yearsFiltered.push(String(new Date(date.notificationDate).getFullYear()));
    }
  });

  yearsFiltered = [...new Set(yearsFiltered)];

  yearsFiltered = yearsFiltered.sort((a, b) => (a < b ? -1 : 1));

  const Filters = {
    years: yearsFiltered,
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
      kanban[i].maintenances.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
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
