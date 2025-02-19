// #region IMPORTS
import { Request, Response } from 'express';

import { updateUser } from '../../../../shared/users/user/services/updateUser';

import { ServerMessage } from '../../../../../utils/messages/serverMessage';
import { TokenServices } from '../../../../../utils/token/tokenServices';
import { ITokenWhatsAppConfirmation } from '../../../../../utils/token/types';
import { checkValues } from '../../../../../utils/newValidator';

const tokenServices = new TokenServices();

// #endregion

export async function contactConfirmBuildingNotificationConfiguration(req: Request, res: Response) {
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

  const { id: userId, confirmType } = tokenServices.decode({
    token: foundToken.token,
  }) as ITokenWhatsAppConfirmation;

  // #endregion

  switch (confirmType) {
    case 'whatsapp':
      await updateUser({
        userId,
        data: {
          phoneNumberIsConfirmed: true,
        },
      });

      await tokenServices.markAsUsed({ token: foundToken.token });

      return res.status(200).json({
        ServerMessage: {
          statusCode: 200,
          message: `Whatsapp confirmado com sucesso.`,
        },
      });

    case 'email':
      await updateUser({
        userId,
        data: {
          emailIsConfirmed: true,
        },
      });

      await tokenServices.markAsUsed({ token: foundToken.token });

      return res.status(200).json({
        ServerMessage: {
          statusCode: 200,
          message: `E-mail confirmado com sucesso.`,
        },
      });

    default:
      throw new ServerMessage({
        statusCode: 400,
        message: 'Tipo do Token inválido',
      });
  }
}
