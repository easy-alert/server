import { Response, Request } from 'express';

import type { TicketStatusName } from '@prisma/client';

import { ticketServices } from '../services/ticketServices';
// import { buildingServices } from '../../../company/buildings/building/services/buildingServices';
import { changeTime } from '../../../../utils/dateTime/changeTime';
// import { checkValues } from '../../../../utils/newValidator';
import getMonths from '../../../../utils/constants/months';

export async function findManyTicketsController(req: Request, res: Response) {
  const { Company } = req;
  const { buildingsNanoId } = req.params as any as { buildingsNanoId: string };
  const { placesId, serviceTypesId, status, year, month, seen, page, take, count } = req.query;

  const buildingName = '';

  const companyIdFilter = Company ? Company.id : undefined;

  const buildingsNanoIdFilter = buildingsNanoId === 'all' ? undefined : buildingsNanoId.split(',');
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

  const monthFilter = month === '' ? undefined : String(month);
  const seenFilter = seen === '' || seen === undefined ? undefined : seen === 'true';

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

  // checkValues([{ label: 'ID da edificação', type: 'string', value: buildingsNanoIdFilter }]);

  // if (buildingsNanoIdFilter !== undefined) {
  //   await ticketServices.checkAccess({ buildingsNanoIdFilter });

  //   buildingName = (await buildingServices.findByNanoId({ buildingsNanoIdFilter })).name;
  // }

  const months = getMonths();

  const findManyTickets = await ticketServices.findMany({
    buildingNanoId: buildingsNanoIdFilter,
    companyId: companyIdFilter,
    statusName: statusFilter,
    startDate,
    endDate,
    placeId: placeIdFilter,
    serviceTypeId: serviceTypeIdFilter,
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
