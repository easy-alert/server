import type { TicketFieldVisibility } from '@prisma/client';

export type TicketFieldKey =
  | 'residentName'
  | 'residentPhone'
  | 'residentApartment'
  | 'residentEmail'
  | 'residentCPF'
  | 'description'
  | 'placeId'
  | 'types'
  | 'attachments';

export type TicketFieldStateDto = {
  hidden: boolean;
  required: boolean;
};

export type TicketFormConfigDto = Record<TicketFieldKey, TicketFieldStateDto>;

export type TicketFormConfigDb = Record<TicketFieldKey, TicketFieldVisibility>;
