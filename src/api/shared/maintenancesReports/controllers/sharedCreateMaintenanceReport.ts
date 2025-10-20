// #region IMPORTS
import { Request, Response } from 'express';

import { addDays } from '../../../../utils/dateTime';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { noWeekendTimeDate } from '../../../../utils/dateTime/noWeekendTimeDate';
import { EmailTransporterServices } from '../../../../utils/emailTransporter/emailTransporterServices';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { checkValues } from '../../../../utils/newValidator';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';
import { findCompanyOwner } from '../../company/services/findCompanyOwner';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';
import { getCompanyLastServiceOrder } from '../../maintenanceHistory/services/getCompanyLastServiceOrder';
import { createMaintenanceHistoryActivityCommentService } from '../../maintenanceHistoryActivities/services';
import { SharedMaintenanceStatusServices } from '../../maintenanceStatus/services/sharedMaintenanceStatusServices';
import { SharedBuildingNotificationConfigurationServices } from '../../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { ticketServices } from '../../tickets/services/ticketServices';
import { findUserById } from '../../users/user/services/findUserById';
import { SharedMaintenanceReportsServices } from '../services/SharedMaintenanceReportsServices';
import { IAttachments, ICreateAndEditMaintenanceReportsBody } from './types';

// CLASS

const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const sharedMaintenanceStatusServices = new SharedMaintenanceStatusServices();
const emailTransporter = new EmailTransporterServices();

const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

// #endregion

