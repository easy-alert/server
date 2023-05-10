import { Request, Response } from 'express';
import { prisma } from '../../../prisma';
import { noWeekendTimeDate } from '../dateTime/noWeekendTimeDate';
import { addDays } from '../dateTime';
import { changeTime } from '../dateTime/changeTime';
import { SharedMaintenanceStatusServices } from '../../api/shared/maintenanceStatus/services/sharedMaintenanceStatusServices';

const sharedMaintenancesStatus = new SharedMaintenanceStatusServices();

interface IMaintenanceHistory {
  id: string;
  buildingId: string;
  ownerCompanyId: string;
  maintenanceId: string;
  maintenanceStatusId: string;
  dueDate: Date;
  notificationDate: Date;
  wasNotified: boolean;
  resolutionDate: Date | null;
  MaintenancesStatus: {
    name: string;
  };
  updatedAt: Date;
  createdAt: Date;
}

interface IUsedMaintenances {
  id: string;
  element: string;
  frequency: number;
  delay: number;
  period: number;
  DelayTimeInterval: { name: string; unitTime: number };
  FrequencyTimeInterval: { name: string; unitTime: number };
  PeriodTimeInterval: { name: string; unitTime: number };
}

interface IBuildings {
  id: string;
  name: string;
  companyId: string;
  deliveryDate: Date;
  usedMaintenances: IUsedMaintenances[];
  maintenanceHistory: IMaintenanceHistory[];
}

interface IProcessedBuilding {
  id: string;
  name: string;
  companyId: string;
  deliveryDate: Date;
  maintenances: {
    id: string;
    element: string;
    frequency: number;
    delay: number;
    period: number;
    history: IMaintenanceHistory[];
    DelayTimeInterval: { name: string; unitTime: number };
    FrequencyTimeInterval: { name: string; unitTime: number };
    PeriodTimeInterval: { name: string; unitTime: number };
  }[];
}

interface IRecurringDates {
  startDate: Date;
  endDate: Date;
  interval: number;
}

interface IMaintenancesHistoryForCreate {
  buildingId: string;
  ownerCompanyId: string;
  maintenanceId: string;
  maintenanceStatusId: string;
  notificationDate: Date;
  resolutionDate?: Date;
  dueDate: Date;
}

function recurringDate({ startDate, endDate, interval }: IRecurringDates) {
  let date = startDate;

  while (date < endDate) {
    date = noWeekendTimeDate({ date: addDays({ date, days: interval }), interval });
  }

  return date;
}

