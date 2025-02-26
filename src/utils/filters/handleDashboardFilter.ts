import { Request } from 'express';

import { handlePermittedBuildings } from '../permissions/handlePermittedBuildings';
import { hasAdminPermission } from '../permissions/hasAdminPermission';

interface IResponsible {
  some: {
    name: { in: string[] };
  };
}

interface IHandleDashboardFilter {
  companyId: string;
  buildings: string | string[];
  categories: string | string[];
  responsible: string | string[];
  startDate?: Date;
  endDate?: Date;

  permissions: Request['Permissions'];
  buildingsPermissions: Request['BuildingsPermissions'];
}

export interface IDashboardFilter {
  buildings: { in: string[] } | undefined;
  categories: { in: string[] } | undefined;
  responsible: IResponsible | undefined;
  period: { gte: Date; lte: Date };
  companyId: string;
}

export function handleDashboardFilter({
  companyId,
  buildings,
  categories,
  responsible,
  startDate,
  endDate,
  permissions,
  buildingsPermissions,
}: IHandleDashboardFilter) {
  let buildingsArray: string[] | undefined = [];

  const isAdmin = hasAdminPermission(permissions);
  const permittedBuildings = handlePermittedBuildings(buildingsPermissions, 'name');

  if (buildings && JSON.parse(String(buildings))?.length === 0) {
    buildingsArray = isAdmin ? undefined : permittedBuildings;
  } else {
    buildingsArray = JSON.parse(String(buildings));
  }

  const dashboardFilter = {
    companyId,

    period: { lte: endDate, gte: startDate },

    buildings: {
      in: buildingsArray,
    },

    categories:
      categories && JSON.parse(String(categories))?.length > 0
        ? {
            in: JSON.parse(String(categories)),
          }
        : undefined,

    responsible:
      responsible && JSON.parse(String(responsible))?.length > 0
        ? {
            some: {
              name: { in: JSON.parse(String(responsible)) },
            },
          }
        : undefined,
  };

  return dashboardFilter as IDashboardFilter;
}
