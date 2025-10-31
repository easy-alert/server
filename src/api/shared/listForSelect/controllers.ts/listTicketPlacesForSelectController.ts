import { Request, Response } from 'express';

import { listTicketPlaces } from '../services/listTicketPlaces';

export async function listTicketPlacesForSelectController(req: Request, res: Response) {
  const companyId = req?.Company?.id || String(req.query.companyId);

  if (!companyId) {
    return res.status(400).json({ message: 'Empresa não encontrada!' });
  }
  
  // const isAdmin = hasAdminPermission(req.Permissions);
  // const permittedBuildingsIds = handlePermittedBuildings(req.BuildingsPermissions, 'id');

  // const buildingsIds = isAdmin ? undefined : permittedBuildingsIds;

  const ticketPlaces = await listTicketPlaces({ companyId });

  return res.status(200).json({ ticketPlaces });
}
