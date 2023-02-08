// CLASS

import { Validator } from '../../../../utils/validator/validator';
import { SharedCategoryServices } from '../services/sharedCategoryServices';

const validator = new Validator();
const sharedCategoryServices = new SharedCategoryServices();

export async function sharedCreateCategory({
  ownerCompanyId,
  body: { name },
}: {
  body: { name: string };
  ownerCompanyId: string | null;
}) {
  validator.notNull([{ label: 'nome da categoria', variable: name }]);

  const category = await sharedCategoryServices.create({
    name,
    ownerCompanyId,
  });

  return category;
}
