// #region IMPORTS
import { sharedCreateCategory } from '../categories/controllers/sharedCreateCategory';
import { SharedCategoryServices } from '../categories/services/sharedCategoryServices';
import { Validator } from '../../../utils/validator/validator';
import { sharedEditCategory } from '../categories/controllers/sharedEditCategory';
import { sharedCreateMaintenance } from '../maintenance/controllers/sharedCreateMaintenance';
import { ICreateOccassionalMaintenanceReport } from './types';
import { ServerMessage } from '../../../utils/messages/serverMessage';
import { TimeIntervalServices } from '../timeInterval/services/timeIntervalServices';
import { sharedEditMaintenance } from '../maintenance/controllers/sharedEditMaintenance';
import { SharedMaintenanceServices } from '../maintenance/services/sharedMaintenanceServices';
import { SharedMaintenanceStatusServices } from '../maintenanceStatus/services/sharedMaintenanceStatusServices';
import { addDays } from '../../../utils/dateTime';
import { SharedMaintenanceReportsServices } from '../maintenancesReports/services/SharedMaintenanceReportsServices';
import { noWeekendTimeDate } from '../../../utils/dateTime/noWeekendTimeDate';

// CLASS
const sharedCategoryServices = new SharedCategoryServices();
const validator = new Validator();
const timeIntervalServices = new TimeIntervalServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();
const sharedMaintenanceStatusServices = new SharedMaintenanceStatusServices();
const sharedMaintenanceReportsServices = new SharedMaintenanceReportsServices();

// #endregion

export async function sharedCreateOccasionalMaintenanceReport({
  companyId,
  body,
}: {
  companyId: string;
  body: ICreateOccassionalMaintenanceReport;
}) {
  const {
    buildingId,
    responsibleSyndicId,
    origin,
    executionDate,
    categoryData,
    maintenanceData,
    reportData,
  }: ICreateOccassionalMaintenanceReport = body;

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
    { label: 'Reponsável da manutenção', variable: maintenanceData.responsible, type: 'string' },
    { label: 'Data', variable: executionDate, type: 'string' },
    { label: 'Origem', variable: origin, type: 'string' },
  ]);

  // #endregion

  // #region CATEGORY
  let category = null;

  if (categoryData.id) {
    category = await sharedEditCategory({
      ownerCompanyId: companyId,
      body: {
        categoryId: categoryData.id,
        name: categoryData.name,
      },
    });
  } else {
    const categoryFounded = await sharedCategoryServices.findOccasionalByName({
      categoryName: categoryData.name,
    });
    validator.cannotExists([
      {
        label: 'Categoria',
        variable: categoryFounded,
      },
    ]);

    category = await sharedCreateCategory({
      ownerCompanyId: companyId,
      body: {
        name: categoryData.name,
      },
      categoryTypeName: 'occasional',
    });
  }
  // #endregion

  // #region MAINTENANCE

  const timeInterval = await timeIntervalServices.findByName({ name: 'Day' });

  let maintenance = null;

  if (maintenanceData.id) {
    maintenance = await sharedEditMaintenance({
      ownerCompanyId: companyId,
      body: {
        ownerCompanyId: companyId,
        maintenanceId: maintenanceData.id,
        element: maintenanceData.element,
        activity: maintenanceData.activity,
        delay: 0,
        delayTimeIntervalId: timeInterval.id,
        frequency: 0,
        frequencyTimeIntervalId: timeInterval.id,
        observation: 'manutenção ocasional',
        periodTimeIntervalId: timeInterval.id,
        period: 5,
        responsible: maintenanceData.responsible,
        source: 'manutenção ocasional',
      },
    });
  } else {
    const maintenanceFounded = await sharedMaintenanceServices.findOccasionalByName({
      maintenanceName: maintenanceData.element,
    });

    if (maintenanceFounded && !categoryData.id)
      await sharedCategoryServices.delete({ categoryId: category.id });

    validator.cannotExists([
      {
        label: 'Manutenção',
        variable: maintenanceFounded,
      },
    ]);

    maintenance = await sharedCreateMaintenance({
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
        observation: 'manutenção ocasional',
        periodTimeIntervalId: timeInterval.id,
        period: 5,
        responsible: maintenanceData.responsible,
        source: 'manutenção ocasional',
      },
    });
  }

  // #endregion

  // #region REPORT

  if (new Date(executionDate) > new Date()) {
    const pendingStatus = await sharedMaintenanceStatusServices.findByName({ name: 'pending' });
    // criar historico do report
    await sharedMaintenanceServices.createHistory({
      data: [
        {
          ownerCompanyId: companyId,
          buildingId,
          maintenanceId: maintenance.id,
          maintenanceStatusId: pendingStatus.id,
          notificationDate: new Date(executionDate),
          dueDate: noWeekendTimeDate({
            date: addDays({ date: new Date(executionDate), days: 5 }),
            interval: 2,
          }),
        },
      ],
    });
  } else {
    const completedStatus = await sharedMaintenanceStatusServices.findByName({ name: 'completed' });
    // criar historico do report
    const maintenanceHistory = await sharedMaintenanceServices.createHistoryAndReport({
      data: {
        ownerCompanyId: companyId,
        buildingId,
        maintenanceId: maintenance.id,
        maintenanceStatusId: completedStatus.id,
        wasNotified: true,
        resolutionDate: new Date(executionDate),
        notificationDate: new Date(executionDate),
        dueDate: noWeekendTimeDate({
          date: addDays({ date: new Date(executionDate), days: 5 }),
          interval: 2,
        }),
        MaintenanceReport: {
          create: {
            cost: Number(reportData.cost),
            observation: reportData.observation,
            origin,
            responsibleSyndicId,
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
  }
  // #endregion
}
