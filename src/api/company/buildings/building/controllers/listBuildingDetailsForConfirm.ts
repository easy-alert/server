// # region IMPORTS
import { Request, Response } from 'express';

import { TokenServices } from '../../../../../utils/token/tokenServices';
import { ITokenWhatsAppConfirmation } from '../../../../../utils/token/types';

// CLASS
import { checkValues } from '../../../../../utils/newValidator';
import { findUserById } from '../../../../shared/users/user/services/findUserById';

const tokenServices = new TokenServices();

// #endregion

export async function listBuildingDetailsForConfirm(req: Request, res: Response) {
  const { token } = req.body;

  // #region VALIDATIONS
  checkValues([
    {
      label: 'Token',
      type: 'string',
      value: token,
    },
  ]);

  const foundToken = await tokenServices.find({
    token,
  });

  const { id: userId } = tokenServices.decode({
    token: foundToken.token,
  }) as ITokenWhatsAppConfirmation;

  const user = await findUserById(userId);

  // #endregion

  return res.status(200).json({
    name: user?.Companies[0].Company.name,
    image: user?.Companies[0].Company.image,
  });
}
