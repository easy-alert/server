// TYPES
import { Request, Response } from 'express';

// CLASS
import { AuthServices } from '../services/authServices';

const authServices = new AuthServices();

export const authValidateToken = async (req: Request, res: Response) => {
  const { companyId, userId } = req;

  const user = await authServices.validateToken({ companyId, userId });

  let isCompanyOwner = false;

  if (user.Companies.length > 0) {
    isCompanyOwner = await authServices.isCompanyOwner({
      userId: user.id,
      companyId,
    });
  }

  const selectedCompany = user?.Companies?.find(
    (company) => company?.Company?.id === companyId,
  )?.Company;

  return res.status(200).json({
    origin: 'Company',

    Company: selectedCompany || user?.Companies[0]?.Company || null,

    User: {
      id: user.id,
      name: user.name,
      email: user.email,
      emailIsConfirmed: user.emailIsConfirmed,
      phoneNumber: user.phoneNumber,
      phoneNumberIsConfirmed: user.phoneNumberIsConfirmed,
      role: user.role,
      image: user.image,
      colorScheme: user.colorScheme,

      isBlocked: user.isBlocked,
      isCompanyOwner,

      lastAccess: user.lastAccess,
      createdAt: user.createdAt,

      Permissions: user.Permissions,
      BuildingsPermissions: user.UserBuildingsPermissions,
    },
  });
};
