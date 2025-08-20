import { prisma } from '../../../../../prisma';

export async function listTicketPlaces() {
  return prisma.ticketPlace.findMany({
    select: {
      id: true,
      label: true,
    },

    orderBy: {
      label: 'asc',
    },
  });
}
