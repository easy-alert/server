// #region IMPORTS
import { Request, Response } from 'express';
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

// CLASS
const sharedCategoryServices = new SharedCategoryServices();
const validator = new Validator();
const timeIntervalServices = new TimeIntervalServices();
const sharedMaintenanceServices = new SharedMaintenanceServices();

// #endregion

export async function sharedCreateOccasionalMaintenanceReport(req: Request, res: Response) {
  const { categoryData, maintenanceData }: ICreateOccassionalMaintenanceReport = req.body;

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
    { label: 'Nome da categoria', variable: categoryData.name, type: 'string' },

    { label: 'Nome da manutenção', variable: maintenanceData.element, type: 'string' },
    { label: 'Atividade da manutenção', variable: maintenanceData.activity, type: 'string' },
    { label: 'Reponsável da manutenção', variable: maintenanceData.responsible, type: 'string' },
  ]);

  // #endregion

  // #region CATEGORY
  let category = null;

  if (categoryData.id) {
    category = await sharedEditCategory({
      ownerCompanyId: req.Company.id,
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
      ownerCompanyId: req.Company.id,
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
      ownerCompanyId: req.Company.id,
      body: {
        ownerCompanyId: req.Company.id,
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
      ownerCompanyId: req.Company.id,
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

  console.log(category);
  console.log('\n\n');
  console.log(maintenance);

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Manutenção reportada com sucesso.`,
    },
  });
}
