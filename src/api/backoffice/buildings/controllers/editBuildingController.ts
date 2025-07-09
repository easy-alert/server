import { Request, Response } from 'express';
import { updateBuildingById } from '../services/updateBuildingById';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export async function editBuildingController(req: Request, res: Response) {
  const { buildingId } = req.params;

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

  try {
    validator.check([
      { label: 'ID da edificação', type: 'string', variable: buildingId },
      { label: 'nome', type: 'string', variable: name },
      { label: 'tipo de edificação', type: 'string', variable: buildingTypeId },
      { label: 'CEP', type: 'string', variable: cep },
      { label: 'estado', type: 'string', variable: state },
      { label: 'cidade', type: 'string', variable: city },
      { label: 'data de expiração da garantia', type: 'string', variable: warrantyExpiration },
      {
        label: 'base de criação da próxima manutenção',
        type: 'string',
        variable: nextMaintenanceCreationBasis,
      },
    ]);
  } catch (validationError: any) {
    return res.status(400).json({
      success: false,
      error: validationError.message || 'Erro de validação nos campos enviados',
    });
  }

  try {
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

    return res.status(200).json({
      ServerMessage: {
        statusCode: 200,
        message: 'Edificação atualizada com sucesso',
      },
      data: updatedBuilding,
    });
  } catch (error: any) {
    console.error('Erro ao editar edificação:', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }

    const errorMap: Record<string, number> = {
      'Edificação não encontrada': 404,
      'Tipo de edificação não encontrado': 400,
    };

    return res.status(errorMap[error.message] || 500).json({
      success: false,
      error: error.message || 'Erro interno do servidor ao editar edificação',
    });
  }
}
