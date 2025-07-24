import { prisma } from '../../../../../prisma';

export async function findBuildingById(id: string) {
  const building = await prisma.building.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      buildingTypeId: true,
      image: true,
      deliveryDate: true,
      warrantyExpiration: true,
      keepNotificationAfterWarrantyEnds: true,
      nextMaintenanceCreationBasis: true,
      guestCanCompleteMaintenance: true,
      cep: true,
      city: true,
      state: true,
      neighborhood: true,
      streetName: true,
      mandatoryReportProof: true,
      isActivityLogPublic: true,
      isBlocked: true,
      createdAt: true,
      updatedAt: true,
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
              isBlocked: true,
            },
          },
        },
      },
      BuildingType: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return building;
}
