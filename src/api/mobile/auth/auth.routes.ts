// LIBS
import { Router } from 'express';

// FUNCTIONS
import { authMobile } from './controllers/authMobile';

// ROUTES
export const authRouter = Router();

authRouter.post('/login', authMobile);
