export interface Itoken {
  userId: string;
  Permissions: [
    {
      Permission: {
        name: string;
      };
    },
  ];
  Company?: {
    id: string;
    name: string;
    contactNumber: string;
    CNPJ?: string;
    CPF?: string;
    createdAt: Date;
    image: string;
  };
}

export interface ITokenWhatsAppConfirmation {
  id: string;
  confirmType: 'whatsapp' | 'email';
  iat: number;
  exp: number;
}
