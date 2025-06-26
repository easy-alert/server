import type { Request, Response } from 'express';

import { findUniqueCompanyData } from '../../../shared/company/services/findUniqueCompanyData';
import { aggregateCompanyData } from '../../../shared/company/services/aggregateCompanyData';

interface ISelectedCompany {
  completedMaintenanceScore: number;
}

interface ISelectedCompanyResult {
  _count?: {
    id: number;
  };
}

export async function getCompletedMaintenancesRankController(req: Request, res: Response) {
  const { companyId } = req;

  const selectedCompany = await findUniqueCompanyData<ISelectedCompany>({
    data: {
      select: {
        completedMaintenanceScore: true,
      },

      where: {
        id: companyId,
      },
    },
  });

  const selectedCompanyScore = selectedCompany?.completedMaintenanceScore ?? 0;

  const selectedCompanyRankResult = await aggregateCompanyData<ISelectedCompanyResult>({
    data: {
      _count: {
        id: true,
      },

      where: {
        completedMaintenanceScore: {
          gt: selectedCompanyScore,
        },
      },
    },
  });

  // eslint-disable-next-line no-underscore-dangle
  const selectedCompanyRank = (selectedCompanyRankResult?._count?.id ?? 0) + 1;

  return res.status(200).json({
    completedMaintenanceScore: selectedCompanyScore,
    completedMaintenanceScoreRank: selectedCompanyRank, // +1 because rank starts from 0
  });
}
