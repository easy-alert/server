import { prisma } from '../../../../../prisma';

export async function preRegistrationDetailsClientService(token: string) {
  const details = await prisma.preRegistration.findFirst({
    where: {
      id: token,
      status: 'pending',
      expiresAt: {
        gte: new Date(),
      },
    },
    select: {
      clientType: true,
      planType: true,
      monthlyPrice: true,
      implementationPrice: true,
      buildingQuantity: true,
    },
  });

  return details;
}
