import type { TicketStatusName } from '@prisma/client';

import { changeUTCTime } from '../dateTime';

interface ITicketsFilter {
  Company: { id: any };
  buildingsNanoId?: any;
  placesId?: any;
  serviceTypesId?: any;
  status?: any;
  seen?: any;
  startDate?: any;
  endDate?: any;
}

export function handleTicketsFilters({
  Company,
  buildingsNanoId,
  placesId,
  serviceTypesId,
  status,
  seen,
  startDate,
  endDate,
}: ITicketsFilter) {
  const companyIdFilter = Company ? Company.id : undefined;

  const buildingsNanoIdFilter =
    buildingsNanoId === 'all' || !buildingsNanoId ? undefined : buildingsNanoId.split(',');
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

  const seenFilter = seen ? seen === 'true' : undefined;

  const startDateFilter = startDate
    ? changeUTCTime(new Date(String(startDate)), 0, 0, 0, 0)
    : undefined;
  const endDateFilter = endDate
    ? changeUTCTime(new Date(String(endDate)), 23, 59, 59, 999)
    : undefined;

  return {
    companyIdFilter,
    buildingsNanoIdFilter,
    placeIdFilter,
    serviceTypeIdFilter,
    statusFilter,
    seenFilter,
    startDateFilter,
    endDateFilter,
  };
}
