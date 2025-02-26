// TYPES
import { Request, Response } from 'express';

// CLASS
import { AuthServices } from '../services/authServices';

const authServices = new AuthServices();

export const authValidateToken = async (req: Request, res: Response) => {
  const { userId } = req;

  const user = await authServices.validateToken({ userId });

  let isCompanyOwner = false;

  if (user.Companies.length > 0) {
    isCompanyOwner = await authServices.isCompanyOwner({
      userId: user.id,
      companyId: user.Companies[0].Company.id,
    });
  }

  return res.status(200).json({
    Company: user.Companies.length > 0 ? user.Companies[0].Company : null,
    User: {
      id: user.id,
      name: user.name,
      email: user.email,
      lastAccess: user.lastAccess,
      isCompanyOwner,
      createdAt: user.createdAt,
      Permissions: user.Permissions,
      BuildingsPermissions: user.UserBuildingsPermissions,
    },
  });
};
