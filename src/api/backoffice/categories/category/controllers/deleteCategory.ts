import { Request, Response } from 'express';

import { sharedDeleteCategory } from '../../../../shared/categories/category/controllers/sharedDeleteCategory';

export async function deleteCategory(req: Request, res: Response) {
  await sharedDeleteCategory({ ownerCompanyId: null, body: req.body });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 201,
      message: 'Categoria excluída com sucesso.',
    },
  });
}
