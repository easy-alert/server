// LIBS
import { Router } from 'express';

// CONTROLLERS
import { authMobile } from './controllers/authMobile';
import { authValidateToken } from '../../shared/auth/controllers/authValidateToken';

// MIDDLEWARES
import { authMiddleware } from '../../../middlewares/auth';

// ROUTES
export const authRouter = Router();

authRouter.post('/login', authMobile);

authRouter.get('/validate/token', authMiddleware, authValidateToken);
