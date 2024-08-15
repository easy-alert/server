import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { checkValues } from '../../../../utils/newValidator';
import { createInitialsAvatar, unmask } from '../../../../utils/dataHandler';

interface IBody {
  name: string;
  city: string;
  image: string;
  link: string;
  state: string;

  cnpj?: string | null;
  phone?: string | null;
  email?: string | null;

  areaOfActivityLabels: string[];
}

export async function createSupplier(req: Request, res: Response) {
  const { city, image, link, name, state, email, phone, cnpj, areaOfActivityLabels }: IBody =
    req.body;

  checkValues([
    { label: 'Nome', type: 'string', value: name },
    { label: 'Imagem', type: 'string', value: image, required: false },
    { label: 'Cidade', type: 'string', value: city },
    { label: 'Site', type: 'string', value: link, required: false },
    { label: 'Estado', type: 'string', value: state },
    { label: 'Telefone/Celular', type: 'string', value: phone, required: false },
    { label: 'Email', type: 'email', value: email, required: false },
    { label: 'CNPJ', type: 'CNPJ', value: cnpj, required: false },

    { label: 'Área de atuação', type: 'array', value: areaOfActivityLabels },
  ]);

  const { areaOfActivities } = supplierServices.createOrConnectAreaOfActivityService({
    isUpdate: false,
    areaOfActivityLabels,
    companyId: req.Company.id,
  });

  await supplierServices.create({
    data: {
      city,
      cnpj: cnpj ? unmask(cnpj) : null,
      image: image || createInitialsAvatar(name),
      link: link || null,
      name,
      state,
      email: email ? email.toLowerCase() : null,
      phone: phone ? unmask(phone) : null,
      companyId: req.Company.id,
      areaOfActivities,
    },
  });

  return res.status(201).json({ ServerMessage: { message: 'Fornecedor cadastrado com sucesso.' } });
}
