import { Router } from 'express';
import { deleteSupplier } from './controllers/deleteSupplier';
import { updateSupplier } from './controllers/updateSupplier';
import { createSupplier } from './controllers/createSupplier';
import { findManySuppliers } from './controllers/findManySuppliers';
import { findSupplierById } from './controllers/findSupplierById';
import { createSupplierRegion } from './controllers/createSupplierRegion';
import { deleteSupplierRegion } from './controllers/deleteSupplierRegion';
import { updateSupplierRegion } from './controllers/updateSupplierRegion';

export const supplierRouter = Router();

supplierRouter.delete('/:supplierId', deleteSupplier);
supplierRouter.delete('/regions/:regionId', deleteSupplierRegion);

supplierRouter.get('/', findManySuppliers);
supplierRouter.get('/:supplierId', findSupplierById);

supplierRouter.post('/', createSupplier);
supplierRouter.post('/regions', createSupplierRegion);

supplierRouter.put('/', updateSupplier);
supplierRouter.put('/regions', updateSupplierRegion);
