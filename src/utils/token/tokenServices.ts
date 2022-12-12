// LIBS
import { sign, verify } from 'jsonwebtoken';
import 'dotenv/config';

// TYPES
import { prisma } from '../../../prisma';

// CLASS
import { ServerMessage } from '../messages/serverMessage';

export class TokenServices {
  generate({ tokenData }: { tokenData: any }) {
    const secret: any = process.env.JWT_SECRET;

    return sign(tokenData, secret, { expiresIn: '8h' });
  }

  decode({ token }: { token: string }) {
    try {
      const decodedToken = verify(token, process.env.JWT_SECRET!);
      return decodedToken;
    } catch (error) {
      throw new ServerMessage({
        statusCode: 401,
        message: 'Token de ativação inválido ou já utilizado.',
      });
    }
  }

  async saveInDatabase({ token }: { token: string }) {
    await prisma.validationToken.create({
      data: {
        token,
      },
    });
  }

  async find({ token }: { token: string }) {
    const tokenData = await prisma.validationToken.findFirst({
      where: {
        token,
        hasUsed: false,
      },
    });

    if (tokenData === null || tokenData === undefined) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Token de ativação inválido ou já utilizado.',
      });
    }

    return tokenData;
  }

  async markAsUsed({ token }: { token: string }) {
    await prisma.validationToken.update({
      data: {
        hasUsed: true,
      },
      where: {
        token,
      },
    });
  }
}
