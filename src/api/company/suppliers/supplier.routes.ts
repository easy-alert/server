import { Router } from 'express';
import { deleteSupplier } from './controllers/deleteSupplier';
import { updateSupplier } from './controllers/updateSupplier';
import { createSupplier } from './controllers/createSupplier';
import { findManySuppliers } from './controllers/findManySuppliers';
import { findSupplierById } from './controllers/findSupplierById';
import { findSupplierByMaintenanceHistoryId } from './controllers/findSupplierByMaintenanceHistoryId';

export const supplierRouter = Router();

supplierRouter.delete('/:supplierId', deleteSupplier);

supplierRouter.get('/', findManySuppliers);
supplierRouter.get('/:supplierId', findSupplierById);
supplierRouter.get(
  '/maintenance-history/:maintenanceHistoryId',
  findSupplierByMaintenanceHistoryId,
);

supplierRouter.post('/', createSupplier);

supplierRouter.put('/', updateSupplier);
