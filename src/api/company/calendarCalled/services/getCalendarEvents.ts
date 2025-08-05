import { prisma } from '../../../../../prisma';
import { needExist } from '../../../../utils/newValidator';

interface IListCalendarCalled {
  companyId: string;
  year: number;
  buildingId?: string;
}

export async function getCalendarEvents({ companyId, year, buildingId }: IListCalendarCalled) {
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

  const where: any = {
    createdAt: {
      gte: new Date(`${year}-01-01T00:00:00.000Z`),
      lte: new Date(`${year}-12-31T23:59:59.999Z`),
    },
  };

  if (buildingId && buildingId !== 'none' && buildingId !== '') {
    where.buildingId = buildingId;
  }

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

  const groupByDay: Record<string, any[]> = {};
  tickets.forEach((ticket) => {
    const day = ticket.createdAt.toISOString().split('T')[0];
    if (!groupByDay[day]) groupByDay[day] = [];
    groupByDay[day].push(ticket);
  });

  const Days = Object.entries(groupByDay).map(([date, ticketsArr]) => ({
    date,
    pending: ticketsArr.filter((t: any) => t.statusName === 'Pendente').length,
    completed: ticketsArr.filter((t: any) => t.statusName === 'Concluído').length,
    expired: ticketsArr.filter((t: any) => t.statusName === 'Expirado').length,
    tickets: ticketsArr,
  }));

  return { buildings, Days };
}
