import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';
import { checkValues } from '../../../../utils/newValidator';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

interface IBody {
  residentName: string;
  residentEmail?: string | null;
  residentApartment: string;
  description: string;
  placeId: string;
  buildingNanoId: string;

  images: {
    name: string;
    url: string;
  }[];

  types: { serviceTypeId: string }[];
}

export async function createTicketController(req: Request, res: Response) {
  const {
    buildingNanoId,
    description,
    placeId,
    residentApartment,
    residentName,
    residentEmail,
    images,
    types,
  }: IBody = req.body;

  checkValues([
    { label: 'Edificação', type: 'string', value: buildingNanoId },
    { label: 'Descrição', type: 'string', value: description },
    { label: 'Local da ocorrência', type: 'string', value: placeId },
    { label: 'Nome do morador', type: 'string', value: residentName },
    { label: 'E-mail do morador', type: 'string', value: residentEmail, required: false },
    { label: 'Apartamento do morador', type: 'string', value: residentApartment },
    { label: 'Imagens', type: 'array', value: images },
    { label: 'Tipo da manutenção', type: 'array', value: types },
  ]);

  images?.forEach((data) => {
    checkValues([
      { label: 'Nome da imagem', type: 'string', value: data.name },
      { label: 'Link da imagem', type: 'string', value: data.url },
    ]);
  });

  types?.forEach((data) => {
    checkValues([{ label: 'Tipo da manutenção', type: 'string', value: data.serviceTypeId }]);
  });

  await ticketServices.checkAccess({ buildingNanoId });

  const buildingId = (await buildingServices.findByNanoId({ buildingNanoId })).id;

  await ticketServices.create({
    data: {
      buildingId,
      residentName,
      residentApartment,
      residentEmail: residentEmail || null,
      placeId,
      description,
      statusName: 'open',

      images: {
        createMany: {
          data: Array.isArray(images) ? images : [],
        },
      },

      types: {
        createMany: {
          data: Array.isArray(types) ? types : [],
        },
      },
    },
  });

  return res.status(200).json({ ServerMessage: { message: 'Chamado aberto com sucesso.' } });
}