export async function sharedCreateMaintenanceReport(req: Request, res: Response) {
  const {
    userId,
    responsibleSyndicId,
    maintenanceHistoryId,
    cost,
    observation,
    origin,
    ReportAnnexes,
    ReportImages,
  }: ICreateAndEditMaintenanceReportsBody = req.body;

  // #region VALIDATIONS
  checkValues([
    {
      label: 'Id do histórico de manutenção',
      type: 'string',
      value: maintenanceHistoryId,
    },
    {
      label: 'Custo da manutenção',
      type: 'int',
      value: cost,
      required: false,
      allowZero: true,
    },
    {
      label: 'Observação da manutenção',
      type: 'string',
      value: observation,
      required: false,
    },
    {
      label: 'Id do síndico responsável',
      type: 'string',
      value: responsibleSyndicId,
      required: false,
    },
  ]);

  ReportAnnexes.forEach((annex) => {
    checkValues([
      {
        label: 'nome do anexo',
        value: annex.name,
        type: 'string',
        required: false,
      },
      {
        label: 'nome original do anexo',
        value: annex.originalName,
        type: 'string',
        required: false,
      },
      {
        label: 'url do anexo',
        value: annex.url,
        type: 'string',
        required: false,
      },
    ]);
  });

  ReportImages.forEach((annex) => {
    checkValues([
      {
        label: 'nome da imagem',
        value: annex.name,
        type: 'string',
        required: false,
      },
      {
        label: 'nome original da imagem',
        value: annex.originalName,
        type: 'string',
        required: false,
      },
      {
        label: 'url da imagem',
        value: annex.url,
        type: 'string',
        required: false,
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

  let userData = null;
  let responsibleData = null;

  if (userId) {
    userData = await findUserById(userId);
  }

  if (responsibleSyndicId && responsibleSyndicId !== 'guest') {
    // GAMBIARRINHA por causa da tela de convidados do client
    responsibleData = await sharedBuildingNotificationConfigurationServices.findByNanoId({
      syndicNanoId: responsibleSyndicId,
    });
  }

  const companyOwner = await findCompanyOwner({
    companyId: maintenanceHistory.Company.id,
  });
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

  const foundBuildingMaintenance = await buildingServices.findBuildingMaintenanceDaysToAnticipate({
    buildingId: maintenanceHistory.Building.id,
    maintenanceId: maintenanceHistory.Maintenance.id,
  });

  // se ela foi criada com antecipação, respeitar
  if (maintenanceHistory?.daysInAdvance) {
    const canReportAnticipatedMaintenance = today >= maintenanceHistory.notificationDate;

    if (!canReportAnticipatedMaintenance) {
      throw new ServerMessage({
        statusCode: 400,
        message:
          'Você não pode reportar uma manutenção com antecipação antes do dia da notificação.',
      });
    }
  }

  if (Building.mandatoryReportProof && (!Array.isArray(ReportImages) || ReportImages?.length < 1)) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'As imagens são obrigatórias para enviar esse relato.',
    });
  }

  const data = {
    origin,
    maintenanceHistoryId,
    cost,
    observation,
    responsibleSyndicId: responsibleData?.id,
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

  if (companyOwner && companyOwner?.emailIsConfirmed && companyOwner?.email) {
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
      syndicName: userData?.name ?? responsibleData?.name ?? companyOwner.name,
      toEmail: companyOwner.email,
      attachments,
    });
  } else if (userData && userData.email && userData.emailIsConfirmed) {
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
      syndicName: userData.name,
      toEmail: userData.email,
      attachments,
    });
  } else if (maintenanceHistory.Company.UserCompanies[0].User.email) {
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

  let complement = '.';

  const hasImages = ReportImages.length > 0;
  const hasAnnexes = ReportAnnexes.length > 0;

  if (hasImages) complement = ' com imagens.';
  if (hasAnnexes) complement = ' com anexos.';
  if (hasImages && hasAnnexes) complement = ' com imagens e anexos.';

  await createMaintenanceHistoryActivityCommentService({
    userId: userData?.id ?? userId,
    syndicNanoId: responsibleSyndicId,
    maintenanceHistoryId,
    content: `A manutenção foi concluída ${complement}`,
  });

  if (maintenanceHistory.Maintenance.MaintenanceType?.name === 'occasional') {
    // Os tickets que eu trago aqui sao só estao aguardando finalizar.
    ticketServices.sendFinishedTicketEmails({
      ticketIds: maintenanceHistory.tickets.map(({ id }) => id),
    });

    await ticketServices.updateMany({
      data: {
        statusName: 'finished',
      },
      where: {
        maintenanceHistoryId: maintenanceHistory.id,
      },
    });

    return res.status(200).json({
      ServerMessage: {
        statusCode: 200,
        message: `Manutenção reportada com sucesso.`,
      },
    });
  }

  // #region CREATE MAINTENANCE HISTORY

  const notificationDate = noWeekendTimeDate({
    date: addDays({
      date:
        // Escolhe se cria a pendente a partir da execução ou da notificação da anterior
        maintenanceHistory.Building.nextMaintenanceCreationBasis === 'executionDate'
          ? today
          : maintenanceHistory.notificationDate,
      days:
        maintenanceHistory.Maintenance.frequency *
          maintenanceHistory.Maintenance.FrequencyTimeInterval.unitTime -
        (foundBuildingMaintenance?.daysToAnticipate ?? 0),
    }),
    interval:
      maintenanceHistory.Maintenance.period *
      maintenanceHistory.Maintenance.PeriodTimeInterval.unitTime,
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

    const lastServiceOrderNumber = await getCompanyLastServiceOrder({
      companyId: req.Company.id,
    });

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
          serviceOrderNumber: lastServiceOrderNumber + 1,
        },
      ],
    });
  }

  if (
    maintenanceHistory.MaintenancesStatus.name === 'expired' &&
    // se for pra criar a partir da notificação, não tem porque atualizar, pq a pendente nova já foi criada a partir da notificação antiga
    maintenanceHistory.Building.nextMaintenanceCreationBasis === 'executionDate'
  ) {
    // CRIAR UM IF PARA CASO A MANUTENÇÃO DA POSIÇÃO 0 POSSUA OUTRO STATUS QUE NAO SEJA PENDENTE
    //
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
