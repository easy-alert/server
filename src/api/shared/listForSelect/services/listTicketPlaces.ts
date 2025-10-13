import { prisma } from '../../../../../prisma';

export async function listTicketPlaces({ companyId }: { companyId: string }) {
  return prisma.ticketPlace.findMany({
    select: {
      id: true,
      label: true,
      companyId: true,
    },
    where: {
      // registros sem companyId serão considerados de todas as empresas
      OR: [{ companyId }, { companyId: null }],
    },
    orderBy: {
      label: 'asc',
    },
  });
}
