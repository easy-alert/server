// LIBS
import { compare } from 'bcrypt';

// PRISMA
import { prisma } from '../../../../../prisma';

// CLASS
import { ServerMessage } from '../../../../utils/messages/serverMessage';
import { Validator } from '../../../../utils/validator/validator';

const validator = new Validator();

export class AuthServices {
  async canLogin({ email, password }: { email: string; password: string }) {
    const user = await this.findByEmail({ email });

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

    return user!;
  }

  async findByEmail({ email }: { email: string }) {
    const User = await prisma.user.findUnique({
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
                ticketInfo: true,
                ticketType: true,
              },
            },
          },
        },

        Permissions: {
          select: { Permission: { select: { name: true } } },
        },
      },

      where: { email: email.toLowerCase() },
    });

    if (!User) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'E-mail ou senha incorretos.',
      });
    }

    return User;
  }

  async findById({ userId }: { userId: string }) {
    const User = await prisma.user.findUnique({
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
                ticketInfo: true,
                ticketType: true,
                UserCompanies: {
                  select: {
                    User: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        lastAccess: true,
                        createdAt: true,
                        isBlocked: true,
                      },
                    },
                  },
                  // pra não mostrar o user logado na tela de minha conta
                  where: { userId: { not: userId } },

                  orderBy: { User: { name: 'asc' } },
                },
              },
            },
          },
        },

        Permissions: {
          select: { Permission: { select: { name: true } } },
        },
      },

      where: { id: userId },
    });

    if (!User) {
      throw new ServerMessage({
        statusCode: 400,
        message: 'E-mail ou senha incorretos.',
      });
    }

    return User;
  }

  async validateToken({ userId }: { userId: string }) {
    const User = await prisma.user.findUnique({
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
                ticketInfo: true,
                ticketType: true,
                UserCompanies: {
                  select: {
                    User: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        lastAccess: true,
                        createdAt: true,
                        isBlocked: true,
                      },
                    },
                  },
                  // pra não mostrar o user logado na tela de minha conta
                  where: { userId: { not: userId } },

                  orderBy: { User: { name: 'asc' } },
                },
              },
            },
          },
        },

        Permissions: {
          select: { Permission: { select: { name: true } } },
        },
      },

      where: { id: userId },
    });

    validator.notNull([{ label: 'Usuário não encontrado.', variable: User }]);

    return User!;
  }
}
