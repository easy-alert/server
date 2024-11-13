import { prisma } from '../../../../../prisma';

export async function findManyTicketHistoryActivities(ticketId: string) {
  const ticketActivities = await prisma.ticketHistoryActivities.findMany({
    where: {
      ticketId,
    },

    include: {
      images: {
        select: {
          id: true,
          name: true,
          url: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  return { ticketActivities };
}
