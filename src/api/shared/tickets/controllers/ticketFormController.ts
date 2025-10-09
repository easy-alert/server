import { Request, Response } from 'express';
import { ticketFieldsServices } from '../services/ticketFieldsServices';
import type { TicketFormConfigDto } from '../dtos/ticketFieldsConfig.dto';
import { ticketServices } from '../services/ticketServices';

export class TicketFormController {
  async get(req: Request, res: Response) {
    const { companyId } = req;

    await ticketServices.checkAccessByCompany({ companyId });

    const config = await ticketFieldsServices.findByCompanyId(companyId);

    if (!config) {
      const empty: TicketFormConfigDto = {
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

      return res.status(200).json(empty);
    }

    const dto = ticketFieldsServices.entityToDto(config);
    return res.status(200).json(dto);
  }

  async upsert(req: Request, res: Response) {
    const { companyId } = req;
    const body = req.body as TicketFormConfigDto;

    await ticketServices.checkAccessByCompany({ companyId });

    const configEntity = ticketFieldsServices.dtoToEntity(body);
    await ticketFieldsServices.upsertByCompanyId(companyId, configEntity)

    return res.status(200).json();
  }
}

