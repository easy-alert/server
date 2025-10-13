import { Request, Response } from 'express';

import { listTicketPlaces } from '../services/listTicketPlaces';

export async function listTicketPlacesForSelectController(req: Request, res: Response) {
  const companyId = req.Company.id;

  // const isAdmin = hasAdminPermission(req.Permissions);
  // const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  // const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const ticketPlaces = await listTicketPlaces({ companyId });

  res.status(200).json({ ticketPlaces });
}
