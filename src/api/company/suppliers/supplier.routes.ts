import { Router } from 'express';
import { deleteSupplier } from './controllers/deleteSupplier';
import { updateSupplier } from './controllers/updateSupplier';
import { createSupplier } from './controllers/createSupplier';
import { findManySuppliers } from './controllers/findManySuppliers';
import { findSupplierById } from './controllers/findSupplierById';
import { findLinkedSuppliersByMaintenanceHistoryId } from './controllers/findLinkedSuppliersByMaintenanceHistoryId';
import { findManySuppliersToSelectByMaintenanceHistoryId } from './controllers/findManySuppliersToSelectByMaintenanceHistoryId';
import { linkSupplierToMaintenanceHistory } from './controllers/linkSupplierToMaintenanceHistory';

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
supplierRouter.post('/link-to-maintenance-history', linkSupplierToMaintenanceHistory);

supplierRouter.put('/', updateSupplier);
