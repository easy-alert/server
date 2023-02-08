import { Request, Response } from 'express';
import { sharedDeleteCategory } from '../../../../shared/categories/controllers/sharedDeleteCategory';

export async function deleteCategory(req: Request, res: Response) {
  await sharedDeleteCategory({
    ownerCompanyId: req.Company.id,
    body: req.body,
  });
  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Categoria excluída com sucesso.',
    },
  });
}
