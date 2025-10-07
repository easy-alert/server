import { prisma, prismaTypes } from '../../../../../prisma';
import type { TicketFieldVisibility } from '@prisma/client';
import type { TicketFormConfigDto, TicketFormConfigDb } from '../dtos/ticketFieldsConfig.dto';

export class TicketFieldsServices {
  async create(data: prismaTypes.TicketFieldsConfigCreateInput) {
    return prisma.ticketFieldsConfig.create({
      data,
    });
  }

  async findByCompanyId(companyId: string) {
    return prisma.ticketFieldsConfig.findUnique({
      where: { companyId },
    });
  }

  async upsertByCompanyId(companyId: string, data: Partial<TicketFormConfigDb>) {
    return prisma.ticketFieldsConfig.upsert({
      where: { companyId },
      create: {
        companyId,
        ...(data as any),
      },
      update: {
        ...(data as any),
      },
    });
  }

  mapDtoToDb(dto: Partial<TicketFormConfigDto>): TicketFormConfigDb {
    const map = (hidden: boolean, required: boolean): TicketFieldVisibility => {
      if (hidden) return 'hidden';
      if (required) return 'required';
      return 'visible';
    };

    return {
      residentName: map(!!dto.residentName?.hidden, !!dto.residentName?.required),
      residentPhone: map(!!dto.residentPhone?.hidden, !!dto.residentPhone?.required),
      residentApartment: map(!!dto.residentApartment?.hidden, !!dto.residentApartment?.required),
      residentEmail: map(!!dto.residentEmail?.hidden, !!dto.residentEmail?.required),
      residentCPF: map(!!dto.residentCPF?.hidden, !!dto.residentCPF?.required),
      description: map(!!dto.description?.hidden, !!dto.description?.required),
      placeId: map(!!dto.placeId?.hidden, !!dto.placeId?.required),
      types: map(!!dto.types?.hidden, !!dto.types?.required),
      attachments: map(!!dto.attachments?.hidden, !!dto.attachments?.required),
    };
  }

  mapDbToDto(db: TicketFormConfigDb): TicketFormConfigDto {
    const map = (v: TicketFieldVisibility) => ({
      hidden: v === 'hidden',
      required: v === 'required',
    });

    return {
      residentName: map(db.residentName),
      residentPhone: map(db.residentPhone),
      residentApartment: map(db.residentApartment),
      residentEmail: map(db.residentEmail),
      residentCPF: map(db.residentCPF),
      description: map(db.description),
      placeId: map(db.placeId),
      types: map(db.types),
      attachments: map(db.attachments),
    };
  }
}

export const ticketFieldsServices = new TicketFieldsServices();

