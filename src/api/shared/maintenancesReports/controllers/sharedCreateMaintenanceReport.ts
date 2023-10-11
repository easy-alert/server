// #region IMPORTS
import { Request, Response } from 'express';
import { addDays, removeDays } from '../../../../utils/dateTime';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { noWeekendTimeDate } from '../../../../utils/dateTime/noWeekendTimeDate';
import { EmailTransporterServices } from '../../../../utils/emailTransporter/emailTransporterServices';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';
import { SharedMaintenanceStatusServices } from '../../maintenanceStatus/services/sharedMaintenanceStatusServices';
import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { SharedMaintenanceReportsServices } from '../services/SharedMaintenanceReportsServices';
import { IAttachments, ICreateAndEditMaintenanceReportsBody } from './types';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

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
    origin,
    cost,
    maintenanceHistoryId,
    responsibleSyndicId,
    observation,
    ReportAnnexes,
    ReportImages,
  }: ICreateAndEditMaintenanceReportsBody = req.body;

  // #region VALIDATIONS
  validator.check([
    {
      label: 'Id do histórico de manutenção',
      type: 'string',
      variable: maintenanceHistoryId,
    },
    {
      label: 'Custo da manutenção',
      type: 'number',
      variable: cost,
      isOptional: true,
    },
    {
      label: 'Observação da manutenção',
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

  const maintenanceHistory = await sharedMaintenanceServices.findHistoryByNanoId({
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
    syndicData = await sharedBuildingNotificationConfigurationServices.findByNanoId({
      syndicNanoId: responsibleSyndicId,
    });
  }
  // #endregion

  const { Building } = await sharedMaintenanceServices.findHistoryById({
    maintenanceHistoryId,
  });

  // ARRAY ORDENADO POR DATA DE CRIAÇÃO, LOGO SE TIVER UMA PENDENTE, ELA SERÁ A PRIMEIRA POSIÇÃO
  const history = await sharedMaintenanceServices.findHistoryByBuildingId({
    buildingId: Building.id,
    maintenanceId: maintenanceHistory.maintenanceId,
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

  // VERIFICA SE A DATA DE NOTIFICAÇÃO DA PRIMEIRA POSIÇÃO QUE DEVE SER PENDENTE
  const period = history[0].Maintenance.period * history[0].Maintenance.PeriodTimeInterval.unitTime;

  const canReport = today >= removeDays({ date: history[0]?.notificationDate, days: period });

  // só verifica tudo isso se for manutenção comum
  if (maintenanceHistory.Maintenance.MaintenanceType?.name !== 'occasional') {
    // VERIFICA SE A MANUTENÇÃO QUE ESTÁ SENDO REPORTADA É VENCIDA
    if (maintenanceHistory.MaintenancesStatus.name === 'expired') {
      // JÁ EXISTE UMA PENDENTE, ENTAO EU COMPARO O ID DA ULTIMA VENCIDA, COM O ID QUE ESTOU MANDANDO
      // PARA NÃO DEIXAR REPORTAR UMA VENCIDA ANTERIOR A OUTRA VENCIDA
      if (history[1]?.id !== maintenanceHistory?.id || today >= history[0]?.notificationDate) {
        throw new ServerMessage({
          statusCode: 400,
          message: 'O prazo para o relato desta manutenção vencida expirou.',
        });
      }
    }
  }

  // NAO DEIXA FAZER UMA PENDENTE ANTES DO TEMPO PARA RESPOSTA
  if (!canReport && maintenanceHistory.MaintenancesStatus.name === 'pending') {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Você não pode reportar uma manutenção antes do tempo de resposta.',
    });
  }

  if (
    maintenanceHistory.MaintenancesStatus.name === 'pending' &&
    history[1]?.MaintenancesStatus?.name === 'expired' &&
    today < history[0]?.notificationDate
  ) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Você não pode antecipar um relato com uma manutenção vencida em andamento.',
    });
  }

  const data = {
    origin,
    maintenanceHistoryId,
    cost,
    observation,
    responsibleSyndicId: syndicData?.id,
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

  const maintenanceReport = await sharedMaintenanceReportsServices.create({ data });

  await sharedMaintenanceReportsServices.createHistory({
    data: {
      origin,
      maintenanceReportId: maintenanceReport.id,
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
    },
  });

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

  if (syndicData) {
    if (syndicData.emailIsConfirmed) {
      await emailTransporter.sendProofOfReport({
        companyLogo: maintenanceHistory.Company.image,
        dueDate: new Date(maintenanceHistory.dueDate).toLocaleDateString('pt-BR'),
        notificationDate: new Date(maintenanceHistory.notificationDate).toLocaleDateString('pt-BR'),
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
        resolutionDate: new Date().toLocaleString('pt-BR'),
        subject: 'Comprovante de relato',
        syndicName: syndicData.name,
        toEmail: syndicData.email!,
        attachments,
      });
    }
  } else {
    await emailTransporter.sendProofOfReport({
      companyLogo: maintenanceHistory.Company.image,
      dueDate: new Date(maintenanceHistory.dueDate).toLocaleDateString('pt-BR'),
      notificationDate: new Date(maintenanceHistory.notificationDate).toLocaleDateString('pt-BR'),
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
      resolutionDate: new Date().toLocaleString('pt-BR'),
      subject: 'Comprovante de relato',
      syndicName: maintenanceHistory.Company.name,
      toEmail: maintenanceHistory.Company.UserCompanies[0].User.email,
      attachments,
    });
  }

  // #region UPDATE MAINTENANCE HISTORY STATUS
  if (today > maintenanceHistory.dueDate) {
    const overdueStatus = await sharedMaintenanceStatusServices.findByName({ name: 'overdue' });

    await sharedMaintenanceServices.changeMaintenanceHistoryStatus({
      maintenanceHistoryId,
      maintenanceStatusId: overdueStatus.id,
      resolutionDate: today,
    });
  } else {
    const completedStatus = await sharedMaintenanceStatusServices.findByName({
      name: 'completed',
    });

    await sharedMaintenanceServices.changeMaintenanceHistoryStatus({
      maintenanceHistoryId,
      maintenanceStatusId: completedStatus.id,
      resolutionDate: today,
    });
  }
  // #endregion

  if (maintenanceHistory.Maintenance.MaintenanceType?.name === 'occasional') {
    return res.status(200).json({
      ServerMessage: {
        statusCode: 200,
        message: `Manutenção reportada com sucesso.`,
      },
    });
  }

  const foundBuildingMaintenance = await buildingServices.findBuildingMaintenanceDaysToAnticipate({
    buildingId: maintenanceHistory.Building.id,
    maintenanceId: maintenanceHistory.Maintenance.id,
  });

  // #region CREATE MAINTENANCE HISTORY
  const notificationDate = noWeekendTimeDate({
    date: addDays({
      date: today,
      days:
        maintenanceHistory.Maintenance.frequency *
          maintenanceHistory.Maintenance.FrequencyTimeInterval.unitTime -
        (foundBuildingMaintenance?.daysToAnticipate ?? 0),
    }),
    interval:
      maintenanceHistory.Maintenance.frequency *
      maintenanceHistory.Maintenance.FrequencyTimeInterval.unitTime,
  });

  const dueDate = noWeekendTimeDate({
    date: addDays({
      date: notificationDate,
      days:
        maintenanceHistory.Maintenance.period *
          maintenanceHistory.Maintenance.PeriodTimeInterval.unitTime +
        (foundBuildingMaintenance?.daysToAnticipate ?? 0),
    }),
    interval:
      maintenanceHistory.Maintenance.period *
      maintenanceHistory.Maintenance.PeriodTimeInterval.unitTime,
  });

  if (maintenanceHistory.MaintenancesStatus.name === 'pending') {
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
          daysInAdvance: foundBuildingMaintenance?.daysToAnticipate ?? 0,
        },
      ],
    });
  }

  if (maintenanceHistory.MaintenancesStatus.name === 'expired') {
    // CRIAR UM IF PARA CASO A MANUTENÇÃO DA POSIÇÃO 0 POSSUA OUTRO STATUS QUE NAO SEJA PENDENTE

    await sharedMaintenanceServices.updateMaintenanceHistory({
      data: {
        notificationDate,
        dueDate,
      },

      maintenanceHistoryId: history[0].id,
    });
  }

  // #endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Manutenção reportada com sucesso.`,
    },
  });
}
