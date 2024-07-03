import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { checkValues } from '../../../../utils/newValidator';
import { createInitialsAvatar, unmask } from '../../../../utils/dataHandler';

interface IBody {
  id: string;
  name: string;
  city: string;
  image: string;
  link: string;
  state: string;

  cnpj?: string | null;
  phone?: string | null;
  email?: string | null;
  serviceTypeLabels: string[] | undefined;
}

export async function updateSupplier(req: Request, res: Response) {
  const { city, image, link, name, state, email, phone, cnpj, id, serviceTypeLabels }: IBody =
    req.body;

  checkValues([
    { label: 'ID', type: 'string', value: id },
    { label: 'Nome', type: 'string', value: name },
    { label: 'Imagem', type: 'string', value: image, required: false },
    { label: 'Cidade', type: 'string', value: city },
    { label: 'Site', type: 'string', value: link, required: false },
    { label: 'Estado', type: 'string', value: state },
    { label: 'Telefone/Celular', type: 'string', value: phone, required: false },
    { label: 'Email', type: 'email', value: email, required: false },
    { label: 'CNPJ', type: 'CNPJ', value: cnpj, required: false },
    { label: 'Área de atuação', type: 'array', value: serviceTypeLabels },
  ]);

  const { serviceTypes } = supplierServices.createOrConnectServiceTypesService({
    isUpdate: true,
    serviceTypeLabels,
  });

  await supplierServices.update({
    data: {
      city,
      cnpj: cnpj ? unmask(cnpj) : null,
      image: image || createInitialsAvatar(name),
      link: link || null,
      name,
      state,
      email: email ? email.toLowerCase() : null,
      phone: phone ? unmask(phone) : null,
      serviceTypes,
    },
    where: {
      id,
    },
  });

  return res.status(200).json({ ServerMessage: { message: 'Fornecedor editado com sucesso.' } });
}
