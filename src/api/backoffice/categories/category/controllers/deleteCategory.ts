import { Request, Response } from 'express';

// CLASS

import { CategoryServices } from '../services/categoryServices';
import { SharedCategoryServices } from '../../../../shared/categories/category/services/sharedCategoryServices';
import { ServerMessage } from '../../../../../utils/messages/serverMessage';

const sharedCategoryServices = new SharedCategoryServices();

const categoryServices = new CategoryServices();

export async function deleteCategory(req: Request, res: Response) {
  const { categoryId } = req.body;

  const category = await sharedCategoryServices.findById({ categoryId });

  if (category?.ownerCompanyId !== null) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Você não possui permissão para executar esta ação, pois essa categoria pertence a uma empresa.`,
    });
  }

  await categoryServices.delete({ categoryId });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: 'Categoria excluída com sucesso.',
    },
  });
}
