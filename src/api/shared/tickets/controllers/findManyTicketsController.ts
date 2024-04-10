import { Response, Request } from 'express';
import { TicketStatusName } from '@prisma/client';
import { checkDateRanges, checkValues } from '../../../../utils/newValidator';
import { ticketServices } from '../services/ticketServices';
import { handleQueryPage, handleQueryTake } from '../../../../utils/dataHandler';
import { setToFilterStartDate, setToFilterEndDate } from '../../../../utils/dateTime';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

type TQuery = string | undefined;

interface IQuery {
  page: TQuery;
  take: TQuery;
  initialCreatedAt: TQuery;
  finalCreatedAt: TQuery;
  statusName?: TicketStatusName;
}

export async function findManyTicketsController(req: Request, res: Response) {
  const { buildingNanoId } = req.params as any as { buildingNanoId: string };
  const { page, take, statusName } = req.query as any as IQuery;
  let { initialCreatedAt, finalCreatedAt } = req.query as any as IQuery;

  initialCreatedAt = initialCreatedAt || undefined;
  finalCreatedAt = finalCreatedAt || undefined;

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingNanoId },
    { label: 'Data inicial', type: 'date', value: initialCreatedAt, required: false },
    { label: 'Data final', type: 'date', value: finalCreatedAt, required: false },
  ]);

  checkDateRanges([
    { label: 'Data de criação', startDate: initialCreatedAt, endDate: finalCreatedAt },
  ]);

  await ticketServices.checkAccess({ buildingNanoId });

  const { status, tickets } = await ticketServices.findMany({
    buildingNanoId,
    page: handleQueryPage(page),
    take: handleQueryTake(take),
    initialCreatedAt: setToFilterStartDate(initialCreatedAt),
    finalCreatedAt: setToFilterEndDate(finalCreatedAt),
    statusName: statusName || undefined,
  });

  const buildingName = (await buildingServices.findByNanoId({ buildingNanoId })).name;

  return res.status(200).json({ tickets, buildingName, status });
}
