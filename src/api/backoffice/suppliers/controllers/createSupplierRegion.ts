import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

interface IBody {
  cities: { city: string }[];
  states: { state: string }[];
  supplierId: string;
  type: 'country' | 'state' | 'city';
}

const validator = new Validator();

export async function createSupplierRegion(req: Request, res: Response) {
  const { cities, states, supplierId, type }: IBody = req.body;

  validator.check([
    { label: 'ID da região', type: 'string', variable: supplierId },
    { label: 'Tipo', type: 'string', variable: type },
  ]);

  if (type === 'state' && states.length === 0) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Informe pelo menos um estado.`,
    });
  }

  if (type === 'city' && cities.length === 0) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Informe pelo menos uma cidade.`,
    });
  }

  await supplierServices.createRegion({
    data: {
      supplierId,
      type,
      cities: {
        createMany: {
          data: cities,
        },
      },
      states: {
        createMany: {
          data: states,
        },
      },
    },
  });

  return res.status(201).json({ ServerMessage: { message: 'Região cadastrada com sucesso.' } });
}
