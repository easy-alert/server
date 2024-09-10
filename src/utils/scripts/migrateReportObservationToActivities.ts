import { Response, Request } from 'express';
import { prisma } from '../../../prisma';

export async function migrateReportObservationToActivities(_req: Request, res: Response) {
  const reports = await prisma.maintenanceReport.findMany({
    select: {
      createdAt: true,
      observation: true,
      responsibleSyndicId: true,
      maintenanceHistoryId: true,
      MaintenanceHistory: {
        select: {
          Building: {
            select: {
              Company: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
    where: { observation: { not: null } },
  });

  const companies = await prisma.company.findMany({
    select: { id: true, UserCompanies: { select: { User: { select: { name: true } } } } },
  });

  const syndics = await prisma.buildingNotificationConfiguration.findMany();

  const dataForCreateMany: any[] = [];

  for (let index = 0; index < reports.length; index++) {
    const {
      createdAt,
      observation,
      responsibleSyndicId,
      maintenanceHistoryId,
      MaintenanceHistory,
    } = reports[index];

    let author = '';

    if (responsibleSyndicId) {
      const syndic = syndics.find(({ id }) => id === responsibleSyndicId);

      author = syndic?.name!;
    } else {
      const company = companies.find(({ id }) => id === MaintenanceHistory.Building.Company.id);

      author = company?.UserCompanies[0].User.name!;
    }

    dataForCreateMany.push({
      content: observation,
      title: `Nova atividade de ${author}`,
      type: 'comment',
      maintenanceHistoryId,
      createdAt,
    });
  }

  await prisma.maintenanceHistoryActivity.createMany({
    data: dataForCreateMany,
  });

  return res.status(200).json({ message: 'RODOU' });
}
