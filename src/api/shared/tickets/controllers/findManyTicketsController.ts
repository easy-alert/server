import { Response, Request } from 'express';

import type { TicketStatusName } from '@prisma/client';

import { ticketServices } from '../services/ticketServices';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';
import getMonths from '../../../../utils/constants/months';
import { changeUTCTime } from '../../../../utils/dateTime';
import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';

interface IQuery {
  buildingsId: string;
  placesId: string;
  serviceTypesId: string;
  apartmentsNames: string;
  status: string;
  startDate: string;
  endDate: string;
  seen: string;
  page: string;
  take: string;
  count: string;
}

export async function findManyTicketsController(req: Request, res: Response) {
  const {
    buildingsId,
    placesId,
    serviceTypesId,
    apartmentsNames,
    status,
    startDate,
    endDate,
    seen,
    page,
    take,
    count,
  } = req.query as unknown as IQuery;
  const { Company } = req;

  const isAdmin = hasAdminPermission(req.Permissions);
  const permittedBuildingsIds = isAdmin
    ? undefined
    : handlePermittedBuildings(req.BuildingsPermissions, 'id');

  let buildingName = '';

  const companyIdFilter = Company ? Company?.id : undefined;

  const buildingsIdFilter = !buildingsId ? permittedBuildingsIds : buildingsId.split(',');
  const placeIdFilter =
    typeof placesId === 'string' && placesId !== '' ? placesId.split(',') : undefined;
  const serviceTypeIdFilter =
    typeof serviceTypesId === 'string' && serviceTypesId !== ''
      ? serviceTypesId.split(',')
      : undefined;
  const statusFilter =
    typeof status === 'string' && status !== ''
      ? (status.split(',') as TicketStatusName[])
      : undefined;
  const apartmentsNamesFilter =
    typeof apartmentsNames === 'string' && apartmentsNames !== ''
      ? apartmentsNames.split(',')
      : undefined;

  const seenFilter = seen ? seen === 'true' : undefined;

  const startDateFilter = startDate
    ? changeUTCTime(new Date(String(startDate)), 0, 0, 0, 0)
    : undefined;
  const endDateFilter = endDate
    ? changeUTCTime(new Date(String(endDate)), 23, 59, 59, 999)
    : undefined;

  if (buildingsIdFilter?.length === 1) {
    await ticketServices.checkAccess({ buildingId: buildingsIdFilter[0] });

    buildingName = (await buildingServices.findById({ buildingId: buildingsIdFilter[0] })).name;
  }

  const findManyTickets = await ticketServices.findMany({
    buildingId: buildingsIdFilter,
    companyId: companyIdFilter,
    statusName: statusFilter,
    placeId: placeIdFilter,
    serviceTypeId: serviceTypeIdFilter,
    apartmentsNames: apartmentsNamesFilter,
    startDate: startDateFilter,
    endDate: endDateFilter,
    seen: seenFilter,
    page: Number(page),
    take: Number(take),
  });

  const months = getMonths();

  const filterOptions = {
    years: findManyTickets.years,
    months,
  };

  if (count === 'true') {
    return res.status(200).json({
      buildingName,
      ticketsCount: findManyTickets.tickets.length,
    });
  }

  return res.status(200).json({ buildingName, tickets: findManyTickets.tickets, filterOptions });
}
