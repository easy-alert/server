import { Response, Request } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { supplierServices } from '../services/supplierServices';

const validator = new Validator();

interface IBody {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  occupationArea: string;

  phone?: string | null;
  email?: string | null;
  contractedValue?: number | null;
}

export async function updateSupplier(req: Request, res: Response) {
  const {
    id,
    description,
    image,
    link,
    name,
    occupationArea,
    contractedValue,
    email,
    phone,
  }: IBody = req.body;

  validator.check([
    { label: 'ID do fornecedor', type: 'string', variable: id },
    { label: 'Nome', type: 'string', variable: name },
    { label: 'Descrição', type: 'string', variable: description },
    { label: 'Imagem', type: 'string', variable: image },
    { label: 'Link', type: 'string', variable: link },
    { label: 'Área de atuação', type: 'string', variable: occupationArea },

    { label: 'Telefone/Celular', type: 'string', variable: phone, isOptional: true },
    { label: 'E-mail', type: 'string', variable: email, isOptional: true },
    { label: 'Valor contratado', type: 'number', variable: contractedValue, isOptional: true },
  ]);

  await supplierServices.update({
    data: {
      description,
      image,
      link,
      name,
      occupationArea,

      email: email ? email.toLowerCase() : null,
      contractedValue: contractedValue ?? null,
      phone: phone || null,
    },
    where: {
      id,
    },
  });

  return res.status(200).json({ ServerMessage: { message: 'Fornecedor editado com sucesso.' } });
}
