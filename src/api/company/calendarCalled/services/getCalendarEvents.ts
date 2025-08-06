import { Prisma, TicketStatusName } from '@prisma/client';
import { prisma } from '../../../../../prisma';
import { needExist } from '../../../../utils/newValidator';

interface IListCalendarCalled {
  companyId: string;
  year: number;
  month: number;
  buildingIds?: string[];
}

interface TicketGrouped {
  id: string;
  ticketNumber: number;
  residentName: string;
  statusName: TicketStatusName;
  createdAt: Date;
  building: { name: string };
  place: { label: string };
  types: {
    type: {
      id: string;
      label: string;
      color: string;
      backgroundColor: string;
    };
  }[];
}

type GroupByDay = Record<string, TicketGrouped[]>;

export async function getCalendarEvents({
  companyId,
  year,
  month,
  buildingIds,
}: IListCalendarCalled) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { id: true },
  });

  needExist([{ label: 'Empresa', variable: company }]);

  const buildings = await prisma.building.findMany({
    where: {
      companyId,
      isBlocked: false,
    },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  const where: Prisma.TicketWhereInput = {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
    ...(buildingIds && buildingIds.length > 0 && { buildingId: { in: buildingIds } }),
  };

  const tickets = await prisma.ticket.findMany({
    where,
    select: {
      id: true,
      ticketNumber: true,
      residentName: true,
      statusName: true,
      createdAt: true,
      building: {
        select: {
          name: true,
        },
      },
      place: {
        select: {
          label: true,
        },
      },
      types: {
        select: {
          type: {
            select: {
              id: true,
              label: true,
              color: true,
              backgroundColor: true,
            },
          },
        },
      },
    },
  });

  const groupByDay: GroupByDay = {};
  tickets.forEach((ticket) => {
    const day = ticket.createdAt.toISOString().split('T')[0];
    if (!groupByDay[day]) groupByDay[day] = [];
    groupByDay[day].push(ticket as TicketGrouped);
  });

  const Days = Object.entries(groupByDay).map(([date, ticketsArr]) => ({
    date,
    pending: ticketsArr.filter((t: TicketGrouped) => t.statusName === TicketStatusName.open).length,
    completed: ticketsArr.filter((t: TicketGrouped) => t.statusName === TicketStatusName.finished)
      .length,
    expired: ticketsArr.filter((t: TicketGrouped) => t.statusName === TicketStatusName.dismissed)
      .length,
    tickets: ticketsArr,
  }));

  return { buildings, Days };
}
