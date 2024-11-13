import { prisma, prismaTypes } from '../../../../../prisma';

interface IUpdateOneTicketInput {
  ticketHistoryActivityId: string;
  data: prismaTypes.TicketHistoryActivitiesUpdateArgs['data'];
}

export async function updateOneTicket({ ticketHistoryActivityId, data }: IUpdateOneTicketInput) {
  const ticketHistoryActivity = await prisma.ticketHistoryActivities.update({
    where: {
      id: ticketHistoryActivityId,
    },

    data,
  });

  return { ticketHistoryActivity };
}
