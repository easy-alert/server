// # region IMPORTS
import { Request, Response } from 'express';

import type { Company as TCompany, MaintenancePriorityName } from '@prisma/client';

import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';
import { ClientBuildingServices } from '../services/clientBuildingServices';
import { changeUTCTime } from '../../../../utils/dateTime';
import { findCompanyByUserId } from '../../../shared/company/services/findCompanyByUserId';
import { findUserById } from '../../user/services/findUserById';
import { findMaintenanceHistory } from '../services/findMaintenanceHistory';

const clientBuildingServices = new ClientBuildingServices();

interface IQuery {
  buildingId: string;
  userId: string;
  status: string;
  category: string;
  user: string;
  priorityName: string;
  startDate: string;
  endDate: string;
}

export async function getMaintenancesKanban(req: Request, res: Response) {
  const { userId, buildingId, status, user, category, priorityName, startDate, endDate } =
    req.query as unknown as IQuery;
  const { Company } = req;

  let permissionsForSelect: any;
  let buildingsForSelect: any;
  let companyForSelect: TCompany | null = Company as TCompany;

  if (userId) {
    const userData = await findUserById({ userId });

    permissionsForSelect = userData?.Permissions.map((permission) => ({
      Permission: {
        name: permission.Permission.name,
      },
    }));

    buildingsForSelect = userData?.UserBuildingsPermissions.map((building) => ({
      Building: {
        id: building.buildingId,
      },
    }));
  }

  const isAdmin = hasAdminPermission(permissionsForSelect);
  const permittedBuildingsIds = isAdmin
    ? undefined
    : handlePermittedBuildings(buildingsForSelect, 'id');

  const buildingsIdFilter = !buildingId ? permittedBuildingsIds : buildingId.split(',');
  const userIdFilter = !user ? undefined : user.split(',');
  const statusFilter = typeof status === 'string' && status !== '' ? status.split(',') : undefined;
  const categoryFilter =
    typeof category === 'string' && category !== '' ? category.split(',') : undefined;
  const priorityFilter =
    !priorityName || priorityName === 'undefined'
      ? undefined
      : (String(priorityName) as MaintenancePriorityName);

  const startDateFilter = startDate
    ? changeUTCTime(new Date(String(startDate)), 0, 0, 0, 0)
    : undefined;
  const endDateFilter = endDate
    ? changeUTCTime(new Date(String(endDate)), 23, 59, 59, 999)
    : undefined;

  if (!companyForSelect) {
    const companyByUserId = await findCompanyByUserId({ userId });

    companyForSelect = companyByUserId as TCompany;
  }

  if (!companyForSelect) {
    return res.status(404).json({
      ServerMessage: {
        statusCode: 404,
        message: 'Empresa não encontrada',
      },
    });
  }

  const companyIdFilter = companyForSelect?.id || Company?.id;

  const maintenancesHistory = await findMaintenanceHistory({
    companyId: companyIdFilter || companyForSelect.id,
    buildingId: buildingsIdFilter,
    userId: userIdFilter,
    status: statusFilter,
    categoryIdFilter: categoryFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    showMaintenancePriority: companyForSelect?.showMaintenancePriority,
    priorityFilter,
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

  // # region checklists
  // const defaultChecklistStyle = {
  //   type: 'checklist',
  // };

  // const checklists = await getChecklistsByBuildingId({
  //   companyId: companyIdFilter,
  //   buildingId: buildingsIdFilter,
  //   userId: userIdFilter,
  // });
  // # endregion

  const kanban = await clientBuildingServices.syndicSeparePerStatus({ data: maintenancesHistory });

  // checklists
  //   .filter((checklist) => checklist.checklistItem.length > 0)
  //   .forEach((checklist) => {
  //     const totalItems = checklist.checklistItem.length;
  //     const completedItems = checklist.checklistItem.filter(
  //       (item) => item.status === 'completed',
  //     ).length;
  //     const checklistProgress = `${completedItems} de ${totalItems} itens concluídos`;

  //     switch (checklist.status) {
  //       case 'pending':
  //         kanban[1].maintenances.push({
  //           ...defaultChecklistStyle,
  //           id: checklist.id,
  //           buildingName: checklist.building.name,
  //           name: checklist.name,
  //           description: checklist.description,
  //           date: checklist.date,
  //           status: checklist.status,
  //           checklistProgress,
  //         });
  //         break;
  //       case 'inProgress':
  //         kanban[2].maintenances.push({
  //           ...defaultChecklistStyle,
  //           id: checklist.id,
  //           name: checklist.name,
  //           description: checklist.description,
  //           date: checklist.date,
  //           status: checklist.status,
  //           checklistProgress,
  //         });
  //         break;
  //       case 'completed':
  //         kanban[3].maintenances.push({
  //           ...defaultChecklistStyle,
  //           id: checklist.id,
  //           name: checklist.name,
  //           description: checklist.description,
  //           date: checklist.date,
  //           status: checklist.status,
  //         });
  //         break;
  //       default:
  //         break;
  //     }
  //   });

  // Vencida, SE ALTERAR A ORDEM DISSO, ALTERAR NO SCRIPT DE DELETAR AS EXPIRADAS
  kanban[0].maintenances.sort((a: any, b: any) => (a.date > b.date ? 1 : -1));

  // Pendente
  kanban[1].maintenances.sort((a: any, b: any) => (a.dueDate > b.dueDate ? 1 : -1));

  if (companyForSelect?.showMaintenancePriority) {
    kanban[1].maintenances.sort((a: any, b: any) => {
      const priorityOrder = { Alta: 3, Média: 2, Baixa: 1 };
      const getPriorityValue = (priorityLabel: string) =>
        priorityOrder[priorityLabel as keyof typeof priorityOrder] || 0;

      return getPriorityValue(b.priorityLabel) - getPriorityValue(a.priorityLabel);
    });
  }

  // Em execução (Vencida + Pendente)
  // checklists
  //   .filter((checklist) => checklist.status === 'inProgress')
  //   .forEach((checklist) => {
  //     const totalItems = checklist.checklistItem.length;
  //     const completedItems = checklist.checklistItem.filter(
  //       (item) => item.status === 'completed',
  //     ).length;
  //     const checklistProgress = `${completedItems} de ${totalItems} itens concluídos`;

  //     kanban[2].maintenances.push({
  //       ...defaultChecklistStyle,
  //       id: checklist.id,
  //       name: checklist.name,
  //       description: checklist.description,
  //       date: checklist.date,
  //       status: checklist.status,
  //       checklistProgress,
  //     });
  //   });

  kanban[2].maintenances.sort((a: any, b: any) => (a.date > b.date ? 1 : -1));

  if (companyForSelect?.showMaintenancePriority) {
    kanban[2].maintenances.sort((a: any, b: any) => {
      const priorityOrder = { Alta: 3, Média: 2, Baixa: 1 };
      const getPriorityValue = (priorityLabel: string) =>
        priorityOrder[priorityLabel as keyof typeof priorityOrder] || 0;

      return getPriorityValue(b.priorityLabel) - getPriorityValue(a.priorityLabel);
    });
  }

  // Concluída e Feita em atraso
  // checklists
  //   .filter((checklist) => checklist.status === 'completed')
  //   .forEach((checklist) =>
  //     kanban[3].maintenances.push({
  //       ...defaultChecklistStyle,
  //       id: checklist.id,
  //       name: checklist.name,
  //       description: checklist.description,
  //       date: checklist.date,
  //       status: checklist.status,
  //     }),
  //   );

  kanban[3].maintenances.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));

  return res.status(200).json({ kanban, maintenanceCategoriesForSelect });
}
