// LIBS
import express from 'express';
import helmet from 'helmet';

import 'express-async-errors';
import cors from 'cors';

// ROUTES
import { routes } from './api/index';

// CLASS
import { handlerMessage } from './utils/messages/handlerMessage';

import { corsOptions } from './middlewares/corsOptions';
// import { rateLimiter } from './middlewares/rateLimiter';

export class App {
  public server: express.Application;

  constructor() {
    this.server = express();
    this.middleware();
    this.router();
    this.secure();
    this.appError();
  }

  middleware() {
    this.server.use(cors(corsOptions));
    // this.server.use(rateLimiter);
    this.server.use(express.json({ limit: '50mb' }));
    // Set Cache-Control: no-store for all API responses (best practice for APIs)
    this.server.use((_, res, next) => {
      res.set('Cache-Control', 'no-store');
      next();
    });
  }

  router() {
    this.server.use('/api', routes);
  }

  secure() {
    this.server.use(helmet());
  }

  appError() {
    this.server.use(handlerMessage);
  }
}
