import { prisma } from '../../../../../prisma';

export async function listTicketServiceTypes() {
  return prisma.serviceType.findMany({
    select: {
      id: true,
      name: true,
      singularLabel: true,
      pluralLabel: true,
    },

    orderBy: {
      singularLabel: 'asc',
    },
  });
}
