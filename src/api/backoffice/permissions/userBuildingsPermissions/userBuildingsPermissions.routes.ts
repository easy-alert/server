// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getUserBuildingsPermissionsByIdController } from './controllers/getUserBuildingsPermissionsByIdController';
import { updateUserBuildingsPermissionsByIdController } from './controllers/updateUserBuildingsPermissionsByIdController';

// ROUTES
export const userBuildingsPermissions = Router();

userBuildingsPermissions.get('/:userId', getUserBuildingsPermissionsByIdController);

userBuildingsPermissions.put('/:userId', updateUserBuildingsPermissionsByIdController);
