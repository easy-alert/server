// #region IMPORTS
import { sharedCreateCategory } from '../categories/controllers/sharedCreateCategory';
import { Validator } from '../../../utils/validator/validator';
import { sharedCreateMaintenance } from '../maintenance/controllers/sharedCreateMaintenance';
import { ICreateOccasionalMaintenanceReport } from './types';
import { ServerMessage } from '../../../utils/messages/serverMessage';
import { TimeIntervalServices } from '../timeInterval/services/timeIntervalServices';
import { SharedMaintenanceServices } from '../maintenance/services/sharedMaintenanceServices';
import { SharedMaintenanceStatusServices } from '../maintenanceStatus/services/sharedMaintenanceStatusServices';
import { addDays } from '../../../utils/dateTime';
import { SharedMaintenanceReportsServices } from '../maintenancesReports/services/SharedMaintenanceReportsServices';
import { noWeekendTimeDate } from '../../../utils/dateTime/noWeekendTimeDate';
import { SharedBuildingNotificationConfigurationServices } from '../notificationConfiguration/services/buildingNotificationConfigurationServices';
import { checkValues } from '../../../utils/newValidator';
import { ticketServices } from '../tickets/services/ticketServices';
import { getCompanyLastServiceOrder } from '../maintenanceHistory/services/getCompanyLastServiceOrder';
import { prisma } from '../../../../prisma';
import { sendPushNotification } from '../../../utils/pushNotifications/sendPushNotifications';

// CLASS
const validator = new Validator();
const timeIntervalServices = new TimeIntervalServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const sharedMaintenanceStatusServices = new SharedMaintenanceStatusServices();
const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();
const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();

// #endregion

