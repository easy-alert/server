// TYPES
import { Response, Request } from 'express';
import { EmailTransporterServices } from '../../../../utils/emailTransporter/emailTransporterServices';

// CLASS
import { TokenServices } from '../../../../utils/token/tokenServices';
import { Validator } from '../../../../utils/validator/validator';
import { UserServices } from '../../users/user/services/userServices';

const tokenServices = new TokenServices();
const validator = new Validator();
const userServices = new UserServices();
const emailTransporter = new EmailTransporterServices();

export const sendEmailForRecoveryPassword = async (req: Request, res: Response) => {
  const { email, link } = req.body;

  validator.notNull([{ label: 'email', variable: email }]);

  const user = await userServices.findByEmail({ email });

  const token = tokenServices.generate({
    tokenData: {
      userId: user.id,
    },
  });

  await tokenServices.saveInDatabase({ token });

  await emailTransporter.sendRecoveryPasswordEmail({
    toEmail: email,
    subject: 'Alteração de senha',
    text: 'Clique no botão abaixo para recuperar sua senha.',
    link: `${link}?token=${token}`,
  });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'E-mail de recuperação de senha enviado com sucesso.',
    },
  });
};
