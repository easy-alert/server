// CLASS

import { Validator } from '../../../../utils/validator/validator';
import { sharedCategoryAndMaintenanceServices } from '../../categoryAndMaintenanceTypes/services/sharedCategoryAndMaintenanceServices,';
import { SharedCategoryServices } from '../services/sharedCategoryServices';

const validator = new Validator();
const sharedCategoryServices = new SharedCategoryServices();

export async function sharedCreateCategory({
  ownerCompanyId,
  categoryTypeName,
  body: { name },
}: {
  body: { name: string };
  ownerCompanyId: string | null;
  categoryTypeName: string;
}) {
  validator.notNull([{ label: 'nome da categoria', variable: name }]);

  const categoryType = await sharedCategoryAndMaintenanceServices.findByName({
    name: categoryTypeName,
  });

  const category = await sharedCategoryServices.create({
    name,
    ownerCompanyId,
    categoryTypeId: categoryType.id,
  });

  return category;
}
