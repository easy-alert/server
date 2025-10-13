import { prisma } from '../../../../../prisma';

export async function listTicketServiceTypes({ companyId }: { companyId: string }) {
  return prisma.serviceType.findMany({
    select: {
      id: true,
      name: true,
      singularLabel: true,
      pluralLabel: true,
      companyId: true,
    },
    where: {
      OR: [{ companyId }, { companyId: null }],
    },
    orderBy: {
      singularLabel: 'asc',
    },
  });
}
