import { Request, Response } from 'express';
import { updateBuildingById } from '../services/updateBuildingById';

const requiredFields = [
  'name',
  'buildingTypeId',
  'cep',
  'state',
  'city',
  'warrantyExpiration',
  'nextMaintenanceCreationBasis',
];

function validateRequiredFields(body: any): string[] {
  return requiredFields.filter((field) => !body[field]);
}

export async function editBuildingController(req: Request, res: Response): Promise<void> {
  const { buildingId } = req.params;
  const missingFields = validateRequiredFields(req.body);

  if (missingFields.length > 0) {
    res.status(400).json({
      success: false,
      error: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`,
    });
    return;
  }

  try {
    const {
      name,
      buildingTypeId,
      cep,
      state,
      city,
      neighborhood,
      streetName,
      image,
      deliveryDate,
      warrantyExpiration,
      nextMaintenanceCreationBasis,
      keepNotificationAfterWarrantyEnds,
      mandatoryReportProof,
      isActivityLogPublic,
      guestCanCompleteMaintenance,
    } = req.body;

    const updatedBuilding = await updateBuildingById({
      id: buildingId,
      name,
      buildingTypeId,
      cep,
      state,
      city,
      neighborhood,
      streetName,
      image,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      warrantyExpiration: new Date(warrantyExpiration),
      nextMaintenanceCreationBasis,
      keepNotificationAfterWarrantyEnds,
      mandatoryReportProof,
      isActivityLogPublic,
      guestCanCompleteMaintenance,
    });

    res.status(200).json({
      success: true,
      message: 'Edificação atualizada com sucesso',
      data: updatedBuilding,
    });
  } catch (error: any) {
    console.error('Erro ao editar edificação:', error);

    const errorMap: Record<string, number> = {
      'Edificação não encontrada': 404,
      'Tipo de edificação não encontrado': 400,
    };

    res.status(errorMap[error.message] || 500).json({
      success: false,
      error: error.message || 'Erro interno do servidor ao editar edificação',
    });
  }
}
