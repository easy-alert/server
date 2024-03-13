import { Response, Request } from 'express';
import { Validator } from '../../../../utils/validator/validator';
import { supplierServices } from '../services/supplierServices';

const validator = new Validator();

interface IBody {
  name: string;
  description: string;
  image: string;
  link: string;
  occupationArea: string;

  phone?: string | null;
  email?: string | null;
  contractedValue?: number | null;
}

export async function createSupplier(req: Request, res: Response) {
  const { description, image, link, name, occupationArea, contractedValue, email, phone }: IBody =
    req.body;

  validator.check([
    { label: 'Nome', type: 'string', variable: name },
    { label: 'Descrição', type: 'string', variable: description },
    { label: 'Imagem', type: 'string', variable: image },
    { label: 'Link', type: 'string', variable: link },
    { label: 'Área de atuação', type: 'string', variable: occupationArea },

    { label: 'Telefone/Celular', type: 'string', variable: phone, isOptional: true },
    { label: 'E-mail', type: 'string', variable: email, isOptional: true },
    { label: 'Valor contratado', type: 'number', variable: contractedValue, isOptional: true },
  ]);

  await supplierServices.create({
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
  });

  return res.status(201).json({ ServerMessage: { message: 'Fornecedor cadastrado com sucesso.' } });
}
