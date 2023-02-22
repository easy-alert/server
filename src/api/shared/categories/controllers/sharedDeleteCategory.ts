import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { SharedCategoryServices } from '../services/sharedCategoryServices';

const sharedCategoryServices = new SharedCategoryServices();

export async function sharedDeleteCategory({
  ownerCompanyId,
  body: { categoryId },
}: {
  ownerCompanyId: string | null;
  body: { categoryId: string };
}) {
  const category = await sharedCategoryServices.findById({ categoryId });

  if (category?.ownerCompanyId !== ownerCompanyId) {
    throw new ServerMessage({
      statusCode: 400,
      message: `Você não possui permissão para executar esta ação, pois essa categoria pertence a uma empresa.`,
    });
  }

  await sharedCategoryServices.delete({ categoryId });
}
