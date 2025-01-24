import { Response, Request } from 'express';

import { buildingServices } from '../services/buildingServices';

export async function updateBuildingApartmentsController(req: Request, res: Response) {
  const { id: companyId } = req.Company;
  const { buildingId } = req.params;
  const { apartments } = req.body as {
    apartments: {
      id?: string;
      number: string;
      floor?: string;
    }[];
  };

  await buildingServices.updateBuildingApartments({ companyId, buildingId, apartments });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: `Apartamentos alterados com sucesso.`,
    },
  });
}
