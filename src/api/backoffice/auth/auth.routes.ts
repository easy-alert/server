// LIBS
import { Router } from 'express';

// MIDDLEWARES
import { authMiddleware } from '../../../middlewares/auth';
import { authValidateToken } from '../../shared/auth/controllers/authValidateToken';

// FUNCTIONS
import { authBackoffice } from './controllers/authBackoffice';
// import { authValidateTokenBackoffice } from './controllers/authValidateTokenBackoffice';

// ROUTES
export const authRouter = Router();

authRouter.post('/login', authBackoffice);

authRouter.get('/validate/token', authMiddleware, authValidateToken);
