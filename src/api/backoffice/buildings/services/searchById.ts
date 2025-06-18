import { prisma } from '../../../../../prisma';

export async function searchById(id: string) {
  const building = await prisma.building.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      city: true,
      streetName: true,
      createdAt: true,
      isBlocked: true,
      companyId: true,
      cep: true,
      Company: {
        select: {
          id: true,
          name: true,
          image: true,
          isBlocked: true,
        },
      },
      UserBuildingsPermissions: {
        select: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              lastAccess: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return building;
}
