export interface ICreateCompany {
  name: string;
  CNPJ: string;
  CPF: string;
  contactNumber: string;
  image: string;
}

export interface IEditCompany extends ICreateCompany {
  companyId: string;
}

export interface IListCompany {
  take?: number;
  page: number;
  search: string;
}
