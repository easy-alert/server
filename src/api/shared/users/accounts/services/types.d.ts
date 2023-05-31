export interface IEditCompany {
  companyId: string;
  name: string;
  CNPJ: string | null;
  CPF: string | null;
  contactNumber: string;
  image: string;
  isNotifyingOnceAWeek: boolean;
  supportLink: string;
}
