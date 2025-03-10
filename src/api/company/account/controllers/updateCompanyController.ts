// TYPES
import { Request, Response } from 'express';
import type { CompanyTicketType } from '@prisma/client';

// FUNCTIONS
import { CompanyServices } from '../services/companyServices';

const companyServices = new CompanyServices();

interface IBody {
  companyId: string;
  companyName: string;
  CNPJ: string;
  CPF: string;
  image: string;
  contactNumber: string;
  ticketInfo: string;
  ticketType: CompanyTicketType;
  showMaintenancePriority: boolean;
}

export async function updateCompanyController(req: Request, res: Response) {
  const { Company } = req;
  const {
    companyId,
    companyName,
    CNPJ,
    CPF,
    contactNumber,
    ticketInfo,
    ticketType,
    image,
    showMaintenancePriority,
  } = req.body as IBody;

  if (!Company.id && !companyId) {
    return res.status(400).json({
      ServerMessage: {
        statusCode: 400,
        message: `Empresa não encontrada.`,
      },
    });
  }

  const updatedCompany = await companyServices.edit({
    companyId: Company.id || companyId,
    name: companyName,
    CNPJ,
    CPF,
    contactNumber,
    image,
    showMaintenancePriority,
    ticketInfo,
    ticketType,
  });

  return res.status(200).json({
    updatedCompany,
    ServerMessage: {
      statusCode: 200,
      message: `Informações atualizadas com sucesso.`,
    },
  });
}
