import { prisma } from '../../../../../prisma';

export async function updateChecklistsUsersById({
  checklistId,
  usersIds,
}: {
  checklistId: string;
  usersIds: string[];
}) {
  await prisma.checklistUsers.deleteMany({
    where: {
      checklistId,
    },
  });

  const checklist = await prisma.checklist.findUnique({
    select: {
      id: true,
    },
    where: {
      id: checklistId,
    },
  });

  for (const userId of usersIds) {
    await prisma.checklistUsers.createMany({
      data: {
        checklistId: checklist?.id || '',
        userId,
      },
    });
  }
}
