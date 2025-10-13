import { Response, Request } from 'express';

import { ticketServices } from '../services/ticketServices';
import { ticketFieldsServices } from '../services/ticketFieldsServices';

import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';

import { findTicketReportController } from './findTicketReportController';
import { findManyTicketsController } from './findManyTicketsController';

export async function findTicketByIdController(req: Request, res: Response) {
  const { ticketId } = req.params as any as { ticketId: string };

  if (ticketId === 'reports') {
    return findTicketReportController(req, res);
  }

  if (ticketId === 'buildings') {
    return findManyTicketsController(req, res);
  }

  checkValues([{ label: 'ID do chamado', type: 'string', value: ticketId }]);

  const ticket = await ticketServices.findById(ticketId);

  if (!ticket.building?.Company?.canAccessTickets) {
    throw new ServerMessage({
      statusCode: 403,
      message: `Sua empresa não possui acesso a este módulo.`,
    });
  }

  const cfgEntity = ticket.building?.companyId
    ? await ticketFieldsServices.findByCompanyId(ticket.building.companyId)
    : null;
  const cfgDto = cfgEntity ? ticketFieldsServices.entityToDto(cfgEntity) : {
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

  return res.status(200).json({ ticket, fieldsConfig: cfgDto });
}
