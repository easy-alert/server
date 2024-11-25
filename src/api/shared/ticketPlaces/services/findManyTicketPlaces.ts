import { prisma } from '../../../../../prisma';

export async function findManyTicketPlaces({ placesFilter }: { placesFilter?: string }) {
  return prisma.ticketPlace.findMany({
    select: {
      id: true,
      label: true,
    },
    where: {
      id: placesFilter,
    },
  });
}
