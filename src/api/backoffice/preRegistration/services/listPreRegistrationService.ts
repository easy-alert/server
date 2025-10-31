import { prisma } from '../../../../../prisma';

export async function listPreRegistrationServices() {
  const preRegistrations = await prisma.preRegistration.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return preRegistrations;
}
