// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceReportsServices } from '../services/SharedMaintenanceReportsServices';

// CLASS

const validator = new Validator();
const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();

// #endregion

export async function sharedListReportVersions(req: Request, res: Response) {
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

  const reports = await sharedMaintenanceReportsServices.getAllReportVersions({
    maintenanceHistoryId,
  });

  return res.status(200).json(reports);
}
