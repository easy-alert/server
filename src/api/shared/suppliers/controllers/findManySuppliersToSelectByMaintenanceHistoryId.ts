import { Response, Request } from 'express';
import { supplierServices } from '../services/supplierServices';
import { Validator } from '../../../../utils/validator/validator';
import { SharedMaintenanceServices } from '../../maintenance/services/sharedMaintenanceServices';

const validator = new Validator();

interface SupplierWithSelection {
  isSelected: boolean;
  id: string;
  name: string;
}

const sharedMaintenanceServices = new SharedMaintenanceServices();

export async function findManySuppliersToSelectByMaintenanceHistoryId(req: Request, res: Response) {
  const { maintenanceHistoryId } = req.params as any as { maintenanceHistoryId: string };

  validator.check([
    { label: 'ID do histórico de manutenção', type: 'string', variable: maintenanceHistoryId },
  ]);

  const {
    Company,
    Maintenance: {
      Category: { id: categoryId },
    },
  } = await sharedMaintenanceServices.findHistoryById({ maintenanceHistoryId });

  const { remainingSuppliers, suggestedSuppliers } =
    await supplierServices.findToSelectByMaintenanceHistoryId({
      maintenanceHistoryId,
      categoryId,
      companyId: Company.id,
    });

  const linkedSuppliersIds = (
    await supplierServices.findManyByMaintenanceHistoryId(maintenanceHistoryId)
  ).map(({ id }) => id);

  const remainingSuppliersWithSelection: SupplierWithSelection[] = remainingSuppliers.map(
    (supplier) => ({
      ...supplier,
      isSelected: linkedSuppliersIds.includes(supplier.id),
    }),
  );

  const suggestedSuppliersWithSelection: SupplierWithSelection[] = suggestedSuppliers.map(
    (supplier) => ({
      ...supplier,
      isSelected: linkedSuppliersIds.includes(supplier.id),
    }),
  );

  return res.status(200).json({
    remainingSuppliers: remainingSuppliersWithSelection,
    suggestedSuppliers: suggestedSuppliersWithSelection,
  });
}
