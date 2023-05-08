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
  '80f0a356-0b1d-45e6-a193-5c7445e505aa',
  '080c98a9-8671-4b15-bb8a-7e7d6731a184',
  '55e980e6-cb43-4a4e-bcc8-f520b307fdac',
  'a156d381-0b69-4714-977d-cd4ac081ecca',
  '9eedf701-b685-4402-8e8e-2f90dade3d3c',
  'f2bfd12a-e14f-4e03-af9c-cba2453ff0ff',
  '796a4cb8-280a-4941-a06b-adc25d587d41',
  '88ca8a5f-6e46-4d4c-a833-507afb2888d0',
  'a33a8586-d056-459e-a60c-28d7d4de25ea',
  '858cbcbf-dd41-44e7-9f3f-5c08deac5ecf',
  '0ac7f29a-50e1-4553-b7b7-cd4ce4812a99',
  '50dabef6-5da6-41cd-94b4-49cf8f9e7b65',
  '33311815-8a90-4226-b823-0c63e0c1cdd4',
  '64ac5962-a312-4b8c-95be-035e4b5c586a',
  '42873b4b-7006-4232-a4b1-ceb1622536b9',
  'b619e8e8-fdc9-4633-b61c-0bba295162d1',
  '068fe8c6-f952-40bd-8dc3-3434816851eb',
  'd0df888b-5953-4942-b48a-e7a93b2e74c8',
  '3f49ac68-9db2-4c32-a967-b9884bc546ca',
  'e08aea76-9df0-4db4-97bb-47f82a53b047',
  '9f1d09ca-6a4a-48cb-b18e-e57d0107fea1',
  '9e2d4ae4-d82f-4aa2-b5de-d7d37cbf643c',
  'dfd1b311-7d18-4137-9327-d4f6ba6113b0',
  '687232c0-444e-4c6b-9f74-da273c9bd486',
  '806084e9-2fad-4614-9fc8-ede94a4bb299',
  '66e2c598-4e3f-46b9-ac40-4257d3eb4263',
  '27545145-132f-4f18-9cee-c708b2fc4d9d',
  '0435bbed-40a7-40a0-901f-2810b397300c',
  '672ac19d-7e57-4d4d-b146-63f851674b19',
  '438abe2c-5d4b-4b95-95c8-97a5ef9a8387',
  'd66355d4-ab1a-419d-93fd-e542e388702e',
  '19e1aee6-314b-4e86-aa3d-1d8f86d5bbbd',
  '41948cfd-cd6c-449a-9f94-9b772416c087',
  '19b3e869-3116-46ef-88b8-9a1e41690559',
  '1f09b17c-98c2-4886-81e0-db4609f78ac7',
  'b16dbb15-32ff-4b81-a45d-2305a39958c0',
  '018851e0-d0d5-4ee6-85de-cc6ee64d52d0',
  '217340b9-394b-4155-bf1b-4ab3dfe139e4',
  'eb390d95-61db-4d00-b066-d73b1c7c3835',
  'beb408c2-d897-4aaa-9495-eed1dce42102',
  '016bff04-27a6-4008-bb79-4b7ffe5208d9',
  '81e55c9e-ba48-49ec-bc7f-4e11bcbe8d1e',
  'f9ea9d4c-6ac0-46b4-9034-28e3faa325b4',
  'dc5ce878-5b99-4fcd-977f-5ca295311259',
  '84b62e5a-42bb-4c91-897b-f45d3d714307',
  '354e4f92-d270-490a-ab2a-1fc11e43e80f',
  '7a0a2b89-9e84-4d6f-b094-a06d6e5cc8cf',
  '56125217-7ec6-4250-ac07-2319f783453a',
  '8b091c7c-4b01-4a7b-a5c3-6bb0bcdc1b42',
  '446014cf-2920-4a20-a872-98e12404357d',
  'e29d2474-9a4f-4464-b058-c710b0173b3a',
  '009e19e9-4467-48fb-9846-36814f46d9eb',
  '0e3e2209-439f-4af7-b049-b3560ba182c2',
  '2ecf59da-8bb4-42de-86f6-86881b46472c',
  '0b90e7bb-f884-4076-8e85-c6d8b9e5b444',
  '1504ea83-d2b3-40a3-85c1-e4eb2a540f9a',
  '90868c19-e565-4ddb-aa29-5d8915a7e921',
  '5ba994a4-de3b-4247-b123-9b10c2c83a68',
  '94060e4b-2f81-45bc-82fb-0fec7976027b',
  '42d3460e-c322-4fe8-9fc4-891e56bdb618',
  '9c394c90-036b-43f6-9b5a-aced9971c892',
  '0025289f-651d-4b79-bfe0-c07af6d0b694',
  'f8f50798-9ec7-40d4-847e-22008306b2bc',
  'f2371254-596d-4ee7-958b-e4d4160d3c04',
  'dae0245a-edae-43e2-9f68-e5e8dedd2559',
  '5ac1eb74-5d90-4e42-ab85-ba544235dabf',
  'a7eb0473-e624-4084-bf2a-c4696f06a3ff',
  '4b15e4cb-1fb4-4269-acf5-9c7fb75273cd',
  'bc59018f-2ff7-46f7-94af-9dc3d7276ce1',
  '4c4a8ff6-3d07-4998-a8a1-9521388af638',
  'da1964d0-e60b-4ed6-a6f8-c94cc3e789d3',
  '8538a20c-14fd-4062-84fc-5e9f39a79978',
  'fe570781-122b-41bf-a825-7959c7f532e1',
  '2a51573e-641d-4366-89d1-012be1d58602',
  'ecad69db-6284-424e-a286-f5ce38275205',
  '74ec4696-39cc-4424-90fa-8f8abe3c7571',
  '5ff8ba2d-b4af-4198-8356-a3d9e24d4127',
  '7f9ab8a6-3351-4d4b-a1ca-7ad96cbc01a5',
  '4e97ace7-645e-4289-91d8-cd80e184d658',
  '88a67d15-418e-4c39-b8af-ec631c932a7b',
  'd5eeb35e-e4a8-48c2-bb40-8101a22e3da0',
];

export async function fixMaintenancesHistory(_req: Request, res: Response) {
  const buildings = await findManyBuildings(buildingsIds);

  const processedBuildings = await processBuildings(buildings);

  const maintenancesHistoryForCreate = await processMaintenancesHistory(processedBuildings);

  await prisma.maintenanceHistory.createMany({ data: maintenancesHistoryForCreate });

  return res.sendStatus(200);
}
