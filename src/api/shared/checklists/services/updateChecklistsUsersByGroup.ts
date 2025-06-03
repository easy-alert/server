import { prisma } from '../../../../../prisma';

export async function updateChecklistsUsersByGroup({
  groupId,
  usersIds,
  checklistDate,
}: {
  groupId: string;
  usersIds: string[];
  checklistDate: Date;
}) {
  await prisma.checklistUsers.deleteMany({
    where: {
      checklist: {
        groupId,
        date: { gte: checklistDate },
      },
    },
  });

  const checklists = await prisma.checklist.findMany({
    select: {
      id: true,
    },

    where: {
      groupId,
      date: { gte: checklistDate },
    },
  });

  for (const userId of usersIds) {
    await prisma.checklistUsers.createMany({
      data: checklists.map((checklist) => ({
        checklistId: checklist.id,
        userId,
      })),
    });
  }
}
