import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';
import { checkValues, needExist } from '../../../../utils/newValidator';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';

interface IBody {
  buildingId?: string;
  buildingNanoId?: string;
  residentName: string;
  residentEmail?: string | null;
  residentApartment: string;
  residentCPF?: string;
  residentPhone?: string;
  description: string;
  placeId: string;

  images: {
    name: string;
    url: string;
  }[];

  types: { serviceTypeId: string }[];
}

export async function createTicketController(req: Request, res: Response) {
  const {
    buildingId,
    buildingNanoId,
    description,
    placeId,
    residentApartment,
    residentName,
    residentEmail,
    residentPhone,
    residentCPF,
    images,
    types,
  }: IBody = req.body;

  const buildingSelected = buildingId || buildingNanoId;

  needExist([{ label: 'Edificação', variable: buildingSelected }]);

  checkValues([
    { label: 'Edificação', type: 'string', value: buildingSelected },
    { label: 'Descrição', type: 'string', value: description },
    { label: 'Local da ocorrência', type: 'string', value: placeId },
    { label: 'Nome do morador', type: 'string', value: residentName },
    { label: 'E-mail do morador', type: 'email', value: residentEmail, required: false },
    { label: 'Apartamento do morador', type: 'string', value: residentApartment },
    { label: 'CPF do morador', type: 'string', value: residentCPF, required: false },
    { label: 'Telefone do morador', type: 'string', value: residentPhone, required: false },
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

  let building = null;

  if (buildingSelected?.length === 12) {
    building = await buildingServices.findByNanoId({
      buildingNanoId: buildingSelected,
    });
  } else {
    building = await buildingServices.findById({ buildingId: buildingSelected! });
  }

  checkValues([{ label: 'Edificação', type: 'string', value: building?.id }]);

  await ticketServices.checkAccess({ buildingId: building?.id });

  const lowerCaseEmail = residentEmail ? residentEmail?.toLowerCase() : null;

  const ticketNumber = await ticketServices.generateTicketNumber({ buildingId: building?.id });

  const ticket = await ticketServices.create({
    data: {
      buildingId: building?.id,
      ticketNumber,
      residentName,
      residentApartment,
      residentEmail: lowerCaseEmail,
      residentCPF,
      residentPhone,
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
    buildingId: building?.id,
    ticketIds: [ticket.id],
  });

  return res.status(201).json({ ServerMessage: { message: 'Chamado aberto com sucesso.' } });
}
