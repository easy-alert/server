import { Router } from 'express';
import { deleteSupplier } from './controllers/deleteSupplier';
import { updateSupplier } from './controllers/updateSupplier';
import { createSupplier } from './controllers/createSupplier';
import { findManySuppliers } from './controllers/findManySuppliers';
import { findSupplierById } from './controllers/findSupplierById';

export const supplierRouter = Router();

supplierRouter.delete('/:supplierId', deleteSupplier);

supplierRouter.get('/', findManySuppliers);
supplierRouter.get('/:supplierId', findSupplierById);

supplierRouter.post('/', createSupplier);

supplierRouter.put('/', updateSupplier);
