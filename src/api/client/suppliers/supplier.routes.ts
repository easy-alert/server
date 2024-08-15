import { Router } from 'express';
import { createAndLinkSupplier } from '../../shared/suppliers/controllers/createAndLinkSupplier';
import { findLinkedSuppliersByMaintenanceHistoryId } from '../../shared/suppliers/controllers/findLinkedSuppliersByMaintenanceHistoryId';
import { findManySuppliersToSelectByMaintenanceHistoryId } from '../../shared/suppliers/controllers/findManySuppliersToSelectByMaintenanceHistoryId';
import { findSupplierById } from '../../shared/suppliers/controllers/findSupplierById';
import { linkSupplierToMaintenanceHistory } from '../../shared/suppliers/controllers/linkSupplierToMaintenanceHistory';
import { unlinkSupplierToMaintenanceHistory } from '../../shared/suppliers/controllers/unlinkSupplierToMaintenanceHistory';
import { findManySuppliersByBuildingNanoId } from '../../shared/suppliers/controllers/findManySuppliersByBuildingNanoId';
import { findManyAreaOfActivities } from '../../shared/suppliers/controllers/findManyAreaOfActivities';

export const supplierRouter = Router();

supplierRouter.get('/', findManySuppliersByBuildingNanoId);
supplierRouter.get('/:supplierId', findSupplierById);
supplierRouter.get('/selected/:maintenanceHistoryId', findLinkedSuppliersByMaintenanceHistoryId);
supplierRouter.get('/extras/area-of-activities', findManyAreaOfActivities);

supplierRouter.get(
  '/to-select/:maintenanceHistoryId',
  findManySuppliersToSelectByMaintenanceHistoryId,
);

supplierRouter.post('/create-and-link', createAndLinkSupplier);
supplierRouter.post('/link-to-maintenance-history', linkSupplierToMaintenanceHistory);
supplierRouter.post('/unlink-to-maintenance-history', unlinkSupplierToMaintenanceHistory);
