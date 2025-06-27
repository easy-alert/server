import { hashSync } from 'bcrypt';
import { prisma } from '../../../../../../prisma';

interface ICreateUser {
  name: string;
  image?: string;
  role: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export async function registerUser({
  name,
  image,
  role,
  email,
  phoneNumber,
  password,
}: ICreateUser) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: email.toLowerCase() }, { phoneNumber: phoneNumber.toLowerCase() }],
    },
    select: { id: true },
  });

  if (existingUser?.id) {
    throw new Error('Email ou telefone já cadastrados.');
  }

  return prisma.user.create({
    data: {
      name,
      image,
      role,
      email: email.toLowerCase(),
      phoneNumber,
      passwordHash: hashSync(password, 12),
    },
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
      email: true,
      phoneNumber: true,
    },
  });
}
