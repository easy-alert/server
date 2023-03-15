// TYPES
import { Response, Request } from 'express';

// CLASS
import { TokenServices } from '../../../../utils/token/tokenServices';
import { Validator } from '../../../../utils/validator/validator';
import { UserServices } from '../../users/user/services/userServices';

const tokenServices = new TokenServices();
const validator = new Validator();
const userServices = new UserServices();

export const changePassword = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  validator.notNull([
    { label: 'token', variable: token },
    { label: 'password', variable: password },
  ]);

  await tokenServices.find({ token });

  const { userId } = tokenServices.decode({ token }) as { userId: string };

  await userServices.editPassword({ password, userId });

  await tokenServices.markAsUsed({ token });

  return res.status(200).json({
    ServerMessage: {
      statusCode: 200,
      message: 'Senha alterada com sucesso.',
    },
  });
};
