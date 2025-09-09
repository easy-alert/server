// # region IMPORTS
import type { Request, Response } from 'express';

import type { MaintenancePriorityName } from '@prisma/client';

import { ClientBuildingServices } from '../../../../client/building/services/clientBuildingServices';
import { findCompanyById } from '../../../../shared/company/services/findCompanyById';
import { findMaintenanceHistory } from '../../../../client/building/services/findMaintenanceHistory';

import { hasAdminPermission } from '../../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../../utils/permissions/handlePermittedBuildings';
import { changeUTCTime } from '../../../../../utils/dateTime';
import { prisma } from '../../../../../../prisma';

const clientBuildingServices = new ClientBuildingServices();

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

  const allCategories = await prisma.category.findMany({
    where: {
      categoryTypeId: '36baebb3-fe3c-4edb-a479-ec78d8cacbb7',
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });
  // # endregion

  const kanban = await clientBuildingServices.syndicSeparePerStatus({ data: maintenancesHistory });

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

  kanban[2].maintenances.sort((a: any, b: any) => (a.date > b.date ? 1 : -1));

  if (company?.showMaintenancePriority) {
    kanban[2].maintenances.sort((a: any, b: any) => {
      const priorityOrder = { Alta: 3, Média: 2, Baixa: 1 };
      const getPriorityValue = (priorityLabel: string) =>
        priorityOrder[priorityLabel as keyof typeof priorityOrder] || 0;

      return getPriorityValue(b.priorityLabel) - getPriorityValue(a.priorityLabel);
    });
  }

  kanban[3].maintenances.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));

  return res.status(200).json({
    kanban,
    maintenanceCategoriesForSelect: allCategories,
  });
}
