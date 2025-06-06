// # region IMPORTS
import { Request, Response } from 'express';

import type { MaintenancePriorityName } from '@prisma/client';

import { ClientBuildingServices } from '../services/clientBuildingServices';
import { SharedBuildingNotificationConfigurationServices } from '../../../shared/notificationConfiguration/services/buildingNotificationConfigurationServices';
import { SharedCategoryServices } from '../../../shared/categories/services/sharedCategoryServices';
import { findCompany } from '../../../shared/company/services/findCompany';

import { changeTime } from '../../../../utils/dateTime/changeTime';
import { Validator } from '../../../../utils/validator/validator';

// CLASS
const clientBuildingServices = new ClientBuildingServices();
const sharedBuildingNotificationConfigurationServices =
  new SharedBuildingNotificationConfigurationServices();
const sharedCategoriesServices = new SharedCategoryServices();

const validator = new Validator();
// #endregion

export async function clientSyndicBuildingDetails(req: Request, res: Response) {
  const { syndicNanoId } = req.params;
  const { year, month, status, categoryId, priorityName } = req.query;

  const monthFilter = month ? String(month) : undefined;
  const statusFilter = status ? String(status) : undefined;
  const categoryIdFilter = categoryId ? String(categoryId) : undefined;
  const priorityFilter =
    !priorityName || priorityName === 'undefined'
      ? undefined
      : (String(priorityName) as MaintenancePriorityName);

  const startDate =
    year === ''
      ? changeTime({
          date: new Date(`${monthFilter ?? '01'}/01/${String(new Date().getFullYear() - 100)}`),
          time: {
            h: 0,
            m: 0,
            ms: 0,
            s: 0,
          },
        })
      : changeTime({
          date: new Date(`${monthFilter ?? '01'}/01/${String(year)}`),
          time: {
            h: 0,
            m: 0,
            ms: 0,
            s: 0,
          },
        });

  const endDate =
    year === ''
      ? changeTime({
          date: new Date(`${monthFilter ?? '12'}/31/${String(new Date().getFullYear() + 100)}`),
          time: {
            h: 0,
            m: 0,
            ms: 0,
            s: 0,
          },
        })
      : changeTime({
          date: new Date(`${monthFilter ?? '12'}/31/${String(year)}`),
          time: {
            h: 0,
            m: 0,
            ms: 0,
            s: 0,
          },
        });

  // #region VALIDATION

  validator.check([
    {
      label: 'Id do síndico',
      type: 'string',
      variable: syndicNanoId,
    },
  ]);

  const buildingNotificationConfig =
    await sharedBuildingNotificationConfigurationServices.findByNanoId({
      syndicNanoId,
    });

  const company = await findCompany({
    buildingId: buildingNotificationConfig?.Building.id,
  });

  // #endregion

  const { MaintenancesForFilter, MaintenancesHistory } =
    await clientBuildingServices.findSyndicMaintenanceHistory({
      buildingId: buildingNotificationConfig?.Building.id,
      status: statusFilter,
      showMaintenancePriority: company?.showMaintenancePriority,
      startDate,
      endDate,
      categoryIdFilter,
      priorityFilter,
    });

  // #region MOUNTING FILTERS
  const categories = await sharedCategoriesServices.listForSelect({
    ownerCompanyId: buildingNotificationConfig.Building.companyId,
  });

  let yearsFiltered: string[] = [];

  // ALTEREI ISSO AQUI, caso dê ruim
  MaintenancesForFilter.forEach((date) => {
    yearsFiltered.push(String(new Date(date.notificationDate).getFullYear()));
  });

  yearsFiltered = [...new Set(yearsFiltered)];

  yearsFiltered = yearsFiltered.sort((a, b) => (a < b ? -1 : 1));

  const Filters = {
    years: yearsFiltered,
    months: [
      {
        monthNumber: '01',
        label: 'janeiro',
      },
      {
        monthNumber: '02',
        label: 'fevereiro',
      },
      {
        monthNumber: '03',
        label: 'março',
      },
      {
        monthNumber: '04',
        label: 'abril',
      },
      {
        monthNumber: '05',
        label: 'maio',
      },
      {
        monthNumber: '06',
        label: 'junho',
      },
      {
        monthNumber: '07',
        label: 'julho',
      },
      {
        monthNumber: '08',
        label: 'agosto',
      },
      {
        monthNumber: '09',
        label: 'setembro',
      },
      {
        monthNumber: '10',
        label: 'outubro',
      },
      {
        monthNumber: '11',
        label: 'novembro',
      },
      {
        monthNumber: '12',
        label: 'dezembro',
      },
    ],
    status: [
      { name: 'completed', label: 'concluídas' },
      { name: 'overdue', label: 'feitas em atraso' },
      { name: 'pending', label: 'pendentes' },
      { name: 'expired', label: 'vencidas' },
    ],
    categories,
  };
  // #endregion

  const kanban = await clientBuildingServices.syndicSeparePerStatus({ data: MaintenancesHistory });

  // Vencida, SE ALTERAR A ORDEM DISSO, ALTERAR NO SCRIPT DE DELETAR AS EXPIRADAS
  kanban[0].maintenances.sort((a: any, b: any) => (a.date > b.date ? 1 : -1));

  // Pendente
  kanban[1].maintenances.sort((a: any, b: any) => (a.dueDate > b.dueDate ? 1 : -1));

  if (company?.showMaintenancePriority) {
    kanban[1].maintenances.sort((a: any, b: any) => {
      const priorityOrder = { Alta: 3, Média: 2, Baixa: 1 };
      const getPriorityValue = (priorityLabel: string) =>
        priorityOrder[priorityLabel as keyof typeof priorityOrder] || 0;

      return getPriorityValue(b.priorityLabel) - getPriorityValue(a.priorityLabel);
    });
  }

  // Em execução (Vencida + Pendente)
  kanban[2].maintenances.sort((a: any, b: any) => (a.date > b.date ? 1 : -1));

  if (company?.showMaintenancePriority) {
    kanban[2].maintenances.sort((a: any, b: any) => {
      const priorityOrder = { Alta: 3, Média: 2, Baixa: 1 };
      const getPriorityValue = (priorityLabel: string) =>
        priorityOrder[priorityLabel as keyof typeof priorityOrder] || 0;

      return getPriorityValue(b.priorityLabel) - getPriorityValue(a.priorityLabel);
    });
  }

  // Concluída e Feita em atraso
  kanban[3].maintenances.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));

  return res.status(200).json({
    buildingName: buildingNotificationConfig.Building.name,
    showPriority: company?.showMaintenancePriority,
    kanban,
    Filters,
  });
}
