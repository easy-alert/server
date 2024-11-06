import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';
import { changeTime } from '../../../../utils/dateTime/changeTime';
import { checkValues } from '../../../../utils/newValidator';
import getMonths from '../../../../utils/constants/months';

export async function findManyTicketsController(req: Request, res: Response) {
  const { buildingNanoId } = req.params as any as { buildingNanoId: string };
  const { year, month, status, placeId, typeId, page, take } = req.query;

  const monthFilter = month === '' ? undefined : String(month);
  const statusFilter = status === '' ? undefined : String(status);
  const placeIdFilter = placeId === '' ? undefined : String(placeId);
  const typeIdFilter = typeId === '' ? undefined : String(typeId);

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

  checkValues([{ label: 'ID da edificação', type: 'string', value: buildingNanoId }]);

  await ticketServices.checkAccess({ buildingNanoId });

  const buildingName = (await buildingServices.findByNanoId({ buildingNanoId })).name;

  const months = getMonths();

  const findManyTickets = await ticketServices.findMany({
    buildingNanoId,
    statusName: statusFilter,
    startDate,
    endDate,
    placeId: placeIdFilter,
    typeId: typeIdFilter,
    page: Number(page),
    take: Number(take),
  });

  const filterOptions = {
    years: findManyTickets.years,
    months,
  };

  return res.status(200).json({ buildingName, tickets: findManyTickets.tickets, filterOptions });
}
