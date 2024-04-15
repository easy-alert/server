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
    supportLink: string;
    canAccessChecklists: boolean;
    canAccessTickets: boolean;
  };
}
