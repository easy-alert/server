import { prisma, prismaTypes } from '../../../../../prisma';
import type { TicketFieldVisibility } from '@prisma/client';
import type { TicketFormConfigDto, TicketFormConfigEntity } from '../dtos/ticketFieldsConfig.dto';

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

  async upsertByCompanyId(companyId: string, data: Partial<TicketFormConfigEntity>) {
    return prisma.ticketFieldsConfig.upsert({
      where: { companyId },
      create: {
        companyId,
        ...data,
      },
      update: {
        ...data,
      },
    });
  }

  dtoToEntity(dto: Partial<TicketFormConfigDto>): TicketFormConfigEntity {
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

  entityToDto(entity: TicketFormConfigEntity): TicketFormConfigDto {
    const map = (v: TicketFieldVisibility) => ({
      hidden: v === 'hidden',
      required: v === 'required',
    });

    return {
      residentName: map(entity.residentName),
      residentPhone: map(entity.residentPhone),
      residentApartment: map(entity.residentApartment),
      residentEmail: map(entity.residentEmail),
      residentCPF: map(entity.residentCPF),
      description: map(entity.description),
      placeId: map(entity.placeId),
      types: map(entity.types),
      attachments: map(entity.attachments),
    };
  }
}

export const ticketFieldsServices = new TicketFieldsServices();
