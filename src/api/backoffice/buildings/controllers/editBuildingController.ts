import { Request, Response } from 'express';
import { updateBuildingById } from '../services/updateBuildingById';
import { checkValues } from '../../../../utils/newValidator/checkValues';

export async function editBuildingController(req: Request, res: Response): Promise<void> {
  const { buildingId } = req.params;

  try {
    checkValues([
      { value: req.body.name, label: 'nome', type: 'string', required: true },
      {
        value: req.body.buildingTypeId,
        label: 'tipo de edificação',
        type: 'string',
        required: true,
      },
      { value: req.body.cep, label: 'CEP', type: 'CEP', required: true },
      { value: req.body.state, label: 'estado', type: 'string', required: true },
      { value: req.body.city, label: 'cidade', type: 'string', required: true },
      {
        value: req.body.warrantyExpiration,
        label: 'data de expiração da garantia',
        type: 'date',
        required: true,
      },
      {
        value: req.body.nextMaintenanceCreationBasis,
        label: 'base de criação da próxima manutenção',
        type: 'int',
        required: true,
      },
    ]);

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

    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
      return;
    }

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
