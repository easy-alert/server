import { Request, Response } from 'express';

import { sharedCreateCategory } from '../../../../shared/categories/category/controllers/sharedCreateCategory';

export async function createCategory(req: Request, res: Response) {
  const category = await sharedCreateCategory({
    ownerCompanyId: req.Company.id,
    body: req.body,
  });

  return res.status(200).json({
    category,
    ServerMessage: {
      statusCode: 201,
      message: 'Categoria cadastrada com sucesso.',
    },
  });
}
