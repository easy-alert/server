import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';
import { SharedCategoryServices } from '../services/sharedCategoryServices';

const validator = new Validator();
const sharedCategoryServices = new SharedCategoryServices();

export async function sharedEditCategory({
  ownerCompanyId,
  body: { categoryId, name },
}: {
  ownerCompanyId: string | null;
  body: { categoryId: string; name: string };
}) {
  validator.notNull([
    { label: 'ID da categoria', variable: categoryId },
    { label: 'nome da categoria', variable: name },
  ]);

  const categoryData = await sharedCategoryServices.findById({ categoryId });

  if (categoryData?.ownerCompanyId !== ownerCompanyId) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Você não possui permissão para executar esta ação, pois essa categoria pertence a uma empresa.`,
    });
  }

  const category = await sharedCategoryServices.edit({ name, categoryId });

  return category;
}
