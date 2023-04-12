/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// TYPES
import { Request, Response } from 'express';
import { ExternalServices } from '../services/externalServices';
import { Validator } from '../../../../utils/validator/validator';
import { IOldExpiredList } from './types';

// CLASS

const validator = new Validator();
const externalServices = new ExternalServices();

export async function listExpired(req: Request, res: Response) {
  const { buildingId } = req.params;

  validator.notNull([{ label: 'ID da edificação', variable: buildingId }]);

  const expiredList = await externalServices.listExpired({
    buildingId,
  });

  const oldExpiredList: IOldExpiredList[] = [];

  expiredList.forEach((data) => {
    oldExpiredList.push({
      sistema: data.Maintenance.element,
      atividade: data.Maintenance.activity,
      data_aviso: data.notificationDate.toISOString().split('T')[0],
      data_vencimento: data.dueDate.toISOString().split('T')[0],
    });
  });

  return res.status(200).json(oldExpiredList);
}
