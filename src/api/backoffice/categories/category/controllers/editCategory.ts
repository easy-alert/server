import { Request, Response } from 'express';

// CLASS

import { Validator } from '../../../../../utils/validator/validator';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { SharedCategoryServices } from '../../../../shared/categories/category/services/sharedCategoryServices';

const validator = new Validator();
const sharedCategoryServices = new SharedCategoryServices();

export async function editCategory(req: Request, res: Response) {
  const { categoryId, name } = req.body;

  validator.notNull([
    { label: 'ID da categoria', variable: categoryId },
    { label: 'nome da categoria', variable: name },
  ]);

  const category = await sharedCategoryServices.findById({ categoryId });

  if (category?.ownerCompanyId !== null) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Você não possui permissão para executar esta ação, pois essa categoria pertence a uma empresa.`,
    });
  }

  await sharedCategoryServices.edit({ name, categoryId });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Categoria atualizada com sucesso.',
    },
  });
}
