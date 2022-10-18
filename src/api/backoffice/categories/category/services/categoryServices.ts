import { prisma } from '../../../../../utils/prismaClient';

export class CategoryServices {
  async list({ search }: { search: string }) {
    return prisma.category.findMany({
      select: {
        id: true,
        ownerCompanyId: true,
        name: true,
        Maintenances: {
          select: {
            id: true,
            element: true,
            activity: true,
            frequency: true,
            delay: true,
            period: true,
            responsible: true,
            source: true,
            observation: true,
            ownerCompanyId: true,

            FrequencyTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
              },
            },
            DelayTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
              },
            },
            PeriodTimeInterval: {
              select: {
                id: true,
                name: true,
                pluralLabel: true,
                singularLabel: true,
              },
            },
          },
          where: {
            ownerCompanyId: null,
          },
        },
      },
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        ownerCompanyId: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
