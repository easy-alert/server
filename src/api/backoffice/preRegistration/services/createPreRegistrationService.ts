import { clientType, planType } from '@prisma/client';
import { prisma } from '../../../../../prisma';

interface ICreatePreRegistration {
  clientType: clientType;
  buildingQuantity: number;
  planType: planType;
  monthlyPrice: number;
  implementationPrice: number;
}

export class PreRegistrationServices {
  async create(data: ICreatePreRegistration) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    const preRegistration = await prisma.preRegistration.create({
      data: {
        clientType: data.clientType,
        buildingQuantity: data.buildingQuantity,
        planType: data.planType,
        monthlyPrice: data.monthlyPrice,
        implementationPrice: data.implementationPrice,
        expiresAt,
      },
      select: {
        id: true,
      },
    });

    return preRegistration;
  }
}

export const preRegistrationServices = new PreRegistrationServices();
