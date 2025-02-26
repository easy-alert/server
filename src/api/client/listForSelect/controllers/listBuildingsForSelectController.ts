import { Request, Response } from 'express';

import { Company } from '@prisma/client';

import { findUserById } from '../../user/services/findUserById';
import { listBuildingsForSelect } from '../../../shared/listForSelect/services/listBuildingsForSelect';
import { findCompanyByUserId } from '../../../shared/company/services/findCompanyByUserId';

import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';

export async function listBuildingsForSelectController(req: Request, res: Response) {
  const { userId, companyId } = req.query as { userId: string; companyId: string };

  let permissionsForSelect: any;
  let companyForSelect: Company | null = null;

  if (userId) {
    const user = await findUserById({ userId });

    permissionsForSelect = user?.Permissions.map((permission) => ({
      Permission: {
        name: permission.Permission.name,
      },
    }));
  }

  if (!companyId) {
    const company = await findCompanyByUserId({ userId });

    companyForSelect = company;
  }

  const isAdmin = hasAdminPermission(permissionsForSelect);
  const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const buildings = await listBuildingsForSelect({
    companyId: companyForSelect?.id!,
    buildingsIds,
  });

  return res.status(200).json({ buildings });
}
