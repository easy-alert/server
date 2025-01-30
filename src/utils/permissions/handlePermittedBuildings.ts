import { Request } from 'express';

export function handlePermittedBuildings(
  buildingsPermissions: Request['BuildingsPermissions'],
  key: keyof Request['BuildingsPermissions'][0]['Building'],
) {
  if (!buildingsPermissions) {
    return [];
  }

  return buildingsPermissions?.map((BuildingPermissions) => BuildingPermissions.Building[key]);
}
