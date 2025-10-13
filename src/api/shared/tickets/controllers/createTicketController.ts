import { Response, Request } from 'express';
import { ticketServices } from '../services/ticketServices';
import { ticketFieldsServices } from '../services/ticketFieldsServices';
import { checkValues, ICheckValues } from '../../../../utils/newValidator';
import { buildingServices } from '../../../company/buildings/building/services/buildingServices';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

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

  const buildingSelectedId = buildingId || buildingNanoId;

  if (!buildingSelectedId) {
    return res.status(400).json({ ServerMessage: { message: 'Edificação não encontrada.' } });
  }

  const building = await buildingServices.findByIdOrNanoId({ id: buildingSelectedId });

  if (!building) {
    return res.status(404).json({ ServerMessage: { message: 'Edificação não encontrada.' } });
  }

  const companyId = building.companyId;
  const configEntity = await ticketFieldsServices.findByCompanyId(companyId);
  const cfg = configEntity ? ticketFieldsServices.entityToDto(configEntity) : {
    residentName: { hidden: false, required: true },
    residentPhone: { hidden: false, required: true },
    residentApartment: { hidden: false, required: true },
    residentEmail: { hidden: false, required: true },
    residentCPF: { hidden: false, required: true },
    description: { hidden: false, required: true },
    placeId: { hidden: false, required: true },
    types: { hidden: false, required: true },
    attachments: { hidden: false, required: false },
  };

  const isRequired = (key: keyof typeof cfg) => !!cfg[key]?.required && !cfg[key]?.hidden;
  const attachmentsRequired = !!building?.ticketAnnexRequired || (!!cfg.attachments?.required && !cfg.attachments?.hidden);

  console.log('isRequired("residentEmail")', isRequired('residentEmail'));

  const values: ICheckValues[] = [
    { label: 'Edificação', type: 'object', value: building },
    { label: 'Descrição', type: 'string', value: description, required: isRequired('description') },
    { label: 'Local da ocorrência', type: 'string', value: placeId, required: isRequired('placeId') },
    { label: 'Nome do morador', type: 'string', value: residentName, required: isRequired('residentName') },
    { label: 'Apartamento do morador', type: 'string', value: residentApartment, required: isRequired('residentApartment') },
    { label: 'CPF do morador', type: 'string', value: residentCPF, required: isRequired('residentCPF') },
    { label: 'Telefone do morador', type: 'string', value: residentPhone, required: isRequired('residentPhone') },
    { label: 'Imagens', type: 'array', value: images, required: attachmentsRequired },
    { label: 'Tipo de assistência', type: 'array', value: types, required: isRequired('types') },
  ];

  if (isRequired('residentEmail')) {
    if (!residentEmail) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'O e-mail do morador é obrigatório.',
      });
    }

    values.push({ label: 'E-mail do morador', type: 'email', value: residentEmail, required: true });
  }

  checkValues(values);

  images?.forEach((data) => {
    checkValues([
      { label: 'Nome da imagem', type: 'string', value: data.name },
      { label: 'Link da imagem', type: 'string', value: data.url },
    ]);
  });

  types?.forEach((data) => {
    checkValues([{ label: 'Tipo de assistência', type: 'string', value: data.serviceTypeId }]);
  });

  await ticketServices.checkAccess({ buildingId: building.id });

  const lowerCaseEmail = residentEmail ? residentEmail?.toLowerCase() : null;

  const ticketNumber = await ticketServices.generateTicketNumber({ buildingId: building.id });

  const ticket = await ticketServices.create({
    data: {
      buildingId: building.id,
      ticketNumber,
      residentName,
      residentApartment,
      residentEmail: lowerCaseEmail,
      residentCPF,
      residentPhone,
      placeId: placeId ? placeId : undefined,
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
    buildingId: building.id,
    ticketIds: [ticket.id],
  });

  return res.status(201).json({ ServerMessage: { message: 'Chamado aberto com sucesso.' } });
}
