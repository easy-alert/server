// LIBS
import { Router } from 'express';

// FUNCTIONS
import { authCompany } from './controllers/authCompany';
import { authLoginWithCompany } from './controllers/authLoginWithCompany';
import { authBackofficeCompany } from './controllers/authBackofficeCompany';
import { authValidateToken } from '../../shared/auth/controllers/authValidateToken';

// MIDDLEWARES
import { authMiddleware } from '../../../middlewares/auth';

// ROUTES
export const authRouter = Router();

authRouter.post('/login', authCompany);
authRouter.post('/login-with-company', authLoginWithCompany);

authRouter.post('/backofficeaccess', authBackofficeCompany);

authRouter.get('/validate/token', authMiddleware, authValidateToken);
