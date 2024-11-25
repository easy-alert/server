import type { TicketStatusName } from '@prisma/client';

import { prisma } from '../../../../../prisma';

export async function findManyStatus({
  statusNameFilter,
}: {
  statusNameFilter?: TicketStatusName;
}) {
  return prisma.ticketStatus.findMany({
    select: {
      name: true,
      label: true,
      color: true,
      backgroundColor: true,
    },
    where: {
      name: statusNameFilter,
    },
  });
}
