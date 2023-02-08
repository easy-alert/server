import { prisma } from '../../../../../prisma';
// import { ServerMessage } from '../../../c../utils/messages/serverMessage';
// import { Validator } from '../../../../utils/validator/validator';
import { ICreateMaintenanceReports } from './types';

// const validator = new Validator();

export class SharedMaintenanceReportsServices {
  async create({ data }: ICreateMaintenanceReports) {
    return prisma.maintenanceReport.create({
      data,
    });
  }
}
