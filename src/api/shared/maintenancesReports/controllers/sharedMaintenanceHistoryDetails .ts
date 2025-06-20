// #region IMPORTS
import { Request, Response } from 'express';

import { findManyMaintenanceHistories } from '../services/findManyMaintenanceHistories';
import { findUniqueMaintenanceHistory } from '../services/findUniqueMaintenanceHistory';

import { Validator } from '../../../../utils/validator/validator';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { removeDays } from '../../../../utils/dateTime';

const validator = new Validator();
// #endregion

type MaintenanceHistoryWithRelations = {
  id: string;
  notificationDate: Date;
  dueDate: Date;
  resolutionDate: Date | null;
  inProgress: boolean;
  daysInAdvance: number;
  priorityName: string;
  priority: string;
  showToResident: boolean;
  serviceOrderNumber: string;

  MaintenanceReportProgress: Array<{
    id: string;
    cost: number;
    observation: string;
    ReportImagesProgress: Array<{
      name: string;
      originalName: string;
      url: string;
    }>;
    ReportAnnexesProgress: Array<{
      name: string;
      originalName: string;
      url: string;
    }>;
  }>;

  MaintenanceReport: {
    id: string;
    cost: number;
    observation: string;
    ReportAnnexes: Array<{
      name: string;
      originalName: string;
      url: string;
    }>;
    ReportImages: Array<{
      name: string;
      originalName: string;
      url: string;
    }>;
  } | null;

  MaintenancesStatus: {
    name: string;
  };

  Building: {
    id: string;
    name: string;
    guestCanCompleteMaintenance: boolean;
  };

  Maintenance: {
    id: string;
    element: string;
    activity: string;
    responsible: string;
    source: string;
    observation: string;
    period: number;
    frequency: number;
    instructions: Array<{
      name: string;
      url: string;
    }>;
    Category: {
      name: string;
    };
    FrequencyTimeInterval: {
      pluralLabel: string;
      singularLabel: string;
      unitTime: number;
    };
    PeriodTimeInterval: {
      singularLabel: string;
      pluralLabel: string;
      unitTime: number;
    };
    MaintenanceType: {
      name: string;
    };
  };

  Users: Array<{
    User: {
      id: string;
      image: string;
      name: string;
      email: string;
      phoneNumber: string;
    };
  }>;

  activities: Array<{
    id: string;
    title: string;
    content: string;
    images: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

type MaintenanceHistoriesWithRelations = {
  id: string;

  notificationDate: Date;

  Maintenance: {
    period: number;

    PeriodTimeInterval: {
      unitTime: number;
    };
  };

  MaintenancesStatus: {
    name: string;
  };
};

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

  const maintenanceHistory = await findUniqueMaintenanceHistory<MaintenanceHistoryWithRelations>({
    data: {
      select: {
        id: true,
        notificationDate: true,
        dueDate: true,
        resolutionDate: true,
        inProgress: true,
        daysInAdvance: true,
        priorityName: true,
        priority: true,
        showToResident: true,
        serviceOrderNumber: true,

        MaintenanceReportProgress: {
          select: {
            id: true,
            cost: true,
            observation: true,

            ReportImagesProgress: {
              select: {
                name: true,
                originalName: true,
                url: true,
              },
            },

            ReportAnnexesProgress: {
              select: {
                name: true,
                originalName: true,
                url: true,
              },
            },
          },
        },

        MaintenanceReport: {
          select: {
            id: true,
            cost: true,
            observation: true,

            ReportAnnexes: {
              select: {
                name: true,
                originalName: true,
                url: true,
              },
            },

            ReportImages: {
              select: {
                name: true,
                originalName: true,
                url: true,
              },
            },
          },
        },

        MaintenancesStatus: {
          select: {
            name: true,
          },
        },

        Building: {
          select: {
            id: true,
            name: true,
            guestCanCompleteMaintenance: true,
          },
        },

        Maintenance: {
          select: {
            id: true,
            element: true,
            activity: true,
            responsible: true,
            source: true,
            observation: true,
            period: true,
            frequency: true,
            instructions: { select: { name: true, url: true } },

            Category: {
              select: {
                name: true,
              },
            },

            FrequencyTimeInterval: {
              select: {
                pluralLabel: true,
                singularLabel: true,
                unitTime: true,
              },
            },

            PeriodTimeInterval: {
              select: {
                singularLabel: true,
                pluralLabel: true,
                unitTime: true,
              },
            },

            MaintenanceType: {
              select: {
                name: true,
              },
            },
          },
        },

        Users: {
          select: {
            User: {
              select: {
                id: true,
                image: true,
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },

        activities: {
          select: {
            id: true,
            title: true,
            content: true,
            images: true,
            type: true,

            createdAt: true,
            updatedAt: true,
          },

          orderBy: {
            createdAt: 'desc',
          },
        },
      },

      where: {
        id: maintenanceHistoryId,
      },
    },
  });

  if (!maintenanceHistory) {
    return res.status(404).json({
      message: 'Histórico de manutenção não encontrado.',
    });
  }

  const histories = await findManyMaintenanceHistories<MaintenanceHistoriesWithRelations>({
    data: {
      select: {
        id: true,
        notificationDate: true,
        maintenanceId: true,
        wasNotified: true,
        priority: true,
        showToResident: true,
        serviceOrderNumber: true,

        Maintenance: {
          select: {
            period: true,

            PeriodTimeInterval: {
              select: {
                unitTime: true,
              },
            },
          },
        },

        MaintenancesStatus: {
          select: {
            name: true,
          },
        },
      },

      where: {
        buildingId: maintenanceHistory.Building.id,
        maintenanceId: maintenanceHistory.Maintenance.id,
      },

      orderBy: {
        createdAt: 'desc',
      },

      take: 3,
    },
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

  const period =
    histories[0].Maintenance.period * histories[0].Maintenance.PeriodTimeInterval.unitTime;

  // se aplica só
  const canReportPending =
    today >= removeDays({ date: maintenanceHistory.notificationDate, days: period });

  let allowReport = true;

  if (maintenanceHistory.MaintenancesStatus.name === 'expired') {
    if (histories[1]?.id !== maintenanceHistory?.id || today >= histories[0]?.notificationDate) {
      allowReport = false;
    }
  }

  // se ela foi criada com antecipação, respeitar
  // se foi criada com antecipação e ainda nao é o dia, não pode fazer
  const canReportAnticipatedMaintenance = today >= maintenanceHistory.notificationDate;
  if (maintenanceHistory?.daysInAdvance && !canReportAnticipatedMaintenance) {
    allowReport = false;
  }

  // se não tiver antecipação
  if (
    !maintenanceHistory?.daysInAdvance &&
    maintenanceHistory.MaintenancesStatus.name === 'pending' &&
    !canReportPending
  ) {
    allowReport = false;
  }

  if (
    maintenanceHistory.MaintenancesStatus.name === 'pending' &&
    histories[1]?.MaintenancesStatus?.name === 'expired' &&
    today < histories[0]?.notificationDate
  ) {
    allowReport = false;
  }

  // se for avulsa vencida, pode reportar sempre que quiser
  if (
    maintenanceHistory?.Maintenance.MaintenanceType?.name === 'occasional' &&
    maintenanceHistory?.MaintenancesStatus?.name === 'expired'
  ) {
    allowReport = true;
  }

  const maintenanceWithCanReport = {
    ...maintenanceHistory,
    canReport: allowReport,
  };

  return res.status(200).json(maintenanceWithCanReport);
}
