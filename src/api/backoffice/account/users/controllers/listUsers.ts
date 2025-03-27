// TYPES
import { Request, Response } from 'express';

// CLASS
import { userServices } from '../services/userServices';

export async function listUsers(req: Request, res: Response) {
  const { page, search } = req.query as { page: string; search: string };

  const pagination = page ?? 1;

  const { users, usersCount } = await userServices.list({
    page: Number(pagination),
    search: search as string,
  });

  const formattedUsers = users.map((user) => ({
    id: user.id,
    image: user.image,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    lastAccess: user.lastAccess,
    status: user.isBlocked,
  }));

  return res.status(200).json({ users: formattedUsers, usersCount });
}
