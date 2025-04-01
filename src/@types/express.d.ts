// eslint-disable-next-line no-unused-vars
declare namespace Express {
  export interface Request {
    companyId: string;
    userId: string;
    apiLogId?: string;

    Company: {
      id: string;
      name: string;
      createdAt: Date;
      isBlocked: boolean;
      contactNumber: string;
      CNPJ: string | null;
      CPF: string | null;
      image: string;
      ticketInfo: string | null;
      ticketType: string | null;
    };

    Permissions: Array<{
      Permission: {
        name: string;
      };
    }>;

    BuildingsPermissions: Array<{
      Building: {
        id: string;
        nanoId: string;
        name: string;
      };
    }>;

    iat: number;
    exp: number;

    file: any;
    image_link: any;
  }
}
