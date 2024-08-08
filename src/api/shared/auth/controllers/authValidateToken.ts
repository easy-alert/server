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
      name: user.name,
      email: user.email,
      lastAccess: user.lastAccess,
      createdAt: user.createdAt,
      Permissions: user.Permissions,
    },
    Company: user.Companies.length > 0 ? user.Companies[0].Company : null,
  });
};
