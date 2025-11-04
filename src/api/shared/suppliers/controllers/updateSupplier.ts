import { Request, Response } from 'express';
import { createInitialsAvatar, unmask } from '../../../../utils/dataHandler';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { checkValues } from '../../../../utils/newValidator';
import { supplierServices } from '../services/supplierServices';

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

  categoriesIds: string[];
}

export async function updateSupplier(req: Request, res: Response) {
  const { city, image, link, name, state, email, phone, cnpj, id, categoriesIds }: IBody = req.body;

  checkValues([
    { label: 'ID', type: 'string', value: id },
    { label: 'Nome', type: 'string', value: name },
    { label: 'Imagem', type: 'string', value: image, required: false },
    { label: 'Cidade', type: 'string', value: city },
    { label: 'Site', type: 'string', value: link, required: false },
    { label: 'Estado', type: 'string', value: state },
    { label: 'Telefone/Celular', type: 'string', value: phone, required: false },
    { label: 'CNPJ', type: 'CNPJ', value: cnpj, required: false },
    { label: 'Categorias', type: 'array', value: categoriesIds },
  ]);

  if (!phone && !email) {
    throw new ServerMessage({
      statusCode: 400,
      message: 'Informe um telefone ou email.',
    });
  }

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

      categories: {
        deleteMany: {},
        createMany: { data: categoriesIds.map((categoryId) => ({ categoryId })) },
      },
    },
    where: {
      id,
    },
  });

  return res.status(200).json({ ServerMessage: { message: 'Fornecedor editado com sucesso.' } });
}
