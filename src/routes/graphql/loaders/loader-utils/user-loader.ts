import { PrismaClient } from '@prisma/client';

export const getUserLoaderData =
  (prisma: PrismaClient) => async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds as string[] } },
    });

    return userIds.map((id) => users.find((user) => user.id === id));
  };
