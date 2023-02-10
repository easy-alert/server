// #region IMPORTS
import { Request, Response } from 'express';
import { addTimeDate, removeTimeDate } from '../../../../utils/dateTime';
import { noWeekendTimeDate } from '../../../../utils/dateTime/noWeekendTimeDate';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';
import { SharedMaintenanceStatusServices } from '../../maintenanceStatus/services/sharedMaintenanceStatusServices';
import { SharedMaintenanceReportsServices } from '../services/SharedMaintenanceReportsServices';
import { ICreateMaintenanceReportsBody } from './types';

// CLASS

const validator = new Validator();
const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const sharedMaintenanceStatusServices = new SharedMaintenanceStatusServices();

// #endregion

export async function sharedCreateMaintenanceReport(req: Request, res: Response) {
  const {
    cost,
    maintenanceHistoryId,
    observation,
    ReportAnnexes,
    ReportImages,
  }: ICreateMaintenanceReportsBody = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'Id do histórico de manutenção',
      type: 'string',
      variable: maintenanceHistoryId,
    },
    {
      label: 'custo da manutenção',
      type: 'number',
      variable: cost,
      isOptional: true,
    },
    {
      label: 'observação da manutenção',
      type: 'string',
      variable: observation,
      isOptional: true,
    },
  ]);

  ReportAnnexes.forEach((annex) => {
    validator.check([
      {
        label: 'nome do anexo',
        variable: annex.name,
        type: 'string',
      },
      {
        label: 'nome original do anexo',
        variable: annex.originalName,
        type: 'string',
      },
      {
        label: 'url do anexo',
        variable: annex.url,
        type: 'string',
      },
    ]);
  });

  ReportImages.forEach((annex) => {
    validator.check([
      {
        label: 'nome da imagem',
        variable: annex.name,
        type: 'string',
      },
      {
        label: 'nome original da imagem',
        variable: annex.originalName,
        type: 'string',
      },
      {
        label: 'url da imagem',
        variable: annex.url,
        type: 'string',
      },
    ]);
  });

  const maintenanceHistory = await sharedMaintenanceServices.findHistoryById({
    maintenanceHistoryId,
  });

  if (maintenanceHistory.MaintenanceReport.length > 0) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Um relato já foi enviado nesta manutenção.',
    });
  }

  const today = new Date(new Date().toISOString().split('T')[0]);

  const period =
    maintenanceHistory.Maintenance.period *
    maintenanceHistory.Maintenance.PeriodTimeInterval.unitTime;

  const canReportDate = removeTimeDate({ date: maintenanceHistory.notificationDate, days: period });

  if (today < canReportDate) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Você não pode reportar uma manutenção antes do tempo de resposta.',
    });
  }

  // #endregion

  const data = {
    maintenanceHistoryId,
    cost,
    observation,
    ReportImages: {
      createMany: {
        data: ReportImages,
      },
    },
    ReportAnnexes: {
      createMany: {
        data: ReportAnnexes,
      },
    },
  };
  await sharedMaintenanceReportsServices.create({ data });

  // #region UPDATE MAINTENANCE HISTORY STATUS

  if (today > maintenanceHistory.dueDate) {
    const overdueStatus = await sharedMaintenanceStatusServices.findByName({ name: 'overdue' });

    await sharedMaintenanceServices.changeMaintenanceHistoryStatus({
      maintenanceHistoryId,
      maintenanceStatusId: overdueStatus.id,
      resolutionDate: today,
    });
  } else {
    const overdueStatus = await sharedMaintenanceStatusServices.findByName({ name: 'completed' });

    await sharedMaintenanceServices.changeMaintenanceHistoryStatus({
      maintenanceHistoryId,
      maintenanceStatusId: overdueStatus.id,
      resolutionDate: today,
    });
  }
  // #endregion

  // #region CREATE MAINTENANCE HISTORY

  const notificationDate = noWeekendTimeDate({
    date: addTimeDate({
      date: today,
      days:
        maintenanceHistory.Maintenance.frequency *
        maintenanceHistory.Maintenance.FrequencyTimeInterval.unitTime,
    }),
    interval:
      maintenanceHistory.Maintenance.frequency *
      maintenanceHistory.Maintenance.FrequencyTimeInterval.unitTime,
  });

  const dueDate = noWeekendTimeDate({
    date: addTimeDate({
      date: notificationDate,
      days:
        maintenanceHistory.Maintenance.period *
        maintenanceHistory.Maintenance.PeriodTimeInterval.unitTime,
    }),
    interval:
      maintenanceHistory.Maintenance.period *
      maintenanceHistory.Maintenance.PeriodTimeInterval.unitTime,
  });

  const pendingStatus = await sharedMaintenanceStatusServices.findByName({ name: 'pending' });

  await sharedMaintenanceServices.createHistory({
    data: [
      {
        ownerCompanyId: req.Company.id,
        maintenanceId: maintenanceHistory.Maintenance.id,
        buildingId: maintenanceHistory.Building.id,
        maintenanceStatusId: pendingStatus.id,
        notificationDate,
        dueDate,
      },
    ],
  });
  // endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: `Manutenção reportada com sucesso.`,
    },
  });
}
