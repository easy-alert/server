// LIBS
import { sign } from 'jsonwebtoken';
import 'dotenv/config';

// TYPES
import { prisma } from '../prismaClient';

// CLASS
import { ServerMessage } from '../messages/serverMessage';

export class HandlerToken {
  generateToken({ tokenData }: { tokenData: any }) {
    const secret: any = process.env.JWT_SECRET;

    return sign(tokenData, secret, { expiresIn: '8h' });
  }

  async saveTokenInDatabase({ token }: { token: string }) {
    await prisma.validationToken.create({
      data: {
        token,
      },
    });
  }

  async findToken({ token }: { token: string }) {
    const tokenData = await prisma.validationToken.findFirst({
      where: {
        token,
        hasUsed: false,
      },
    });

    if (!tokenData) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Token de ativação inválido ou já utilizado.',
      });
    }

    return tokenData;
  }
}
