// #region IMPORTS
import { Request, Response } from 'express';

// SERVICES
import { findUserById } from '../../../shared/users/user/services/findUserById';

// CLASS
import { TokenServices } from '../../../../utils/token/tokenServices';

// UTILS
import { checkValues } from '../../../../utils/newValidator';
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { sendEmailConfirmation } from '../../../shared/users/user/services/sendEmailConfirmation';

const tokenServices = new TokenServices();

interface IBody {
  userId: string;
  link: string;
}

export async function sendEmailConfirmationController(req: Request, res: Response) {
  const { userId, link } = req.body as IBody;

  // #region VALIDATIONS
  checkValues([
    {
      label: 'ID do usuário',
      type: 'string',
      value: userId,
    },
    {
      label: 'Link ',
      type: 'string',
      value: link,
    },
  ]);

  const user = await findUserById(userId);

  if (!user?.email) {
    throw new ServerMessage({
      statusCode: 400,
      message:
        'O usuário não possui um telefone configurado como principal para receber notificações.',
    });
  }

  // #region AWAIT 5 MINUTES FOR SEND OTHER NOTIFICATION

  // const actualHoursInMs = new Date().getTime();
  // const notificationHoursInMs = new Date(user.lastNotificationDate).getTime();

  // const dateDiference = (actualHoursInMs - notificationHoursInMs) / 60000;

  // if (dateDiference <= 5) {
  //   throw new ServerMessage({
  //     statusCode: 400,
  //     message: 'Aguarde ao menos 5 minutos para reenviar a confirmação.',
  //   });
  // }
  // #endregion

  // #endregion

  // #region SEND MESSAGE
  const token = tokenServices.generate({
    tokenData: {
      id: userId,
      confirmType: 'email',
    },
  });

  await tokenServices.saveInDatabase({ token });

  await sendEmailConfirmation({ userId, email: user.email, link: `${link}?token=${token}` });

  // #endregion

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Email de confirmação enviado com sucesso.',
    },
  });
}
