import { prisma } from '../../../../../prisma';

export async function deleteOneTutorial({ id }: { id: string }) {
  return prisma.tutorial.delete({
    where: {
      id,
    },
  });
}
