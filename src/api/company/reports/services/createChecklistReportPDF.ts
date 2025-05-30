import type {
  Checklist,
  ChecklistImage,
  ChecklistItemStatusName,
  ChecklistStatusName,
} from '@prisma/client';
import { prisma } from '../../../../../prisma';

import { checklistPDFService } from './checklistPDFService';

import { ServerMessage } from '../../../../utils/messages/serverMessage';

import type { IFilterOptions } from '../controllers/generateChecklistReportPDFController';

export interface IDataForPDF {
  checklists: (Checklist & {
    building: { name: string };

    checklistItem: {
      id: string;
      name: string | null;
      description: string | null;
      status: ChecklistItemStatusName;
      updatedAt: Date;
    }[];

    checklistUsers: {
      user: {
        id: string;
        name: string;
      };
    }[];

    status: ChecklistStatusName;
    images: ChecklistImage[];
  })[];
  pendingChecklistsCount: number;
  inProgressChecklistsCount: number;
  completedChecklistCount: number;
}

interface ICreateChecklistReportPDF {
  userId: string;
  companyId: string;
  dataForPDF: IDataForPDF;
  filterOptions: IFilterOptions;
}

export async function createChecklistReportPDF({
  userId,
  companyId,
  dataForPDF,
  filterOptions,
}: ICreateChecklistReportPDF) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { image: true },
  });

  const { id } = await prisma.checklistReportPDF.create({
    data: {
      name: filterOptions.interval,
      authorId: userId,
      authorCompanyId: companyId,
    },
  });

  if (!id) {
    throw new ServerMessage({
      message: 'Erro ao criar relatório.',
      statusCode: 400,
    });
  }

  checklistPDFService({
    reportId: id,
    companyImage: company?.image,
    dataForPDF,
    filterOptions,
  });
}