async function findManyBuildings(buildingsIds: string[]) {
  const buildingData = await prisma.building.findMany({
    select: {
      id: true,
      name: true,
      deliveryDate: true,
      Company: {
        select: {
          id: true,
        },
      },
      MaintenancesHistory: {
        select: {
          id: true,
          buildingId: true,
          ownerCompanyId: true,
          maintenanceId: true,
          maintenanceStatusId: true,
          dueDate: true,
          notificationDate: true,
          wasNotified: true,
          resolutionDate: true,
          updatedAt: true,
          createdAt: true,
          MaintenancesStatus: {
            select: {
              name: true,
            },
          },
        },
      },
      Categories: {
        select: {
          Maintenances: {
            select: {
              Maintenance: {
                select: {
                  id: true,
                  element: true,
                  frequency: true,
                  delay: true,
                  period: true,
                  FrequencyTimeInterval: {
                    select: {
                      name: true,
                      unitTime: true,
                    },
                  },
                  DelayTimeInterval: {
                    select: {
                      name: true,
                      unitTime: true,
                    },
                  },
                  PeriodTimeInterval: {
                    select: {
                      name: true,
                      unitTime: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    where: {
      id: {
        in: buildingsIds,
      },
    },
  });

  const buildings: IBuildings[] = [];

  // #region MAINTENANCES MOUNT DATA

  buildingData.forEach((building) => {
    const maintenances: IUsedMaintenances[] = [];

    building.Categories.forEach((category) => {
      category.Maintenances.forEach((maintenance) => {
        maintenances.push(maintenance.Maintenance);
      });
    });

    // Adding buildings
    buildings.push({
      id: building.id,
      name: building.name,
      companyId: building.Company.id,
      deliveryDate: building.deliveryDate,
      usedMaintenances: maintenances,
      maintenanceHistory: building.MaintenancesHistory,
    });
  });

  // #endregion

  return buildings;
}

async function processBuildings(buildings: IBuildings[]) {
  const processedBuildings: IProcessedBuilding[] = [];

  buildings.forEach((building) => {
    const processedMaintenances: any = [];

    building.usedMaintenances.forEach((maintenance) => {
      let processedMaintenancesTemp = building.maintenanceHistory.filter(
        (maintenanceHistory) => maintenance.id === maintenanceHistory.maintenanceId,
      );

      processedMaintenancesTemp = processedMaintenancesTemp.sort((a, b) =>
        a.notificationDate < b.notificationDate ? 1 : -1,
      );

      processedMaintenances.push({
        ...maintenance,
        history: processedMaintenancesTemp,
      });
    });

    processedBuildings.push({
      id: building.id,
      name: building.name,
      companyId: building.companyId,
      deliveryDate: building.deliveryDate,
      maintenances: processedMaintenances,
    });
  });

  return processedBuildings;
}

async function processMaintenancesHistory(processedBuildings: IProcessedBuilding[]) {
  // caso for utilizar novamente, verificar a hora, esta criando como 00:00 e nao 03:00
  const today = changeTime({
    date: new Date(),
    time: {
      h: 0,
      m: 0,
      s: 0,
      ms: 0,
    },
  });
  const pendingStatus = await sharedMaintenancesStatus.findByName({ name: 'pending' });

  const maintenancesHistoryForCreate: IMaintenancesHistoryForCreate[] = [];

  processedBuildings.forEach((building) => {
    building.maintenances.forEach((maintenance) => {
      if (maintenance.history.length) {
        if (maintenance.history[0].MaintenancesStatus.name !== 'pending') {
          const notificationDate = recurringDate({
            startDate: maintenance.history[0].notificationDate,
            endDate: today,
            interval: maintenance.frequency * maintenance.FrequencyTimeInterval.unitTime,
          });

          const dueDate = noWeekendTimeDate({
            date: addDays({
              date: notificationDate,
              days: maintenance.period * maintenance.PeriodTimeInterval.unitTime,
            }),
            interval: maintenance.frequency * maintenance.FrequencyTimeInterval.unitTime,
          });

          maintenancesHistoryForCreate.push({
            buildingId: building.id,
            maintenanceId: maintenance.id,
            ownerCompanyId: building.companyId,
            notificationDate: noWeekendTimeDate({
              date: notificationDate,
              interval: maintenance.frequency * maintenance.FrequencyTimeInterval.unitTime,
            }),
            dueDate,
            maintenanceStatusId: pendingStatus.id,
          });
        }
      } else {
        const notificationDate = recurringDate({
          startDate: building.deliveryDate,
          endDate: today,
          interval: maintenance.frequency * maintenance.FrequencyTimeInterval.unitTime,
        });

        const dueDate = noWeekendTimeDate({
          date: addDays({
            date: notificationDate,
            days: maintenance.period * maintenance.PeriodTimeInterval.unitTime,
          }),
          interval: maintenance.frequency * maintenance.FrequencyTimeInterval.unitTime,
        });

        maintenancesHistoryForCreate.push({
          buildingId: building.id,
          maintenanceId: maintenance.id,
          ownerCompanyId: building.companyId,
          notificationDate: noWeekendTimeDate({
            date: notificationDate,
            interval: maintenance.frequency * maintenance.FrequencyTimeInterval.unitTime,
          }),
          dueDate,
          maintenanceStatusId: pendingStatus.id,
        });
      }
    });
  });

  return maintenancesHistoryForCreate;
}

const buildingsIds = [
  'bda68b01-35a4-4e14-bafe-1a81321ddeb7',
  '5e4fb018-5a47-47a2-a7e5-3ea10fa69e67',
  '77f038d4-c33b-484f-b825-9cad2ce69455',
  '60884b4d-0172-4662-b688-364263696722',
  '25a95ed3-a900-401c-b318-754674d3a7a1',
  'a3c698fc-8604-46bd-aa6f-319cd391c1c6',
];

export async function fixMaintenancesHistory(_req: Request, res: Response) {
  const buildings = await findManyBuildings(buildingsIds);

  const processedBuildings = await processBuildings(buildings);

  const maintenancesHistoryForCreate = await processMaintenancesHistory(processedBuildings);

  await prisma.maintenanceHistory.createMany({ data: maintenancesHistoryForCreate });

  return res.sendStatus(200);
}
