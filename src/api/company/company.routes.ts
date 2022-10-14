// LIBS
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerFile from './docs/swagger.json';

// MIDDLEWARES
import { authMiddleware } from '../../middlewares/auth';
import { uploadRouter } from '../shared/upload/upload.routes';

// CHIELD ROUTES
import { authRouter } from './auth/auth.routes';
import { isCompany } from '../../middlewares/permissions/isCompany';
import { accountRouter } from './account/account.routes';

// ROUTES
export const companyRouter: Router = Router();

companyRouter.use('/upload', authMiddleware, isCompany, uploadRouter);
companyRouter.use('/docs', swaggerUi.serve, (_req: any, res: any) => {
  const html = swaggerUi.generateHTML(swaggerFile);
  res.send(html);
});

companyRouter.use('/auth', authRouter);
companyRouter.use('/account', authMiddleware, isCompany, accountRouter);
companyRouter.use('/companies', authMiddleware, isCompany, companyRouter);
