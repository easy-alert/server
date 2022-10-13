// LIBS
import { Router } from 'express';

// FUNCTIONS
import { authBackoffice } from './controllers/authBackoffice';
import { authValidateToken } from '../../shared/auth/controllers/authValidateToken';

// MIDDLEWARES
import { authMiddleware } from '../../../middlewares/auth';

// ROUTES
export const authRouter = Router();

authRouter.post('/login', authBackoffice);

authRouter.get('/validate/token', authMiddleware, authValidateToken);
