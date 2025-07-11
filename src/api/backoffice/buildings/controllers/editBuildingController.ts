import { Request, Response } from 'express';
import { updateBuildingById } from '../services/updateBuildingById';
import { checkValues } from '../../../../utils/newValidator/checkValues';

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

  checkValues([
    { label: 'ID da edificação', type: 'string', value: buildingId },
    { label: 'nome', type: 'string', value: name },
    { label: 'tipo de edificação', type: 'string', value: buildingTypeId },
    { label: 'CEP', type: 'string', value: cep },
    { label: 'estado', type: 'string', value: state },
    { label: 'cidade', type: 'string', value: city },
    { label: 'data de expiração da garantia', type: 'string', value: warrantyExpiration },
    {
      label: 'base de criação da próxima manutenção',
      type: 'string',
      value: nextMaintenanceCreationBasis,
    },
  ]);

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
        message: 'Edificação atualizada com sucesso.',
      },
      building: updatedBuilding,
    });
  } catch (error: any) {
    return res.status(500).json({
      ServerMessage: {
        statusCode: 500,
        message: error.message || 'Erro interno do servidor ao editar edificação.',
      },
    });
  }
}
