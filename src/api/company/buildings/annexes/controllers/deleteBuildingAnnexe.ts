// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';

// CLASS
import { BuildingAnnexeServices } from '../services/buildingAnnexeServices';

const validator = new Validator();
const buildingAnnexeServices = new BuildingAnnexeServices();

// #endregion

export async function deleteBuildingAnnexe(req: Request, res: Response) {
  const { annexeId } = req.body;

  // #region VALIDATION
  validator.check([
    {
      label: 'ID do anexo',
      type: 'string',
      variable: annexeId,
    },
  ]);
  await buildingAnnexeServices.findById({
    annexeId,
  });
  // #endregion

  const Annexe = await buildingAnnexeServices.delete({ annexeId });

  return res.status(200).json({
    Annexe,
    ServerMessage: {
      message: `Anexo excluído com sucesso.`,
    },
  });
}
