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
    this.server.use(express.json({ limit: '50mb' }));
    this.server.use(cors(corsOptions));
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
