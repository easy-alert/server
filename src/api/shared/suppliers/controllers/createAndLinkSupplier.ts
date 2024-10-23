import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { checkValues } from '../../../../utils/newValidator';
import { createInitialsAvatar, unmask } from '../../../../utils/dataHandler';
import { SharedMaintenanceServices } from '../../../shared/maintenance/services/sharedMaintenanceServices';

interface IBody {
  name: string;
  city: string;
  image: string;
  link: string;
  state: string;

  cnpj?: string | null;
  phone?: string | null;
  email?: string | null;

  categoriesIds: string[];

  maintenanceHistoryId: string;
}

const sharedMaintenanceServices = new SharedMaintenanceServices();

export async function createAndLinkSupplier(req: Request, res: Response) {
  const {
    city,
    image,
    link,
    name,
    state,
    email,
    phone,
    cnpj,
    categoriesIds,
    maintenanceHistoryId,
  }: IBody = req.body;

  checkValues([
    { label: 'Histórico de manutenção', type: 'string', value: maintenanceHistoryId },
    { label: 'Nome', type: 'string', value: name },
    { label: 'Imagem', type: 'string', value: image, required: false },
    { label: 'Cidade', type: 'string', value: city },
    { label: 'Site', type: 'string', value: link, required: false },
    { label: 'Estado', type: 'string', value: state },
    { label: 'Telefone/Celular', type: 'string', value: phone, required: false },
    { label: 'Email', type: 'email', value: email, required: false },
    { label: 'CNPJ', type: 'CNPJ', value: cnpj, required: false },
    { label: 'Categorias', type: 'array', value: categoriesIds },
  ]);

  // Para adicionar fornecedor como sugerido pra manutenção
  const { Maintenance, Company } = await sharedMaintenanceServices.findHistoryById({
    maintenanceHistoryId,
  });

  const supplier = await supplierServices.create({
    data: {
      city,
      cnpj: cnpj ? unmask(cnpj) : null,
      image: image || createInitialsAvatar(name),
      link: link || null,
      name,
      state,
      email: email ? email.toLowerCase() : null,
      phone: phone ? unmask(phone) : null,
      companyId: Company.id,

      categories: {
        createMany: { data: categoriesIds.map((categoryId) => ({ categoryId })) },
      },
    },
  });

  // Vinculando fornecedor no histórico
  await supplierServices.linkWithMaintenanceHistory({
    maintenanceHistoryId,
    supplierId: supplier.id,
  });

  await supplierServices.linkSuggestedSupplier({
    maintenanceId: Maintenance.id,
    supplierId: supplier.id,
  });

  return res
    .status(201)
    .json({ ServerMessage: { message: 'Fornecedor cadastrado e vinculado com sucesso.' } });
}
