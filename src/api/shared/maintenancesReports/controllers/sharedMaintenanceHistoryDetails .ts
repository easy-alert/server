// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceReportsServices } from '../services/SharedMaintenanceReportsServices';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { addDays, removeDays } from '../../../../utils/dateTime';

const validator = new Validator();
const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();

// #endregion

export async function sharedMaintenanceHistoryDetails(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'Id do histórico de manutenção',
      type: 'string',
      variable: maintenanceHistoryId,
    },
  ]);

  // #endregion
  const maintenance = await sharedMaintenanceReportsServices.listMaintenanceById({
    maintenanceHistoryId,
  });

  const history = await sharedMaintenanceServices.findHistoryByBuildingId({
    buildingId: maintenance.Building.id,
    maintenanceId: maintenance.Maintenance.id,
  });

  const today = changeTime({
    date: new Date(),
    time: {
      h: 0,
      m: 0,
      ms: 0,
      s: 0,
    },
  });

  const period = maintenance.Maintenance.frequency * maintenance.Maintenance.FrequencyTimeInterval.unitTime;

  // se aplica só
  const canReportPending =
    today >= removeDays({ date: maintenance.notificationDate, days: period });

  let allowReport = true;

  if (today >= addDays({ date: maintenance.notificationDate, days: period })) {
    allowReport = false;
  }

  // se ela foi criada com antecipação, respeitar
  // se foi criada com antecipação e ainda nao é o dia, não pode fazer
  const canReportAnticipatedMaintenance = today >= maintenance.notificationDate;
  if (maintenance?.daysInAdvance && !canReportAnticipatedMaintenance) {
    allowReport = false;
  }

  // se não tiver antecipação
  if (
    !maintenance?.daysInAdvance &&
    !canReportPending &&
    maintenance.MaintenancesStatus.name === 'pending'
  ) {
    allowReport = false;
  }

  if (
    maintenance.MaintenancesStatus.name === 'pending' &&
    history[1]?.MaintenancesStatus?.name === 'expired' &&
    today < history[0]?.notificationDate
  ) {
    allowReport = false;
  }

  // se for avulsa, pode reportar sempre que quiser
  if (
    maintenance?.Maintenance.MaintenanceType?.name === 'occasional' 
  ) {
    allowReport = true;
  }

  const maintenanceWithCanReport = {
    ...maintenance,
    canReport: allowReport,
  };

  return res.status(200).json(maintenanceWithCanReport);
}
