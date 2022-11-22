import { ICreateAnnexe } from './types';

import { prisma } from '../../../../../../prisma';

export class BuildingAnnexeServices {
  async create({ data }: ICreateAnnexe) {
    return prisma.buildingAnnexe.create({
      data,
    });
  }
}
