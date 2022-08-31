// LIBS
import { Router } from 'express';

// MIDDLEWARES
import { authMiddleware } from '../middlewares/auth';

// CHIELD ROUTES
import { authRouter } from './auth/auth.routes';
import { uploadRouter } from './upload/upload.routes';

import { backofficeCompanyRouter } from './companies/company/backoffice/backoffice.routes';

// ROUTES
export const routes: Router = Router();

routes.use('/auth', authRouter);
routes.use('/upload', authMiddleware, uploadRouter);

// BACKOFFICE
routes.use('/backoffice/companies', authMiddleware, backofficeCompanyRouter);
