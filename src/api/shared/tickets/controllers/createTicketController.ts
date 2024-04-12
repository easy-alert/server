import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';
import { checkValues } from '../../../../utils/newValidator';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';
import { EmailTransporterServices } from '../../../../utils/emailTransporter/emailTransporterServices';

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

const emailTransporter = new EmailTransporterServices();

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
    { label: 'E-mail do morador', type: 'email', value: residentEmail, required: false },
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

  const building = await buildingServices.findByNanoId({ buildingNanoId });

  const lowerCaseEmail = residentEmail ? residentEmail?.toLowerCase() : null;

  const ticket = await ticketServices.create({
    data: {
      buildingId: building.id,
      residentName,
      residentApartment,
      residentEmail: lowerCaseEmail,
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

  if (lowerCaseEmail) {
    emailTransporter.sendTicketCreated({
      toEmail: lowerCaseEmail,
      buildingName: building.name,
      residentName,
      ticketNumber: ticket.ticketNumber,
    });
  }

  return res.status(200).json({ ServerMessage: { message: 'Chamado aberto com sucesso.' } });
}
