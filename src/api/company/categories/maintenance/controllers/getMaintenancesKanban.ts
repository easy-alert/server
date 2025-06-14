// # region IMPORTS
import { Request, Response } from 'express';

import type { MaintenancePriorityName } from '@prisma/client';

import { hasAdminPermission } from '../../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../../utils/permissions/handlePermittedBuildings';
import { findCompanyById } from '../../../../shared/company/services/findCompanyById';
import { ClientBuildingServices } from '../../../../client/building/services/clientBuildingServices';
import { changeUTCTime } from '../../../../../utils/dateTime';
import { findMaintenanceHistory } from '../../../../client/building/services/findMaintenanceHistory';

const clientBuildingServices = new ClientBuildingServices();

interface IQuery {
  userId: string;
  buildingId: string;
  status: string;
  category: string;
  user: string;
  priorityName: string;
  search: string;
  startDate: string;
  endDate: string;
}

export async function getMaintenancesKanban(req: Request, res: Response) {
  const { buildingId, status, user, category, priorityName, search, startDate, endDate } =
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
      : (String(priorityName) as MaintenancePriorityName);
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
    search: searchFilter,
  });

  // # region filter
  const maintenanceCategoriesForSelect = Array.from(
    new Map(
      maintenancesHistory
        .filter(
          (maintenance) =>
            maintenance.Maintenance.Category.categoryTypeId ===
            '36baebb3-fe3c-4edb-a479-ec78d8cacbb7',
        )
        .map((maintenance) => [
          maintenance.Maintenance.Category.id,
          {
            id: maintenance.Maintenance.Category.id,
            name: maintenance.Maintenance.Category.name,
          },
        ]),
    ).values(),
  ).sort((a, b) => (b.name > a.name ? 1 : -1));
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

  return res.status(200).json({ kanban, maintenanceCategoriesForSelect });
}
