// #region IMPORTS
import { prisma } from '../../../../../utils/prismaClient';

// TYPES
import { ICreateBulding } from './types';

// // CLASS
// import { Validator } from '../../../../../utils/validator/validator';

// const validator = new Validator();

// #endregion

export class BuildingServices {
  async create({ data }: ICreateBulding) {
    await prisma.building.create({
      data,
    });
  }
}
