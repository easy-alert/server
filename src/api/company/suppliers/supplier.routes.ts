import { Router } from 'express';
import { createAndLinkSupplier } from '../../shared/suppliers/controllers/createAndLinkSupplier';
import { createSupplier } from '../../shared/suppliers/controllers/createSupplier';
import { deleteSupplier } from '../../shared/suppliers/controllers/deleteSupplier';
import { findLinkedSuppliersByMaintenanceHistoryId } from '../../shared/suppliers/controllers/findLinkedSuppliersByMaintenanceHistoryId';
import { findManySuppliers } from '../../shared/suppliers/controllers/findManySuppliers';
import { findManySuppliersToSelectByMaintenanceHistoryId } from '../../shared/suppliers/controllers/findManySuppliersToSelectByMaintenanceHistoryId';
import { findSupplierById } from '../../shared/suppliers/controllers/findSupplierById';
import { linkSupplierToMaintenanceHistory } from '../../shared/suppliers/controllers/linkSupplierToMaintenanceHistory';
import { unlinkSupplierToMaintenanceHistory } from '../../shared/suppliers/controllers/unlinkSupplierToMaintenanceHistory';
import { updateSupplier } from '../../shared/suppliers/controllers/updateSupplier';
import { unlinkSupplierToMaintenance } from '../../shared/suppliers/controllers/unlinkSupplierToMaintenance';

export const supplierRouter = Router();

supplierRouter.delete('/:supplierId', deleteSupplier);

supplierRouter.get('/', findManySuppliers);
supplierRouter.get('/:supplierId', findSupplierById);
supplierRouter.get('/selected/:maintenanceHistoryId', findLinkedSuppliersByMaintenanceHistoryId);
supplierRouter.get(
  '/to-select/:maintenanceHistoryId',
  findManySuppliersToSelectByMaintenanceHistoryId,
);

supplierRouter.post('/', createSupplier);
supplierRouter.post('/create-and-link', createAndLinkSupplier);
supplierRouter.post('/link-to-maintenance-history', linkSupplierToMaintenanceHistory);
supplierRouter.post('/unlink-to-maintenance-history', unlinkSupplierToMaintenanceHistory);
supplierRouter.post('/unlink-to-maintenance', unlinkSupplierToMaintenance);

supplierRouter.put('/', updateSupplier);
