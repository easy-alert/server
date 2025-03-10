import { CompanyTicketType } from '@prisma/client';

export interface IEditCompany {
  name: string;
  CNPJ: string | null;
  CPF: string | null;
  contactNumber: string;
  image: string;
  companyId: string;
  ticketInfo?: string;
  ticketType?: CompanyTicketType;
  showMaintenancePriority?: boolean;
}
