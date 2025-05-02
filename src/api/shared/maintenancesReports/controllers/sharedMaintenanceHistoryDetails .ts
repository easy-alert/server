// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceReportsServices } from '../services/SharedMaintenanceReportsServices';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { removeDays } from '../../../../utils/dateTime';

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

  const selectedMaintenance = history.find((item) => item.id === maintenanceHistoryId);

  if (!selectedMaintenance) {
    return res.status(404).json({ message: 'Histórico de manutenção não encontrado' });
  }

  const period =
    selectedMaintenance.Maintenance.period *
    selectedMaintenance.Maintenance.PeriodTimeInterval.unitTime;

  // se aplica só
  const canReportPending =
    today >= removeDays({ date: selectedMaintenance?.notificationDate, days: period });

  let allowReport = true;

  if (maintenance.MaintenancesStatus.name === 'expired') {
    if (history[1]?.id !== maintenance?.id || today >= selectedMaintenance?.notificationDate) {
      allowReport = false;
    }
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
    today < selectedMaintenance?.notificationDate
  ) {
    allowReport = false;
  }

  // se for avulsa vencida, pode reportar sempre que quiser
  if (
    maintenance?.Maintenance.MaintenanceType?.name === 'occasional' &&
    maintenance?.MaintenancesStatus?.name === 'expired'
  ) {
    allowReport = true;
  }

  const maintenanceWithCanReport = {
    ...maintenance,
    canReport: allowReport,
  };

  return res.status(200).json(maintenanceWithCanReport);
}
