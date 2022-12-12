// LIBS
import { Router } from 'express';

// FUNCTIONS
import { authCompany } from './controllers/authCompany';
import { authValidateToken } from '../../shared/auth/controllers/authValidateToken';

// MIDDLEWARES
import { authMiddleware } from '../../../middlewares/auth';

// ROUTES
export const authRouter = Router();

authRouter.post('/login', authCompany);

authRouter.get('/validate/token', authMiddleware, authValidateToken);
