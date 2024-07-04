import { Router } from 'express';
import { deleteSupplier } from './controllers/deleteSupplier';
import { updateSupplier } from './controllers/updateSupplier';
import { createSupplier } from './controllers/createSupplier';
import { findManySuppliers } from './controllers/findManySuppliers';
import { findSupplierById } from './controllers/findSupplierById';
import { findLinkedSuppliersByMaintenanceHistoryId } from './controllers/findLinkedSuppliersByMaintenanceHistoryId';
import { findManySuppliersToSelectByMaintenanceHistoryId } from './controllers/findManySuppliersToSelectByMaintenanceHistoryId';
import { linkSupplierToMaintenanceHistory } from './controllers/linkSupplierToMaintenanceHistory';
import { unlinkSupplierToMaintenanceHistory } from './controllers/unlinkSupplierToMaintenanceHistory';
import { createAndLinkSupplier } from './controllers/createAndLinkSupplier';

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

supplierRouter.put('/', updateSupplier);
