// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getUserBuildingsPermissionsByIdController } from './controllers/getUserBuildingsPermissionsByIdController';
import { updateUserBuildingsPermissionsByIdController } from './controllers/updateUserBuildingsPermissionsByIdController';
import { getUserBuildingsByIdController } from './controllers/getUserBuildingsByIdController';

// ROUTES
export const userBuildingsPermissions = Router();

userBuildingsPermissions.get('/:userId', getUserBuildingsPermissionsByIdController);
userBuildingsPermissions.put('/:userId', updateUserBuildingsPermissionsByIdController);

userBuildingsPermissions.put(
  '/:userId/buildings/:buildingId',
  updateUserBuildingsPermissionsByIdController,
);

userBuildingsPermissions.get('/users/:buildingId', getUserBuildingsByIdController);
