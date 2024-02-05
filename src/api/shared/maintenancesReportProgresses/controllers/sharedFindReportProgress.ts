// #region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceReportProgressesServices } from '../services/SharedMaintenanceReportProgressesServices';

const validator = new Validator();
const sharedMaintenanceReportProgressesServices = new SharedMaintenanceReportProgressesServices();

// #endregion

export async function sharedFindReportProgress(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'Id do histórico de manutenção',
      type: 'string',
      variable: maintenanceHistoryId,
    },
  ]);

  const progress = await sharedMaintenanceReportProgressesServices.findByMaintenanceHistoryId(
    maintenanceHistoryId,
  );

  return res.status(200).json({
    progress,
  });
}
