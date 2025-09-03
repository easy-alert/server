// LIBS
import axios from 'axios';
import 'dotenv/config';

// TYPES
import { NextFunction, Request, Response } from 'express';

// CLASS
import { ServerMessage } from './serverMessage';

// Functions

export const handlerMessage = async (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof ServerMessage) {
    return res.status(err.statusCode).json({
      ServerMessage: { message: err.message },
    });
  }

  if (
    process.env.DATABASE_URL?.includes('sandbox') ||
    process.env.DATABASE_URL?.includes('production')
  ) {
    axios.post('https://ada-logs.herokuapp.com/api/easy-alert/errors/create', {
      projectName: 'Easy Alert',
      environment: process.env.DATABASE_URL?.includes('sandbox') ? 'Sandbox' : 'Production',
      side: 'Server',
      errorStack: err.stack,
      extraInfo: {
        company: req.Company?.name ?? req.body?.email ?? null,
        userId: req?.userId ?? null,
        routeURL: req.originalUrl,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log('\n\n\n ❌ Error ❌ \n\n\n', 'Error Message: ', err.stack, '\n\n\n');

  return res.status(500).json({
    ServerMessage: {
      message: `Oops! Encontramos um problema e nossa equipe foi notificada.`,
    },
  });
};
