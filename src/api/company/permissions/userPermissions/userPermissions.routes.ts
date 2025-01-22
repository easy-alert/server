// LIBS
import { Router } from 'express';

// CONTROLLERS
import { getUserPermissionsByIdController } from './controllers/getUserPermissionsByIdController';
import { updateUserPermissionsByIdController } from './controllers/updateUserPermissionsByIdController';

// ROUTES
export const userPermissions = Router();

userPermissions.get('/:userId', getUserPermissionsByIdController);

userPermissions.put('/:userId', updateUserPermissionsByIdController);
