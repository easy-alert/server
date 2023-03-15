// LIBS
import { Router } from 'express';

// FUNCTIONS
import { authCompany } from './controllers/authCompany';
import { authValidateToken } from '../../shared/auth/controllers/authValidateToken';

// MIDDLEWARES
import { authMiddleware } from '../../../middlewares/auth';
import { authBackofficeCompany } from './controllers/authBackofficeCompany';

// ROUTES
export const authRouter = Router();

authRouter.post('/login', authCompany);

authRouter.post('/backofficeaccess', authBackofficeCompany);

authRouter.get('/validate/token', authMiddleware, authValidateToken);
