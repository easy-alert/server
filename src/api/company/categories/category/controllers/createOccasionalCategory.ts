import { Request, Response } from 'express';
import { sharedCreateCategory } from '../../../../shared/categories/controllers/sharedCreateCategory';

export async function createOccasionalCategory(req: Request, res: Response) {
  const category = await sharedCreateCategory({
    ownerCompanyId: req.Company.id,
    body: req.body,
    categoryTypeName: 'common',
  });

  return res.status(200).json({
    category,
    ServerMessage: {
      statusCode: 201,
      message: 'Categoria cadastrada com sucesso.',
    },
  });
}
