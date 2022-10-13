// #region IUser

interface ICompany {
  Company: {
    id: string;
    name: string;
    contactNumber: string;
    CNPJ?: string;
    CPF?: string;
    createdAt: Date;
    image: string;
  };
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: Date;
  lastAccess: Date;
  passwordHash: string;
  updatedAt: Date;
  isBlocked: boolean;
  UserCompanies: ICompany[];
  UserPermissions: [{ Permission: { name: string } }];
}

// #endregion
