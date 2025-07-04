import { prisma } from '../../../../../prisma';

interface IUpdateBuildingById {
  id: string;
  name: string;
  buildingTypeId: string;
  cep: string;
  state: string;
  city: string;
  neighborhood?: string;
  streetName?: string;
  image?: string;
  deliveryDate?: Date;
  warrantyExpiration: Date;
  nextMaintenanceCreationBasis?: string;
  keepNotificationAfterWarrantyEnds?: boolean;
  mandatoryReportProof?: boolean;
  isActivityLogPublic?: boolean;
  guestCanCompleteMaintenance?: boolean;
}

interface IChangeIsBlockedBuilding {
  buildingId: string;
}

export async function updateBuildingById(params: IUpdateBuildingById) {
  const { id, buildingTypeId, ...rest } = params;

  const existingBuilding = await prisma.building.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingBuilding) {
    throw new Error('Edificação não encontrada');
  }

  if (buildingTypeId) {
    const buildingType = await prisma.buildingType.findUnique({
      where: { id: buildingTypeId },
      select: { id: true },
    });

    if (!buildingType) {
      throw new Error('Tipo de edificação não encontrado');
    }
  }

  const dataToUpdate: Record<string, any> = { buildingTypeId };

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined) {
      dataToUpdate[key] = value;
    }
  });

  const updatedBuilding = await prisma.building.update({
    where: { id },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      buildingTypeId: true,
      cep: true,
      state: true,
      city: true,
      neighborhood: true,
      streetName: true,
      deliveryDate: true,
      warrantyExpiration: true,
      nextMaintenanceCreationBasis: true,
      keepNotificationAfterWarrantyEnds: true,
      mandatoryReportProof: true,
      isActivityLogPublic: true,
      guestCanCompleteMaintenance: true,
      image: true,
      isBlocked: true,
      createdAt: true,
      updatedAt: true,
      BuildingType: {
        select: {
          id: true,
          name: true,
        },
      },
      Company: {
        select: {
          id: true,
          name: true,
          image: true,
          isBlocked: true,
        },
      },
    },
  });

  return updatedBuilding;
}

export async function changeIsBlockedBuilding({ buildingId }: IChangeIsBlockedBuilding) {
  const building = await prisma.building.findUnique({
    where: { id: buildingId },
    select: { id: true, isBlocked: true },
  });

  if (!building) throw new Error('Edificação não encontrada');

  return prisma.building.update({
    where: { id: buildingId },
    data: { isBlocked: !building.isBlocked },
    select: {
      id: true,
      name: true,
      cep: true,
      streetName: true,
      neighborhood: true,
      city: true,
      state: true,
      isBlocked: true,
      createdAt: true,
      image: true,
      BuildingType: {
        select: {
          name: true,
        },
      },
      Company: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}
