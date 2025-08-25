export interface ICreateCompany {
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
  clientType?: string;
}

export interface IEditCompany extends ICreateCompany {
  companyId: string;
}

export interface IListCompany {
  take?: number;
  page: number;
  search: string;
}
