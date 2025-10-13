import { Request, Response } from 'express';

import { listTicketServiceTypes } from '../services/listTicketServiceTypes';

export async function listTicketServiceTypesForSelectController(req: Request, res: Response) {
  const companyId = req.Company.id;

  // const isAdmin = hasAdminPermission(req.Permissions);
  // const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  // const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const ticketServiceTypes = await listTicketServiceTypes({ companyId });

  res.status(200).json({ ticketServiceTypes });
}
