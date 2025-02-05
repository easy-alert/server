import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';
import { checkValues } from '../../../../utils/newValidator';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

interface IBody {
  residentName: string;
  residentEmail?: string | null;
  residentApartment: string;
  residentCPF?: string;
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
    residentCPF,
    images,
    types,
  }: IBody = req.body;

  checkValues([
    { label: 'Edificação', type: 'string', value: buildingNanoId },
    { label: 'Descrição', type: 'string', value: description },
    { label: 'Local da ocorrência', type: 'string', value: placeId },
    { label: 'Nome do morador', type: 'string', value: residentName },
    { label: 'E-mail do morador', type: 'email', value: residentEmail, required: false },
    { label: 'Apartamento do morador', type: 'string', value: residentApartment },
    { label: 'CPF do morador', type: 'string', value: residentCPF, required: false },
    { label: 'Imagens', type: 'array', value: images },
    { label: 'Tipo de assistência', type: 'array', value: types },
  ]);

  images?.forEach((data) => {
    checkValues([
      { label: 'Nome da imagem', type: 'string', value: data.name },
      { label: 'Link da imagem', type: 'string', value: data.url },
    ]);
  });

  types?.forEach((data) => {
    checkValues([{ label: 'Tipo de assistência', type: 'string', value: data.serviceTypeId }]);
  });

  await ticketServices.checkAccess({ buildingNanoId });

  const building = await buildingServices.findByNanoId({ buildingNanoId });

  const lowerCaseEmail = residentEmail ? residentEmail?.toLowerCase() : null;

  const ticket = await ticketServices.create({
    data: {
      buildingId: building.id,
      residentName,
      residentApartment,
      residentEmail: lowerCaseEmail,
      residentCPF,
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

  ticketServices.sendCreatedTicketEmails({
    ticketIds: [ticket.id],
  });

  return res.status(201).json({ ServerMessage: { message: 'Chamado aberto com sucesso.' } });
}
