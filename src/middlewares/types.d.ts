export interface IToken {
  userId: string;

  Company: {
    id: string;
    name: string;
    contactNumber: string;
    CNPJ?: string;
    CPF?: string;
    createdAt: Date;
    image: string;
  };

  Permissions: [
    {
      Permission: {
        name: string;
      };
    },
  ];

  BuildingsPermissions: {
    Building: {
      id: string;
      name: string;
    };
  }[];

  iat: number;
  exp: number;
}
