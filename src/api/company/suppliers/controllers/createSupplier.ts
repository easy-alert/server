import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { checkValues } from '../../../../utils/newValidator';
import { unmask } from '../../../../utils/dataHandler';

interface IBody {
  name: string;
  city: string;
  image: string;
  link: string;
  state: string;

  cnpj?: string | null;
  phone?: string | null;
  email?: string | null;
}

export async function createSupplier(req: Request, res: Response) {
  const { city, image, link, name, state, email, phone, cnpj }: IBody = req.body;

  checkValues([
    { label: 'Nome', type: 'string', value: name },
    { label: 'Imagem', type: 'string', value: image },
    { label: 'Cidade', type: 'string', value: city },
    { label: 'Site', type: 'string', value: link },
    { label: 'Estado', type: 'string', value: state },
    { label: 'Telefone/Celular', type: 'string', value: phone, required: false },
    { label: 'Email', type: 'email', value: email, required: false },
    { label: 'CNPJ', type: 'CNPJ', value: cnpj, required: false },
  ]);

  await supplierServices.create({
    data: {
      city,
      cnpj: cnpj ? unmask(cnpj) : null,
      image,
      link,
      name,
      state,
      email: email ? email.toLowerCase() : null,
      phone: phone ? unmask(phone) : null,
      companyId: req.Company.id,
    },
  });

  return res.status(201).json({ ServerMessage: { message: 'Fornecedor cadastrado com sucesso.' } });
}
