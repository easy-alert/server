import { Request, Response } from 'express';
import { sharedEditCategory } from '../../../../shared/categories/controllers/sharedEditCategory';

export async function editCategory(req: Request, res: Response) {
  await sharedEditCategory({ ownerCompanyId: req.Company.id, body: req.body });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Categoria atualizada com sucesso.',
    },
  });
}
