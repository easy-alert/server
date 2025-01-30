// LIBS
import { Router } from 'express';

// ROUTES
import { userPermissions } from './userPermissions/userPermissions.routes';
import { userBuildingsPermissions } from './userBuildingsPermissions/userBuildingsPermissions.routes';

// CONTROLLERS
import { getAllPermissionsController } from './permission/controllers/getAllPermissionsController';

// ROUTES
export const permissionsRouter = Router();

// PERMISSIONS
permissionsRouter.get('/', getAllPermissionsController);

// USER BUILDINGS PERMISSIONS
permissionsRouter.use('/user-buildings-permissions', userBuildingsPermissions);

// USER PERMISSIONS
permissionsRouter.use('/user-permissions', userPermissions);
