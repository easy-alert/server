// #region IMPORTS
import { Request, Response } from 'express';
import { addTimeDate, dateFormatter, removeTimeDate } from '../../../../utils/dateTime';
import { noWeekendTimeDate } from '../../../../utils/dateTime/noWeekendTimeDate';
import { EmailTransporterServices } from '../../../../utils/emailTransporter/emailTransporterServices';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';
import { SharedMaintenanceStatusServices } from '../../maintenanceStatus/services/sharedMaintenanceStatusServices';
import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { SharedMaintenanceReportsServices } from '../services/SharedMaintenanceReportsServices';
import { IAttachments, ICreateMaintenanceReportsBody } from './types';

// CLASS

const validator = new Validator();
const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const sharedMaintenanceStatusServices = new SharedMaintenanceStatusServices();
const emailTransporter = new EmailTransporterServices();

const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

// #endregion

export async function sharedCreateMaintenanceReport(req: Request, res: Response) {
  const {
    cost,
    maintenanceHistoryId,
    responsibleSyndicId,
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
    {
      label: 'Id do síndico responsável',
      type: 'string',
      variable: responsibleSyndicId,
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

  let syndicData = null;

  if (responsibleSyndicId) {
    syndicData = await sharedBuildingNotificationConfigurationServices.findById({
      buildingNotificationConfigurationId: responsibleSyndicId,
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
    responsibleSyndicId,
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

  // #region PROCESS DATA FOR SEND EMAIL
  const attachments: IAttachments[] = [];

  ReportAnnexes.forEach((annex) => {
    attachments.push({
      filename: annex.originalName,
      path: annex.url,
    });
  });

  ReportImages.forEach((image) => {
    attachments.push({
      filename: image.originalName,
      path: image.url,
    });
  });

  const maskeredCost =
    data.cost === null
      ? '-'
      : (Number(String(data.cost).replace(/[^0-9]*/g, '')) / 100).toLocaleString('pt-br', {
          style: 'currency',
          currency: 'BRL',
        });

  const formattedDate = `${new Date().toLocaleString('pt-BR')}`;

  let emailToSend = null;
  let responsibleName = null;

  if (syndicData !== null && syndicData !== undefined) {
    emailToSend = syndicData.email!;
    responsibleName = syndicData.name;
  } else {
    emailToSend = maintenanceHistory.Company.UserCompanies[0].User.email;
    responsibleName = maintenanceHistory.Company.name;
  }
  // #endregion

  await emailTransporter.sendProofOfReport({
    dueDate: dateFormatter(maintenanceHistory.dueDate),
    notificationDate: dateFormatter(maintenanceHistory.notificationDate),
    buildingName: maintenanceHistory.Building.name,
    activity: maintenanceHistory.Maintenance.activity,
    categoryName: maintenanceHistory.Maintenance.Category.name,
    element: maintenanceHistory.Maintenance.element,
    responsible: maintenanceHistory.Maintenance.responsible,
    source: maintenanceHistory.Maintenance.source,
    maintenanceObservation:
      maintenanceHistory.Maintenance.observation &&
      maintenanceHistory.Maintenance.observation !== ''
        ? maintenanceHistory.Maintenance.observation
        : '-',
    cost: maskeredCost,
    reportObservation: data.observation && data.observation !== '' ? data.observation : '-',
    resolutionDate: formattedDate,
    subject: 'Comprovante de relato',
    syndicName: responsibleName,
    toEmail: emailToSend,
    attachments,
  });

  // #region UPDATE MAINTENANCE HISTORY STATUS

  if (today > maintenanceHistory.dueDate) {
    const overdueStatus = await sharedMaintenanceStatusServices.findByName({ name: 'overdue' });

    await sharedMaintenanceServices.changeMaintenanceHistoryStatus({
      maintenanceHistoryId,
      maintenanceStatusId: overdueStatus.id,
      resolutionDate: today,
    });
  } else {
    const completedStatus = await sharedMaintenanceStatusServices.findByName({ name: 'completed' });

    await sharedMaintenanceServices.changeMaintenanceHistoryStatus({
      maintenanceHistoryId,
      maintenanceStatusId: completedStatus.id,
      resolutionDate: today,
    });
  }
  // #endregion

  // #region CREATE MAINTENANCE HISTORY

  if (
    today > maintenanceHistory.Building.warrantyExpiration &&
    !maintenanceHistory.Building.keepNotificationAfterWarrantyEnds
  ) {
    return res.status(200).json({
      ServerMessage: {
        statusCode: 201,
        message: `Manutenção reportada com sucesso.`,
      },
    });
  }

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
        ownerCompanyId: maintenanceHistory.Company.id,
        maintenanceId: maintenanceHistory.Maintenance.id,
        buildingId: maintenanceHistory.Building.id,
        maintenanceStatusId: pendingStatus.id,
        notificationDate,
        dueDate,
      },
    ],
  });
  // #endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Manutenção reportada com sucesso.`,
    },
  });
}
