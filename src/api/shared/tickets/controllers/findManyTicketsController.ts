import { Response, Request } from 'express';

import type { TicketStatusName } from '@prisma/client';

import { ticketServices } from '../services/ticketServices';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';
import getMonths from '../../../../utils/constants/months';
import { changeUTCTime } from '../../../../utils/dateTime';

export async function findManyTicketsController(req: Request, res: Response) {
  const { Company } = req;
  const { buildingsNanoId } = req.params as any as { buildingsNanoId: string };
  const {
    buildingsNanoIdBody,
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
  } = req.query;

  const isAdmin = req.Permissions?.some((permission) =>
    permission?.Permission?.name?.includes('admin'),
  );

  const buildingsIds = buildingsNanoId ?? buildingsNanoIdBody;
  const permittedBuildingsNanoIds = isAdmin
    ? undefined
    : req.BuildingsPermissions?.map((b: any) => b.Building.nanoId);
  let buildingName = '';

  const companyIdFilter = Company ? Company.id : undefined;

  const buildingsNanoIdFilter =
    buildingsIds === 'all' || !buildingsIds ? permittedBuildingsNanoIds : buildingsIds.split(',');
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

  if (buildingsNanoIdFilter?.length === 1 && buildingsNanoId !== 'all') {
    await ticketServices.checkAccess({ buildingNanoId: buildingsNanoId });

    buildingName = (await buildingServices.findByNanoId({ buildingNanoId: buildingsNanoId })).name;
  }

  const months = getMonths();

  const findManyTickets = await ticketServices.findMany({
    buildingNanoId: buildingsNanoIdFilter,
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
