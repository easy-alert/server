import { Response, Request } from 'express';

import type { ChecklistStatusName } from '@prisma/client';

import { checklistServices } from '../services/checklistServices';

import { changeUTCTime } from '../../../../utils/dateTime';
import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';

export interface IParsedFilters {
  buildingNames?: string[];
  statusNames?: ChecklistStatusName[];
  startDate: string;
  endDate: string;
}

interface IQuery {
  buildingsId: string;
  status: string;
  startDate: string;
  endDate: string;
  page: string;
  take: string;
}

export async function findChecklistReportController(req: Request, res: Response) {
  const { buildingsId, status, startDate, endDate, page, take } = req.query as unknown as IQuery;
  const { Company } = req;

  const isAdmin = hasAdminPermission(req.Permissions);
  const permittedBuildingsIds = isAdmin
    ? undefined
    : handlePermittedBuildings(req.BuildingsPermissions, 'id');

  const companyIdFilter = Company ? Company?.id : undefined;

  const buildingsIdFilter = !buildingsId ? permittedBuildingsIds : buildingsId.split(',');
  const statusFilter =
    typeof status === 'string' && status !== ''
      ? (status.split(',') as ChecklistStatusName[])
      : undefined;

  const startDateFilter = startDate
    ? changeUTCTime(new Date(String(startDate)), 0, 0, 0, 0)
    : undefined;
  const endDateFilter = endDate
    ? changeUTCTime(new Date(String(endDate)), 23, 59, 59, 999)
    : undefined;

  await checklistServices.checkAccessByCompany({ companyId: Company.id });

  const checklists = await checklistServices.findManyForReport({
    buildingId: buildingsIdFilter,
    companyId: companyIdFilter,
    statusNames: statusFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    page: Number(page),
    take: Number(take),
  });

  const completedCount = checklists.filter((e) => e.status === 'completed').length;
  const pendingCount = checklists.filter((e) => e.status === 'pending').length;
  const inProgressCount = checklists.filter((e) => e.status === 'inProgress').length;

  return res.status(200).json({
    checklists,
    pendingCount,
    inProgressCount,
    completedCount,
  });
}
