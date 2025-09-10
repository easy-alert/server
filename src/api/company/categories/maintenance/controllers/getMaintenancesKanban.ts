// # region IMPORTS
import type { Request, Response } from 'express';

import type { MaintenancePriorityName } from '@prisma/client';

// import { ClientBuildingServices } from '../../../../client/building/services/clientBuildingServices'; // Replaced with optimized function
import { findCompanyById } from '../../../../shared/company/services/findCompanyById';
import { findMaintenanceHistory } from '../../../../client/building/services/findMaintenanceHistory';

import { hasAdminPermission } from '../../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../../utils/permissions/handlePermittedBuildings';
import { changeUTCTime } from '../../../../../utils/dateTime';
import { removeDays } from '../../../../../utils/dateTime';
import { changeTime } from '../../../../../utils/dateTime/changeTime';

// const clientBuildingServices = new ClientBuildingServices(); // Replaced with optimized function

// Optimized kanban processing without N+1 queries - maintaining original data structure
async function optimizedSyndicSeparePerStatus({ data }: { data: any }) {
  const today = changeTime({
    date: new Date(),
    time: {
      h: 0,
      m: 0,
      ms: 0,
      s: 0,
    },
  });

  const kanban: any = [
    {
      // SE ALTERAR A ORDEM DISSO, ALTERAR NO SCRIPT DE DELETAR AS EXPIRADAS
      status: 'Vencidas',
      maintenances: [],
    },
    {
      status: 'Pendentes',
      maintenances: [],
    },
    {
      status: 'Em execução',
      maintenances: [],
    },
    {
      status: 'Concluídas',
      maintenances: [],
    },
  ];

  for (let i = 0; i < data.length; i++) {
    const maintenance = data[i];
    let auxiliaryData = null;
    let period = null;
    let canReportDate = null;

    switch (maintenance.MaintenancesStatus.name) {
      case 'pending': {
        period = maintenance.Maintenance.period * maintenance.Maintenance.PeriodTimeInterval.unitTime;

        if (maintenance.daysInAdvance) {
          canReportDate = maintenance.notificationDate;
        } else {
          canReportDate = removeDays({
            date: maintenance.notificationDate,
            days: period,
          });
        }

        // Use pre-loaded history data instead of additional query
        const history = maintenance.Maintenance?.MaintenancesHistory?.[0];
        
        if (
          (today >= canReportDate && history?.MaintenancesStatus?.name !== 'expired') ||
          today >= history?.notificationDate
        ) {
          auxiliaryData = Math.floor(
            (maintenance.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );

          let label = '';

          if (auxiliaryData === 0) {
            label = 'Vence hoje';
          }

          if (
            auxiliaryData >= 1 &&
            maintenance.Maintenance.MaintenanceType.name !== 'occasional'
          ) {
            label = `Vence em ${auxiliaryData} ${auxiliaryData > 1 ? 'dias' : 'dia'}`;
          }

          kanban[maintenance.inProgress ? 2 : 1].maintenances.push({
            id: maintenance.id,
            buildingName: maintenance.Building.name,
            element: maintenance.Maintenance.element,
            activity: maintenance.Maintenance.activity,
            status: maintenance.MaintenancesStatus.name,
            priorityLabel: maintenance.priority?.label,
            priorityColor: maintenance.priority?.color,
            priorityBackgroundColor: maintenance.priority?.backgroundColor,
            serviceOrderNumber: maintenance.serviceOrderNumber,
            date: maintenance.notificationDate,
            dueDate: maintenance.dueDate,
            label,
            type: maintenance.Maintenance.MaintenanceType.name,
            inProgress: maintenance.inProgress,
          });
        }
        break;
      }

      case 'expired': {
        // Use pre-loaded history data instead of additional query
        const history = maintenance.Maintenance?.MaintenancesHistory?.[0];
        const historyPeriod = history?.Maintenance?.period * history?.Maintenance?.PeriodTimeInterval?.unitTime;

        auxiliaryData = Math.floor(
          (today.getTime() - maintenance.dueDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        const canReportHistoryPending =
          today >=
            removeDays({
              date: history?.notificationDate,
              days: historyPeriod,
            }) && history?.MaintenancesStatus?.name !== 'expired';

        kanban[maintenance.inProgress ? 2 : 0].maintenances.push({
          id: maintenance.id,
          buildingName: maintenance.Building.name,
          element: maintenance.Maintenance.element,
          activity: maintenance.Maintenance.activity,
          status: maintenance.MaintenancesStatus.name,
          priorityLabel: maintenance.priority?.label,
          priorityColor: maintenance.priority?.color,
          priorityBackgroundColor: maintenance.priority?.backgroundColor,
          serviceOrderNumber: maintenance.serviceOrderNumber,
          cantReportExpired:
            canReportHistoryPending ||
            history?.id !== maintenance.id ||
            today >= history?.notificationDate,
          date: maintenance.dueDate,
          dueDate: maintenance.dueDate,
          label: `Atrasada há ${auxiliaryData} ${auxiliaryData > 1 ? 'dias' : 'dia'}`,
          type: maintenance.Maintenance.MaintenanceType.name,
          inProgress: maintenance.inProgress,
        });
        break;
      }

      case 'completed':
        kanban[3].maintenances.push({
          id: maintenance.id,
          buildingName: maintenance.Building.name,
          element: maintenance.Maintenance.element,
          activity: maintenance.Maintenance.activity,
          status: maintenance.MaintenancesStatus.name,
          priorityLabel: maintenance.priority?.label,
          priorityColor: maintenance.priority?.color,
          priorityBackgroundColor: maintenance.priority?.backgroundColor,
          serviceOrderNumber: maintenance.serviceOrderNumber,
          date: maintenance.resolutionDate,
          dueDate: maintenance.dueDate,
          label: '',
          type: maintenance.Maintenance.MaintenanceType.name,
          inProgress: maintenance.inProgress,
        });
        break;

      case 'overdue':
        auxiliaryData = Math.floor(
          (maintenance.resolutionDate.getTime() - maintenance.dueDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        kanban[3].maintenances.push({
          id: maintenance.id,
          buildingName: maintenance.Building.name,
          element: maintenance.Maintenance.element,
          activity: maintenance.Maintenance.activity,
          status: maintenance.MaintenancesStatus.name,
          priorityLabel: maintenance.priority?.label,
          priorityColor: maintenance.priority?.color,
          priorityBackgroundColor: maintenance.priority?.backgroundColor,
          serviceOrderNumber: maintenance.serviceOrderNumber,
          date: maintenance.resolutionDate,
          dueDate: maintenance.dueDate,
          label: `Feita com atraso de ${auxiliaryData} ${auxiliaryData > 1 ? 'dias' : 'dia'}`,
          type: maintenance.Maintenance.MaintenanceType.name,
          inProgress: maintenance.inProgress,
        });
        break;

      default:
        break;
    }
  }

  return kanban;
}

interface IQuery {
  userId: string;
  buildingId: string;
  status: string;
  category: string;
  user: string;
  priorityName: string;
  type: string;
  search: string;
  startDate: string;
  endDate: string;
}

export async function getMaintenancesKanban(req: Request, res: Response) {
  const { buildingId, status, user, category, priorityName, type, search, startDate, endDate } =
    req.query as unknown as IQuery;
  const { Company } = req;

  const isAdmin = hasAdminPermission(req.Permissions);
  const permittedBuildingsIds = isAdmin
    ? undefined
    : handlePermittedBuildings(req.BuildingsPermissions, 'id');

  const buildingsIdFilter = !buildingId ? permittedBuildingsIds : buildingId.split(',');
  const userIdFilter = !user ? undefined : user.split(',');
  const statusFilter = typeof status === 'string' && status !== '' ? status.split(',') : undefined;
  const categoryFilter =
    typeof category === 'string' && category !== '' ? category.split(',') : undefined;
  const priorityFilter =
    !priorityName || priorityName === 'undefined'
      ? undefined
      : (priorityName.split(',') as MaintenancePriorityName[]);
  const typeFilter = !type || type === 'undefined' ? undefined : type.split(',');
  const searchFilter = search || '';

  const companyIdFilter = Company?.id;

  const startDateFilter = startDate
    ? changeUTCTime(new Date(String(startDate)), 0, 0, 0, 0)
    : undefined;
  const endDateFilter = endDate
    ? changeUTCTime(new Date(String(endDate)), 23, 59, 59, 999)
    : undefined;

  const company = await findCompanyById({ companyId: Company.id });

  const maintenancesHistory = await findMaintenanceHistory({
    companyId: companyIdFilter || company?.id!,
    buildingId: buildingsIdFilter,
    userId: userIdFilter,
    status: statusFilter,
    categoryIdFilter: categoryFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    showMaintenancePriority: company?.showMaintenancePriority,
    priorityFilter,
    typeFilter,
    search: searchFilter,
  });

  // # region filter - Optimized category extraction
  const categoryMap = new Map();
  const targetCategoryTypeId = '36baebb3-fe3c-4edb-a479-ec78d8cacbb7';
  
  for (const maintenance of maintenancesHistory) {
    const category = (maintenance as any).Maintenance?.Category;
    if (category?.categoryTypeId === targetCategoryTypeId) {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
      });
    }
  }
  
  const maintenanceCategoriesForSelect = Array.from(categoryMap.values())
    .sort((a, b) => a.name.localeCompare(b.name));
  // # endregion

  // Use optimized kanban processing to avoid N+1 queries
  const kanban = await optimizedSyndicSeparePerStatus({ data: maintenancesHistory });

  // Optimized sorting with priority support
  const priorityOrder = { Alta: 3, Média: 2, Baixa: 1 };
  const getPriorityValue = (priorityLabel: string) =>
    priorityOrder[priorityLabel as keyof typeof priorityOrder] || 0;

  // Vencida, SE ALTERAR A ORDEM DISSO, ALTERAR NO SCRIPT DE DELETAR AS EXPIRADAS
  kanban[0].maintenances.sort((a: any, b: any) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (company?.showMaintenancePriority) {
      const priorityCompare = getPriorityValue(b.priorityLabel) - getPriorityValue(a.priorityLabel);
      return priorityCompare !== 0 ? priorityCompare : dateCompare;
    }
    return dateCompare;
  });

  // Pendente
  kanban[1].maintenances.sort((a: any, b: any) => {
    const dateCompare = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (company?.showMaintenancePriority) {
      const priorityCompare = getPriorityValue(b.priorityLabel) - getPriorityValue(a.priorityLabel);
      return priorityCompare !== 0 ? priorityCompare : dateCompare;
    }
    return dateCompare;
  });

  // Em execução
  kanban[2].maintenances.sort((a: any, b: any) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (company?.showMaintenancePriority) {
      const priorityCompare = getPriorityValue(b.priorityLabel) - getPriorityValue(a.priorityLabel);
      return priorityCompare !== 0 ? priorityCompare : dateCompare;
    }
    return dateCompare;
  });

  // Concluídas
  kanban[3].maintenances.sort((a: any, b: any) => {
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (company?.showMaintenancePriority) {
      const priorityCompare = getPriorityValue(b.priorityLabel) - getPriorityValue(a.priorityLabel);
      return priorityCompare !== 0 ? priorityCompare : dateCompare;
    }
    return dateCompare;
  });

  return res.status(200).json({ 
    kanban, 
    maintenanceCategoriesForSelect
  });
}
