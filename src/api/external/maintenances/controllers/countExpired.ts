/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// TYPES
import { Request, Response } from 'express';
import { ExternalServices } from '../services/externalServices';
import { Validator } from '../../../../utils/validator/validator';

// CLASS

const validator = new Validator();
const externalServices = new ExternalServices();

export async function countExpired(req: Request, res: Response) {
  const { buildingId } = req.params;

  validator.notNull([{ label: 'ID da edificação', variable: buildingId }]);

  const quantidade = await externalServices.countExpired({
    buildingId,
  });

  return res.status(200).json({ quantidade });
}
