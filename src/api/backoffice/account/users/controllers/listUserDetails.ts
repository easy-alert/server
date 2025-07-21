// TYPES
import { Request, Response } from 'express';

// SERVICES
import { userServices } from '../services/userServices';

// CLASS
import { Validator } from '../../../../../utils/validator/validator';

const validator = new Validator();

export async function listUserDetails(req: Request, res: Response) {
  const { userId } = req.params;

  validator.check([{ label: 'ID do usuário', type: 'string', variable: userId }]);

  const user = await userServices.findById({ userId });

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const formattedUser = {
    id: user.id,

    image: user.image,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    lastAccess: user.lastAccess,
    createdAt: user.createdAt,
    isBlocked: user.isBlocked,

    Companies: user.Companies.map((userCompany) => ({
      id: userCompany.Company.id,
      name: userCompany.Company.name,
      image: userCompany.Company.image,
      isBlocked: userCompany.Company.isBlocked,
    })),

    Buildings: user.UserBuildingsPermissions.map((userBuilding) => ({
      id: userBuilding.Building.id,
      name: userBuilding.Building.name,
      image: userBuilding.Building.image,
      isBlocked: userBuilding.Building.isBlocked,
    })),
  };

  return res.status(200).json({ user: formattedUser });
}
