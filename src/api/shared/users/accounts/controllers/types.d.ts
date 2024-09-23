import { CompanyTicketType } from '@prisma/client';

export interface IEditCompanyBody {
  userId: string;
  companyId: string;
  body: {
    name: string;
    email: string;
    image: string;
    CNPJ: string;
    CPF: string;
    contactNumber: string;
    companyName: string;
    password: string;
    isNotifyingOnceAWeek: boolean;
    canAccessChecklists: boolean;
    canAccessTickets: boolean;
    receivePreviousMonthReports: boolean;
    receiveDailyDueReports: boolean;
    ticketInfo: string | null;
    ticketType: CompanyTicketType;
  };
}
