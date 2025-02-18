import type { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { prisma } from '.';

export async function migrateResponsibleToUser() {
  const responsibles = await prisma.buildingNotificationConfiguration.findMany({
    include: {
      Building: {
        select: {
          Company: {
            select: {
              id: true
            }
          }
        }
      }
    }
  });

  for (const responsible of responsibles) {
    const randomEmail = `${uuidv4().replace(/-/g, '').slice(0, 10)}@mail.com`;
    const randomPhoneNumber = uuidv4().replace(/-/g, '').slice(0, 14);
    const defaultPassword = '123456789';

    const userEmail = responsible.email || randomEmail;
    const userPhoneNumber = responsible.contactNumber || randomPhoneNumber;
    const userPassword = responsible.password || defaultPassword;

    let existingUser: User | null = null;

    if (responsible.email) {
      existingUser = await prisma.user.findUnique({
        where: { email: responsible.email }
      });
    }

    if (!existingUser && responsible.contactNumber) {
      existingUser = await prisma.user.findUnique({
        where: { phoneNumber: responsible.contactNumber }
      });
    }


    if (!existingUser) {
      const upsertUser = await prisma.user.upsert({
        where: { email: userEmail },
        update: {
          name: responsible.name,
          email: userEmail,
          emailIsConfirmed: responsible.emailIsConfirmed,
          phoneNumber: userPhoneNumber,
          phoneNumberIsConfirmed: responsible.contactNumberIsConfirmed,
          role: responsible.role,
          isMainContact: responsible.isMain,
          showContact: responsible.showContact,
          createdAt: responsible.createdAt,
        },
        create: {
          id: uuidv4(),
          name: responsible.name,
          email: userEmail,
          emailIsConfirmed: responsible.emailIsConfirmed,
          phoneNumber: userPhoneNumber,
          phoneNumberIsConfirmed: responsible.contactNumberIsConfirmed,
          passwordHash: hashSync(userPassword, 12),
          role: responsible.role,
          isMainContact: responsible.isMain,
          showContact: responsible.showContact,
          createdAt: responsible.createdAt,
        }
      });

      await prisma.userCompanies.upsert({
        where: {
          userId_companyId: {
            userId: upsertUser.id,
            companyId: responsible.Building.Company.id
          }
        },
        update: {
          User: {
            connect: {
              id: upsertUser.id
            }
          },
          Company: {
            connect: {
              id: responsible.Building.Company.id
            }
          }
        },
        create: {
          id: uuidv4(),
          User: {
            connect: {
              id: upsertUser.id
            }
          },
          Company: {
            connect: {
              id: responsible.Building.Company.id
            }
          }
        }
      });

      const permissions = await prisma.permission.findMany({
        where: {
          OR: [
            { name: 'access:client' },
            { name: 'access:company' }
          ]
        }
      });

      if (permissions.length > 0) {
        permissions.forEach(async permission => {
          await prisma.userPermissions.upsert({
            where: {
              userId_permissionId: {
                userId: upsertUser.id,
                permissionId: permission.id
              }
            },
            update: {
              User: {
                connect: {
                  id: upsertUser.id
                }
              },
              Permission: {
                connect: {
                  id: permission.id
                }
              }
            },
            create: {
              id: uuidv4(),
              User: {
                connect: {
                  id: upsertUser.id
                }
              },
              Permission: {
                connect: {
                  id: permission.id
                }
              }
            }
          });
        });
      }

      await prisma.userBuildingsPermissions.upsert({
        where: {
          userId_buildingId: {
            userId: upsertUser.id,
            buildingId: responsible.buildingId
          }
        },
        update: {
          isMainContact: responsible.isMain,
          showContact: responsible.showContact,

          User: {
            connect: {
              id: upsertUser.id
            }
          },
          Building: {
            connect: {
              id: responsible.buildingId
            }
          }
        },
        create: {
          id: uuidv4(),
          isMainContact: responsible.isMain,
          showContact: responsible.showContact,

          User: {
            connect: {
              id: upsertUser.id
            }
          },
          Building: {
            connect: {
              id: responsible.buildingId
            }
          }
        }
      });

      await prisma.checklist.updateMany({
        where: {
          syndicId: responsible.id
        },
        data: {
          userId: upsertUser.id
        }
      });

      await prisma.ticket.updateMany({
        where: {
          dismissedById: responsible.id
        },
        data: {
          dismissedByUserId: upsertUser.id
        }
      });

      console.log(`User ${upsertUser.email} migrated`);
    } else {
      console.log(`User with email ${responsible.email} or phone number ${responsible.contactNumber} already exists`);
    }
  }
}
