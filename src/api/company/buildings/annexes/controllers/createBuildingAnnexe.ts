// # region IMPORTS
import { Request, Response } from 'express';
import { Validator } from '../../../../../utils/validator/validator';

// CLASS
import { BuildingServices } from '../../building/services/buildingServices';
import { BuildingAnnexeServices } from '../services/buildingAnnexeServices';

const buildingServices = new BuildingServices();
const validator = new Validator();
const buildingAnnexeServices = new BuildingAnnexeServices();

// #endregion

export async function createBuildingAnnexe(req: Request, res: Response) {
  const { buildingId, name, url } = req.body;

  // #region VALIDATION
  validator.check([
    {
      label: 'ID da edificação',
      type: 'string',
      variable: buildingId,
    },
    {
      label: 'nome do anexo',
      type: 'string',
      variable: name,
    },
    {
      label: 'URL do anexo',
      type: 'string',
      variable: url,
    },
  ]);
  await buildingServices.findById({
    buildingId,
  });
  // #endregion

  const Annexe = await buildingAnnexeServices.create({ data: req.body });

  return res.status(200).json({
    Annexe,
    ServerMessage: {
      message: `Anexo criado com sucesso.`,
    },
  });
}
