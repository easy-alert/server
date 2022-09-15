/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';

// CLASS

import { CategoryServices } from '../../services/categoryServices';
// import { Validator } from '../../../../../utils/validator/validator';
// import { ServerMessage } from '../../../../../utils/messages/serverMessage';

// const validator = new Validator();
const categoryServices = new CategoryServices();

export async function listCategory(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const { search } = req.query;
  // const { categoryId } = req.body;

  const categories = await categoryServices.list({ search: search as string });

  return res.status(200).json(categories);
}

