import { Request, Response } from 'express';

import { listBuildingsForSelect } from '../../../shared/listForSelect/services/listBuildingsForSelect';
import { hasAdminPermission } from '../../../../utils/permissions/hasAdminPermission';
import { handlePermittedBuildings } from '../../../../utils/permissions/handlePermittedBuildings';

export async function listBuildingsForSelectController(req: Request, res: Response) {
  const { companyId, checkPerms } = req.query as { companyId: string; checkPerms: string };

  const companyIdFormatted = companyId || req?.Company?.id;

  if (checkPerms && checkPerms === 'true') {
    const isAdmin = hasAdminPermission(req.Permissions);
    const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

    const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

    const buildings = await listBuildingsForSelect({ companyId: companyIdFormatted, buildingsIds });

    return res.status(200).json({ buildings });
  }

  const buildings = await listBuildingsForSelect({
    companyId: companyIdFormatted,
    buildingsIds: undefined,
  });

  return res.status(200).json({ buildings });
}
