import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { Validator } from '../../../../utils/validator/validator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

interface IBody {
  id: string;
  cities: { city: string }[];
  states: { state: string }[];
  type: 'country' | 'state' | 'city';
}

const validator = new Validator();

export async function updateSupplierRegion(req: Request, res: Response) {
  const { cities, states, type, id }: IBody = req.body;

  validator.check([
    { label: 'ID da região', type: 'string', variable: id },
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

  await supplierServices.updateRegion({
    data: {
      type,
      cities: {
        deleteMany: {},
        createMany: {
          data: cities,
        },
      },
      states: {
        deleteMany: {},
        createMany: {
          data: states,
        },
      },
    },
    where: {
      id,
    },
  });

  return res.status(201).json({ ServerMessage: { message: 'Região cadastrada com sucesso.' } });
}
