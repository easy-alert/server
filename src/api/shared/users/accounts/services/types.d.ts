import { CompanyTicketType } from '@prisma/client';

export interface IEditCompany {
  companyId: string;
  name: string;
  CNPJ: string | null;
  CPF: string | null;
  contactNumber: string;
  image: string;
  isNotifyingOnceAWeek: boolean;
  canAccessChecklists: boolean;
  canAccessTickets: boolean;
  receivePreviousMonthReports: boolean;
  receiveDailyDueReports: boolean;
  ticketInfo: string | null;
  ticketType: CompanyTicketType;
}
