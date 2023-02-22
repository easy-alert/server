// LIBS
import { compare } from 'bcrypt';

// PRISMA
import { prisma } from '../../../../../prisma';
import { IUser } from './types';

// CLASS
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export class AuthServices {
  async canLogin({ user, password }: { user: IUser; password: string }) {
    const isValuePassword = await compare(password, user.passwordHash);

    if (!isValuePassword) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'E-mail ou senha incorretos.',
      });
    }

    const companyIsBlocked = user.Companies.some((company) => company.Company.isBlocked === true);

    if (user.isBlocked || companyIsBlocked) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'Sua conta está bloqueada, entre em contato com a administração.',
      });
    }
  }

  async findByEmail({ email }: { email: string }) {
    const User = (await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastAccess: true,
        passwordHash: true,
        updatedAt: true,
        isBlocked: true,
        Companies: {
          select: {
            Company: {
              select: {
                id: true,
                name: true,
                contactNumber: true,
                CNPJ: true,
                CPF: true,
                createdAt: true,
                image: true,
                isBlocked: true,
              },
            },
          },
        },

        Permissions: {
          select: { Permission: { select: { name: true } } },
        },
      },

      where: { email: email.toLowerCase() },
    })) as IUser;

    if (!User) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'E-mail ou senha incorretos.',
      });
    }

    return User;
  }

  async validateToken({ userId }: { userId: string }) {
    const User = (await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        lastAccess: true,
        passwordHash: true,
        updatedAt: true,
        isBlocked: true,
        Companies: {
          select: {
            Company: {
              select: {
                id: true,
                name: true,
                contactNumber: true,
                CNPJ: true,
                CPF: true,
                createdAt: true,
                image: true,
              },
            },
          },
        },

        Permissions: {
          select: { Permission: { select: { name: true } } },
        },
      },

      where: { id: userId },
    })) as IUser;

    validator.notNull([{ label: 'Usuário não encontrado.', variable: User }]);

    return User;
  }
}
