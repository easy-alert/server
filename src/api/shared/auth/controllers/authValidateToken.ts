// TYPES
import { Request, Response } from 'express';

// CLASS
import { AuthServices } from '../services/authServices';

const authServices = new AuthServices();

export const authValidateToken = async (req: Request, res: Response) => {
  const user = await authServices.validateToken({ userId: req.userId });

  return res.status(200).json({
    User: {
      id: user.id,
      image: user.image,
      name: user.name,
      email: user.email,
      lastAcess: user.lastAccess,
      createdAt: user.createdAt,
      Permissions: user.UserPermissions,
    },
    Company: user.UserCompanies[0].Company,
  });
};