export async function sharedCreateOccasionalMaintenanceReport({
  companyId,
  body,
}: {
  companyId: string;
  body: ICreateOccasionalMaintenanceReport;
}) {
  const {
    buildingId,
    responsibleSyndicId,
    origin,
    executionDate,
    categoryData,
    maintenanceData,
    reportData,
    inProgress,
    ticketIds,
    occasionalMaintenanceType,
    priorityName,
    usersId,
  }: ICreateOccasionalMaintenanceReport = body;
  console.log('🚀 ~ usersId:', usersId);

  // #region VALIDATIONS
  if (!categoryData) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Dados da categoria não informados.`,
    });
  }

  if (!maintenanceData) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Dados da manutenção não informados.`,
    });
  }

  validator.check([
    { label: 'Edificação', variable: buildingId, type: 'string' },
    { label: 'Nome da categoria', variable: categoryData.name, type: 'string' },
    { label: 'Nome da manutenção', variable: maintenanceData.element, type: 'string' },
    { label: 'Atividade da manutenção', variable: maintenanceData.activity, type: 'string' },
    { label: 'Responsável da manutenção', variable: maintenanceData.responsible, type: 'string' },
    { label: 'Data', variable: executionDate, type: 'string' },
    { label: 'Origem', variable: origin, type: 'string' },
    { label: 'Execução', variable: inProgress, type: 'boolean', isOptional: true },
  ]);

  checkValues([{ label: 'Chamados', type: 'array', value: ticketIds, required: false }]);

  // 100 anos em dias
  const defaultPeriod = 365 * 100;

  let syndicData = null;
  let returningMaintenance = null;

  if (responsibleSyndicId) {
    syndicData = await sharedBuildingNotificationConfigurationServices.findByNanoId({
      syndicNanoId: responsibleSyndicId,
    });
  }

  // #endregion

  // #region CATEGORY
  const category = await sharedCreateCategory({
    ownerCompanyId: companyId,
    body: {
      name: categoryData.name,
    },
    categoryTypeName: 'occasional',
  });

  // #endregion

  // #region MAINTENANCE
  const timeInterval = await timeIntervalServices.findByName({ name: 'Day' });

  const maintenance = await sharedCreateMaintenance({
    ownerCompanyId: companyId,
    maintenanceTypeName: 'occasional',
    body: {
      categoryId: category.id,
      element: maintenanceData.element,
      activity: maintenanceData.activity,
      delay: 0,
      delayTimeIntervalId: timeInterval.id,
      frequency: 0,
      frequencyTimeIntervalId: timeInterval.id,
      observation: 'Manutenção avulsa',
      periodTimeIntervalId: timeInterval.id,
      period: defaultPeriod,
      responsible: maintenanceData.responsible,
      source: 'Manutenção avulsa',
      instructions: [],
      priorityName,
    },
  });

  // #endregion

  // #region TICKETS VALIDATION
  if (ticketIds && Array.isArray(ticketIds) && ticketIds?.length > 0) {
    const openTicketsCount = await ticketServices.countOpenTickets({
      buildingId,
      ticketIds,
    });

    if (openTicketsCount !== ticketIds.length) {
      throw new ServerMessage({
        statusCode: 400,
        message: `Algum chamado selecionado já foi respondido.`,
      });
    }
  }
  // #endregion

  // #region REPORT

  const pendingStatus = await sharedMaintenanceStatusServices.findByName({ name: 'pending' });

  const lastServiceOrderNumber = await getCompanyLastServiceOrder({
    companyId,
  });

  if (occasionalMaintenanceType === 'pending') {
    // PENDENTE

    const newPending = await sharedMaintenanceServices.createOneHistory({
      data: {
        ownerCompanyId: companyId,
        buildingId,
        maintenanceId: maintenance.id,
        maintenanceStatusId: pendingStatus.id,
        priorityName,
        serviceOrderNumber: lastServiceOrderNumber + 1,
        inProgress,

        notificationDate: new Date(executionDate),
        dueDate: noWeekendTimeDate({
          date: addDays({ date: new Date(executionDate), days: defaultPeriod }),
          interval: 2,
        }),
      },
    });

    // Associate the array of users with the newly created MaintenanceHistory
    if (usersId && Array.isArray(usersId) && usersId.length > 0) {
      await Promise.all(
        usersId.map(async (userId) => {
          await sharedMaintenanceServices.createMaintenanceHistoryUser({
            data: {
              maintenanceHistoryId: newPending.id,
              userId,
            },
          });

          const userTokens = await prisma.pushNotification.findMany({
            select: {
              token: true,
            },

            where: { userId },
          });

          const userBuilding = await prisma.building.findFirst({ where: { id: buildingId } });

          if (userTokens && userTokens.length > 0 && userBuilding) {
            for (const token of userTokens) {
              await sendPushNotification({
                to: [token.token],
                title: userBuilding?.name,
                body: `Uma manutenção avulsa foi atribuída para você: ${maintenanceData.activity}`,
              });
            }
          }
        }),
      );
    } else {
      const userTokens = await prisma.pushNotification.findMany({
        select: {
          token: true,
        },

        where: {
          User: {
            UserBuildingsPermissions: {
              some: {
                buildingId,
              },
            },
          },
        },
      });

      const userBuilding = await prisma.building.findFirst({ where: { id: buildingId } });

      if (userTokens && userTokens.length > 0 && userBuilding) {
        for (const token of userTokens) {
          await sendPushNotification({
            to: [token.token],
            title: userBuilding?.name,
            body: `Uma manutenção avulsa foi criada: ${maintenanceData.activity}`,
          });
        }
      }
    }

    // Repetido lá embaixo
    if (ticketIds && Array.isArray(ticketIds) && ticketIds?.length > 0) {
      await ticketServices.updateMany({
        data: {
          statusName: 'awaitingToFinish',
          maintenanceHistoryId: newPending.id,
        },
        where: {
          id: { in: ticketIds },
        },
      });
    }

    returningMaintenance = newPending;
  } else {
    // CONCLUÍDA
    // se inProgress for true, é pra criar ela pendente na data escolhida, que anteriormente seria concluida E se for in progress, não criar relato
    // Task SA-6823
    const completedStatus = await sharedMaintenanceStatusServices.findByName({ name: 'completed' });

    if (inProgress) {
      const pendingInProgress = await sharedMaintenanceServices.createOneHistory({
        data: {
          ownerCompanyId: companyId,
          buildingId,
          maintenanceId: maintenance.id,
          maintenanceStatusId: pendingStatus.id,
          priorityName,
          inProgress,
          serviceOrderNumber: lastServiceOrderNumber + 1,

          notificationDate: new Date(executionDate),
          dueDate: noWeekendTimeDate({
            date: addDays({ date: new Date(executionDate), days: defaultPeriod }),
            interval: 2,
          }),
        },
      });

      // Associate the array of users with the newly created MaintenanceHistory
      if (usersId && Array.isArray(usersId) && usersId.length > 0) {
        await Promise.all(
          usersId.map(async (userId) => {
            await sharedMaintenanceServices.createMaintenanceHistoryUser({
              data: {
                maintenanceHistoryId: pendingInProgress.id,
                userId,
              },
            });

            const userTokens = await prisma.pushNotification.findMany({
              where: { userId },
              select: {
                token: true,
              },
            });

            const userBuilding = await prisma.building.findFirst({ where: { id: buildingId } });

            if (userTokens && userTokens.length > 0 && userBuilding) {
              // chama funcao
              for (const token of userTokens) {
                await sendPushNotification({
                  to: [token.token],
                  title: userBuilding?.name,
                  body: `Uma manutenção avulsa foi atribuída para você: ${maintenanceData.activity}`,
                });
              }
            }
          }),
        );
      } else {
        const userTokens = await prisma.pushNotification.findMany({
          select: {
            token: true,
          },

          where: {
            User: {
              UserBuildingsPermissions: {
                some: {
                  buildingId,
                },
              },
            },
          },
        });

        const userBuilding = await prisma.building.findFirst({ where: { id: buildingId } });

        if (userTokens && userTokens.length > 0 && userBuilding) {
          for (const token of userTokens) {
            await sendPushNotification({
              to: [token.token],
              title: userBuilding?.name,
              body: `Uma manutenção avulsa foi criada: ${maintenanceData.activity}`,
            });
          }
        }
      }

      if (ticketIds && Array.isArray(ticketIds) && ticketIds?.length > 0) {
        await ticketServices.updateMany({
          data: {
            statusName: 'awaitingToFinish',
            maintenanceHistoryId: pendingInProgress.id,
          },
          where: {
            id: { in: ticketIds },
          },
        });
      }

      returningMaintenance = pendingInProgress;
    } else {
      const maintenanceHistory = await sharedMaintenanceServices.createHistoryAndReport({
        data: {
          inProgress: inProgress || false,
          ownerCompanyId: companyId,
          buildingId,
          maintenanceId: maintenance.id,
          maintenanceStatusId: completedStatus.id,
          wasNotified: true,
          serviceOrderNumber: lastServiceOrderNumber + 1,
          resolutionDate: new Date(executionDate),
          notificationDate: new Date(executionDate),
          dueDate: noWeekendTimeDate({
            date: addDays({ date: new Date(executionDate), days: defaultPeriod }),
            interval: 2,
          }),
          MaintenanceReport: {
            create: {
              cost: Number(reportData.cost),
              observation: reportData.observation,
              origin,
              responsibleSyndicId: syndicData?.id || null,
              ReportImages: {
                createMany: {
                  data: reportData.images,
                },
              },
              ReportAnnexes: {
                createMany: {
                  data: reportData.files,
                },
              },
            },
          },
        },
      });

      const maintenanceReport = await sharedMaintenanceServices.findHistoryById({
        maintenanceHistoryId: maintenanceHistory.id,
      });

      if (maintenanceReport?.MaintenanceReport?.length) {
        await sharedMaintenanceReportsServices.createHistory({
          data: {
            version: 1,
            origin,
            maintenanceReportId: maintenanceReport.MaintenanceReport[0].id,
            maintenanceHistoryId: maintenanceHistory.id,
            cost: Number(reportData.cost),
            observation: reportData.observation,
            ReportImages: {
              createMany: {
                data: reportData.images,
              },
            },
            ReportAnnexes: {
              createMany: {
                data: reportData.files,
              },
            },
          },
        });
      }

      // Associate the array of users with the newly created MaintenanceHistory
      if (usersId && Array.isArray(usersId) && usersId.length > 0) {
        await Promise.all(
          usersId.map(async (userId) => {
            await sharedMaintenanceServices.createMaintenanceHistoryUser({
              data: {
                maintenanceHistoryId: maintenanceHistory.id,
                userId,
              },
            });

            const userTokens = await prisma.pushNotification.findMany({
              select: {
                token: true,
              },

              where: { userId },
            });

            const userBuilding = await prisma.building.findFirst({ where: { id: buildingId } });

            if (userTokens && userTokens.length > 0 && userBuilding) {
              for (const token of userTokens) {
                await sendPushNotification({
                  to: [token.token],
                  title: userBuilding?.name,
                  body: `Uma manutenção avulsa foi atribuída para você: ${maintenanceData.activity}`,
                });
              }
            }
          }),
        );
      } else {
        const userTokens = await prisma.pushNotification.findMany({
          select: {
            token: true,
          },

          where: {
            User: {
              UserBuildingsPermissions: {
                some: {
                  buildingId,
                },
              },
            },
          },
        });

        const userBuilding = await prisma.building.findFirst({ where: { id: buildingId } });

        if (userTokens && userTokens.length > 0 && userBuilding) {
          for (const token of userTokens) {
            await sendPushNotification({
              to: [token.token],
              title: userBuilding?.name,
              body: `Uma manutenção avulsa foi criada: ${maintenanceData.activity}`,
            });
          }
        }
      }

      if (ticketIds && Array.isArray(ticketIds) && ticketIds?.length > 0) {
        await ticketServices.updateMany({
          data: {
            statusName: 'finished',
            maintenanceHistoryId: maintenanceHistory.id,
          },
          where: {
            id: { in: ticketIds },
          },
        });

        ticketServices.sendFinishedTicketEmails({ ticketIds });
      }

      returningMaintenance = maintenanceHistory;
    }
  }

  return returningMaintenance;
  // #endregion
}
